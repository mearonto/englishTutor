import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type Phaser from "phaser";
import "./App.css";
import { gameEvents } from "./game/events";
import { SHOP_ITEMS } from "./game/levels";
import { createGame } from "./game/createGame";
import {
  buildReport,
  getState,
  purchase,
  refreshAfterContentImport,
  resetAll,
  subscribe
} from "./game/store";
import { importLevelsFromCsv, importLevelsFromJson, reportToCsv } from "./game/teacher";
import type { PlayerState } from "./game/types";

const AUDIO_SETTINGS_KEY = "word-quest-audio-settings-v1";
const TEACHER_PASSWORD_KEY = "word-quest-teacher-password-v1";
const DEFAULT_TEACHER_PASSWORD = "2222";
const SPEED_OPTIONS = [
  { label: "Slow", value: 0.75 },
  { label: "Normal", value: 0.88 },
  { label: "Fast", value: 1.02 }
] as const;
const TEST_LENGTH_OPTIONS = [10, 20, 50] as const;

type TestState = {
  running: boolean;
  finished: boolean;
  target: 10 | 20 | 50;
  answered: number;
  correct: number;
};

function App() {
  const [state, setState] = useState<PlayerState>(getState());
  const [feedback, setFeedback] = useState<{ message: string; good: boolean }>({
    message: "",
    good: false
  });
  const [shopOpen, setShopOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [teacherUnlocked, setTeacherUnlocked] = useState(false);
  const [teacherPasswordInput, setTeacherPasswordInput] = useState("");
  const [teacherAuthMessage, setTeacherAuthMessage] = useState("");
  const [teacherAuthGood, setTeacherAuthGood] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(0.88);
  const [testLength, setTestLength] = useState<10 | 20 | 50>(10);
  const [canGoNext, setCanGoNext] = useState(false);
  const [testState, setTestState] = useState<TestState>({
    running: false,
    finished: false,
    target: 10,
    answered: 0,
    correct: 0
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const [changePasswordGood, setChangePasswordGood] = useState(false);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    ensureTeacherPassword();
    const saved = loadAudioSettings();
    setAudioEnabled(saved.enabled);
    setSpeechRate(saved.rate);

    gameRef.current = createGame("phaser-root");
    const unsub = subscribe((nextState) => {
      setState(nextState);
    });

    const feedbackHandler = (payload: { message: string; good: boolean }) => setFeedback(payload);
    gameEvents.on("feedback", feedbackHandler);
    gameEvents.on("round-start", () => setCanGoNext(false));
    gameEvents.on("question-complete", (payload: { correct: boolean }) => {
      setCanGoNext(true);
      setTestState((prev) => {
        if (!prev.running) {
          return prev;
        }
        const answered = prev.answered + 1;
        const correct = prev.correct + (payload.correct ? 1 : 0);
        if (answered >= prev.target) {
          const pct = Math.round((correct / prev.target) * 100);
          setFeedback({
            message: `Test complete: ${correct}/${prev.target} correct (${pct}%).`,
            good: pct >= 70
          });
          return { ...prev, answered, correct, running: false, finished: true };
        }
        return { ...prev, answered, correct };
      });
    });

    return () => {
      unsub();
      gameEvents.off("feedback", feedbackHandler);
      gameEvents.off("round-start");
      gameEvents.off("question-complete");
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    saveAudioSettings({ enabled: audioEnabled, rate: speechRate });
    gameEvents.emit("command-audio-settings", { enabled: audioEnabled, rate: speechRate });
  }, [audioEnabled, speechRate]);

  const onNext = () => {
    if (testState.finished) {
      return;
    }
    if (testState.running && !canGoNext) {
      return;
    }
    gameEvents.emit("command-next");
  };
  const onHearWord = () => {
    if (!audioEnabled) {
      setFeedback({ message: "Audio is off. Enable it in Teacher Mode.", good: false });
      return;
    }
    gameEvents.emit("command-pronounce");
  };

  const openTeacherMode = () => {
    setTeacherOpen(true);
    setTeacherUnlocked(false);
    setTeacherPasswordInput("");
    setTeacherAuthMessage("");
    setOldPassword("");
    setNewPassword("");
    setChangePasswordMessage("");
  };

  const closeTeacherMode = () => {
    setTeacherOpen(false);
    setTeacherUnlocked(false);
    setTeacherPasswordInput("");
    setTeacherAuthMessage("");
    setOldPassword("");
    setNewPassword("");
    setChangePasswordMessage("");
  };

  const unlockTeacherMode = () => {
    const current = getTeacherPassword();
    if (teacherPasswordInput === current) {
      setTeacherUnlocked(true);
      setTeacherAuthMessage("Access granted.");
      setTeacherAuthGood(true);
      setTeacherPasswordInput("");
      return;
    }
    setTeacherAuthMessage("Wrong password.");
    setTeacherAuthGood(false);
  };

  const onReset = () => {
    resetAll();
    setTestState({ running: false, finished: false, target: testLength, answered: 0, correct: 0 });
    setCanGoNext(false);
    setFeedback({ message: "Progress reset. New trail started.", good: false });
    gameEvents.emit("command-next");
  };

  const onBuy = (itemId: string) => {
    const result = purchase(itemId);
    setFeedback({ message: result.message, good: result.ok });
  };

  const onTeacherFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    const isCsv = file.name.toLowerCase().endsWith(".csv");
    const result = isCsv ? importLevelsFromCsv(text) : importLevelsFromJson(text);

    if (result.ok) {
      refreshAfterContentImport();
      gameEvents.emit("command-next");
    }
    setFeedback({ message: result.message, good: result.ok });
    event.target.value = "";
  };

  const exportJsonReport = () => {
    const report = buildReport();
    downloadText(`word-quest-report-${dateStamp()}.json`, JSON.stringify(report, null, 2), "application/json");
    setFeedback({ message: "Exported JSON progress report.", good: true });
  };

  const exportCsvReport = () => {
    const report = buildReport();
    downloadText(`word-quest-report-${dateStamp()}.csv`, reportToCsv(report), "text/csv");
    setFeedback({ message: "Exported CSV progress report.", good: true });
  };

  const startTest = () => {
    const target = testLength;
    setTestState({ running: true, finished: false, target, answered: 0, correct: 0 });
    setCanGoNext(false);
    setFeedback({ message: `Test started: ${target} questions.`, good: true });
    setTeacherOpen(false);
    gameEvents.emit("command-next");
  };

  const changeTeacherPassword = () => {
    const current = getTeacherPassword();
    if (oldPassword !== current) {
      setChangePasswordMessage("Old password is incorrect.");
      setChangePasswordGood(false);
      return;
    }
    if (!newPassword.trim()) {
      setChangePasswordMessage("New password cannot be empty.");
      setChangePasswordGood(false);
      return;
    }
    localStorage.setItem(TEACHER_PASSWORD_KEY, newPassword);
    setChangePasswordMessage("Teacher password updated.");
    setChangePasswordGood(true);
    setOldPassword("");
    setNewPassword("");
  };

  const testScorePct =
    testState.answered > 0 ? Math.round((testState.correct / testState.answered) * 100) : 0;
  const testWrong = Math.max(0, testState.answered - testState.correct);
  const testLeft = Math.max(0, testState.target - testState.answered);
  const finalScore = Math.round((testState.correct / testState.target) * 100);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-row">
          <h1>Word Quest: Northern Trails</h1>
          <button onClick={startTest}>Start Test ({testLength})</button>
        </div>
        <div className="stats">
          <span>
            Grade: <strong>{state.gradeUnlocked}</strong>
          </span>
          <span>
            XP: <strong>{state.xp}</strong>
          </span>
          <span>
            Stars: <strong>{state.stars}</strong>
          </span>
          <span>
            Tokens: <strong>{state.tokens}</strong>
          </span>
          <span>
            Streak: <strong>{state.streak}</strong>
          </span>
        </div>
      </header>

      <section className="map-panel metrics-panel">
        <div className="progress-wrap">
          <span>
            {testState.finished
              ? "Test Complete"
              : testState.running
                ? "Test In Progress"
                : "Ready for Test"}
          </span>
          <span>Total: {testState.target}</span>
          <span>Left: {testState.running || testState.finished ? testLeft : testState.target}</span>
          <span>Correct: {testState.correct}</span>
          <span>Wrong: {testWrong}</span>
        </div>
        {testState.finished ? (
          <div className="zone-message">
            Final Score: {finalScore}% ({testState.correct}/{testState.target})
          </div>
        ) : testState.running ? (
          <div className="helper-text">
            Current Score: {testScorePct}% ({testState.correct}/{testState.answered || 1})
          </div>
        ) : (
          <div className="helper-text">Configure and start a test in Teacher Mode.</div>
        )}
      </section>

      <section className="game-frame">
        <div id="phaser-root" />
      </section>

      <section className="actions">
        <button onClick={onHearWord}>Hear Word</button>
        <button onClick={onNext} disabled={testState.running ? !canGoNext || testState.finished : false}>
          {testState.running ? "Next Test Question" : "Next Challenge"}
        </button>
        <button onClick={() => setShopOpen(true)}>Open Camp Shop</button>
        <button onClick={openTeacherMode}>Teacher Mode</button>
      </section>

      {shopOpen && (
        <section className="shop-modal" role="dialog" aria-label="Camp Shop">
          <div className="shop-content">
            <h2>Camp Shop</h2>
            <p>Spend tokens on cosmetics and helper boosts.</p>
            <ul>
              {SHOP_ITEMS.map((item) => {
                const owned = state.inventory.includes(item.id);
                return (
                  <li key={item.id}>
                    <button disabled={owned} onClick={() => onBuy(item.id)}>
                      {owned ? `Owned: ${item.label}` : `Buy ${item.label} (${item.cost} tokens)`}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button onClick={() => setShopOpen(false)}>Close</button>
          </div>
        </section>
      )}

      {teacherOpen && (
        <section className="shop-modal" role="dialog" aria-label="Teacher Mode">
          <div className="shop-content">
            <h2>Teacher Mode</h2>
            {!teacherUnlocked ? (
              <>
                <p>Enter teacher password to continue.</p>
                <label htmlFor="teacherPassword" className="field-label">
                  Password
                </label>
                <input
                  id="teacherPassword"
                  type="password"
                  value={teacherPasswordInput}
                  onChange={(event) => setTeacherPasswordInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      unlockTeacherMode();
                    }
                  }}
                />
                {teacherAuthMessage && (
                  <p className={teacherAuthGood ? "inline-note good" : "inline-note bad"}>{teacherAuthMessage}</p>
                )}
                <div className="teacher-actions">
                  <button onClick={unlockTeacherMode}>Unlock</button>
                  <button onClick={closeTeacherMode}>Close</button>
                </div>
              </>
            ) : (
              <>
                <p>Import custom word packs (.json or .csv) and export learner progress reports.</p>
                <label htmlFor="packUpload" className="field-label">
                  Import Word Pack
                </label>
                <input id="packUpload" type="file" accept=".json,.csv" onChange={onTeacherFile} />
                <p className="helper-text">
                  CSV headers:
                  id,grade,type,word,prompt,choice1,choice2,choice3,answer,definition,contextSentence,hint1,hint2,coach
                </p>
                <p className="helper-text">
                  Supported type values: spelling, homophone, prefix, suffix, multiple-meaning, word-relationships,
                  compound-word, context-clues
                </p>
                <div className="teacher-actions">
                  <button onClick={exportJsonReport}>Export Report (JSON)</button>
                  <button onClick={exportCsvReport}>Export Report (CSV)</button>
                </div>
                <hr />
                <h3>Contest Test Mode</h3>
                <label htmlFor="testLength" className="field-label">
                  Number of Questions
                </label>
                <select
                  id="testLength"
                  value={String(testLength)}
                  onChange={(event) => setTestLength(Number(event.target.value) as 10 | 20 | 50)}
                >
                  {TEST_LENGTH_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} questions
                    </option>
                  ))}
                </select>
                <hr />
                <h3>Audio Settings</h3>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={audioEnabled}
                    onChange={(event) => setAudioEnabled(event.target.checked)}
                  />
                  <span>Audio On (TTS + success/miss cues)</span>
                </label>
                <label htmlFor="speechRate" className="field-label">
                  Pronunciation Speed
                </label>
                <select
                  id="speechRate"
                  value={String(speechRate)}
                  onChange={(event) => setSpeechRate(Number(event.target.value))}
                  disabled={!audioEnabled}
                >
                  {SPEED_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <hr />
                <h3>Change Teacher Password</h3>
                <label htmlFor="oldPassword" className="field-label">
                  Old Password
                </label>
                <input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                />
                <label htmlFor="newPassword" className="field-label">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
                {changePasswordMessage && (
                  <p className={changePasswordGood ? "inline-note good" : "inline-note bad"}>
                    {changePasswordMessage}
                  </p>
                )}
                <div className="teacher-actions">
                  <button onClick={changeTeacherPassword}>Change Password</button>
                </div>
                <div className="teacher-actions">
                  <button className="danger" onClick={onReset}>
                    Reset Save
                  </button>
                </div>
                <button onClick={closeTeacherMode}>Close</button>
              </>
            )}
          </div>
        </section>
      )}

      <footer className={feedback.message ? (feedback.good ? "feedback good" : "feedback bad") : "feedback"}>{feedback.message}</footer>
    </main>
  );
}

function downloadText(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function dateStamp(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function loadAudioSettings(): { enabled: boolean; rate: number } {
  try {
    const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
    if (!raw) {
      return { enabled: true, rate: 0.88 };
    }
    const parsed = JSON.parse(raw) as { enabled?: boolean; rate?: number };
    const enabled = parsed.enabled ?? true;
    const rate = typeof parsed.rate === "number" ? parsed.rate : 0.88;
    return { enabled, rate };
  } catch {
    return { enabled: true, rate: 0.88 };
  }
}

function saveAudioSettings(settings: { enabled: boolean; rate: number }): void {
  localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
}

function ensureTeacherPassword(): void {
  const existing = localStorage.getItem(TEACHER_PASSWORD_KEY);
  if (!existing) {
    localStorage.setItem(TEACHER_PASSWORD_KEY, DEFAULT_TEACHER_PASSWORD);
  }
}

function getTeacherPassword(): string {
  return localStorage.getItem(TEACHER_PASSWORD_KEY) || DEFAULT_TEACHER_PASSWORD;
}

export default App;
