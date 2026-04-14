import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent } from "react";
import type Phaser from "phaser";
import "./App.css";
import { gameEvents } from "./game/events";
import { SHOP_ITEMS } from "./game/levels";
import { createGame } from "./game/createGame";
import {
  addTokens,
  buildReport,
  getState,
  purchase,
  refreshAfterContentImport,
  resetAll,
  spendTokens,
  subscribe
} from "./game/store";
import { importLevelsFromCsv, importLevelsFromJson, reportToCsv } from "./game/teacher";
import type { PlayerState } from "./game/types";

const AUDIO_SETTINGS_KEY = "word-quest-audio-settings-v1";
const TEACHER_PASSWORD_KEY = "word-quest-teacher-password-v1";
const TEST_HISTORY_KEY = "word-quest-test-history-v1";
const LOTTERY_COST_KEY = "word-quest-lottery-cost-v1";
const LOTTERY_PRIZES_KEY = "word-quest-lottery-prizes-v1";
const DEFAULT_LOTTERY_COST = 50;
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

type Mode = "practice" | "test";

type LotteryPrize = { id: string; label: string; weight: number };

type ConfettiPiece = {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  isCircle: boolean;
};

const DEFAULT_STORED_PRIZES: LotteryPrize[] = [
  { id: "lollipop", label: "棒棒糖", weight: 30 },
  { id: "chocolate", label: "巧克力", weight: 25 },
  { id: "jelly", label: "果冻", weight: 25 },
  { id: "cash5", label: "现金 ¥5", weight: 15 },
  { id: "cash10", label: "现金 ¥10", weight: 5 }
];

type TestRecord = {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  target: number;
  correct: number;
  score: number;
  wrongWords: string[];
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
  const [mode, setMode] = useState<Mode>("practice");
  const modeRef = useRef<Mode>("practice");
  const [lotteryOpen, setLotteryOpen] = useState(false);
  const [lotteryCost, setLotteryCost] = useState<number>(() => loadLotteryCost());
  const [storedPrizes, setStoredPrizes] = useState<LotteryPrize[]>(() => loadStoredPrizes());
  const [lastPrize, setLastPrize] = useState<LotteryPrize | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const testStartTime = useRef<number>(0);
  const testWrongWords = useRef<string[]>([]);
  const [testHistory, setTestHistory] = useState<TestRecord[]>(() => loadTestHistory());
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
    gameEvents.on("question-complete", (payload: { correct: boolean; word: string }) => {
      if (modeRef.current === "practice") {
        setCanGoNext(true);
        return;
      }
      // test mode: auto-advance handled by ChallengeScene; track progress + record
      if (!payload.correct) {
        testWrongWords.current.push(payload.word);
      }
      setTestState((prev) => {
        if (!prev.running) return prev;
        const answered = prev.answered + 1;
        const correct = prev.correct + (payload.correct ? 1 : 0);
        if (answered >= prev.target) {
          const pct = Math.round((correct / prev.target) * 100);
          const endTime = Date.now();
          const record: TestRecord = {
            id: String(endTime),
            startTime: testStartTime.current,
            endTime,
            duration: Math.round((endTime - testStartTime.current) / 1000),
            target: prev.target,
            correct,
            score: pct,
            wrongWords: [...testWrongWords.current]
          };
          saveTestRecord(record);
          setTestHistory(loadTestHistory());
          gameEvents.emit("command-set-mode", { testMode: false });
          const allCorrect = correct === prev.target;
          const tokenBonus = correct * 2 + (allCorrect ? prev.target : 0);
          addTokens(tokenBonus);
          const bonusNote = allCorrect ? ` Perfect score bonus: +${prev.target} tokens!` : "";
          setFeedback({
            message: `Test complete: ${correct}/${prev.target} correct (${pct}%). +${tokenBonus} tokens.${bonusNote}`,
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

  useEffect(() => {
    if (lastPrize && lastPrize.id !== "replay") {
      setConfetti(generateConfetti(55));
      const t = setTimeout(() => setConfetti([]), 3600);
      return () => clearTimeout(t);
    } else {
      setConfetti([]);
    }
  }, [lastPrize]);

  const switchMode = (newMode: Mode) => {
    if (testState.running) return;
    setMode(newMode);
    modeRef.current = newMode;
    setTestState({ running: false, finished: false, target: testLength, answered: 0, correct: 0 });
    setCanGoNext(false);
    setFeedback({ message: "", good: false });
    gameEvents.emit("command-set-mode", { testMode: false });
    gameEvents.emit("command-next");
  };

  const onNext = () => {
    if (!canGoNext) return;
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

  const quitTest = () => {
    setTestState({ running: false, finished: false, target: testLength, answered: 0, correct: 0 });
    setCanGoNext(false);
    setFeedback({ message: "", good: false });
    gameEvents.emit("command-set-mode", { testMode: false });
    gameEvents.emit("command-next");
  };

  const startTest = () => {
    const target = testLength;
    testStartTime.current = Date.now();
    testWrongWords.current = [];
    setTestState({ running: true, finished: false, target, answered: 0, correct: 0 });
    setCanGoNext(false);
    setFeedback({ message: "", good: false });
    gameEvents.emit("command-set-mode", { testMode: true });
    gameEvents.emit("command-next");
  };

  const getEffectivePrizes = (prizes: LotteryPrize[]): LotteryPrize[] => {
    const total = prizes.reduce((sum, p) => sum + p.weight, 0);
    const replayWeight = Math.max(0, 100 - total);
    return [{ id: "replay", label: "再来一次", weight: replayWeight }, ...prizes];
  };

  const drawLottery = () => {
    const result = spendTokens(lotteryCost);
    if (!result.ok) return;

    const prizes = getEffectivePrizes(storedPrizes);
    const winner = pickPrize(prizes);
    const winnerIndex = prizes.findIndex((p) => p.id === winner.id);
    const n = prizes.length;

    // Build cycling sequence: 4 full rotations ending exactly on winnerIndex
    const seq: number[] = [];
    for (let i = 0; i < n * 4 + winnerIndex + 1; i++) {
      seq.push(i % n);
    }

    // Delays: fast → gradually slower
    const delays = seq.map((_, i) => {
      const t = i / seq.length;
      if (t < 0.45) return 65;
      if (t < 0.7) return 130;
      return Math.round(200 + ((t - 0.7) / 0.3) * 320);
    });

    setDrawing(true);
    setLastPrize(null);
    setHighlightIndex(-1);

    let step = 0;
    const tick = () => {
      setHighlightIndex(seq[step]);
      if (step === seq.length - 1) {
        setLastPrize(winner);
        setDrawing(false);
      } else {
        step++;
        setTimeout(tick, delays[step]);
      }
    };
    setTimeout(tick, delays[0]);
  };

  const updatePrize = (index: number, field: "label" | "weight", value: string | number) => {
    const updated = storedPrizes.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    setStoredPrizes(updated);
    saveStoredPrizes(updated);
  };

  const removePrize = (index: number) => {
    const updated = storedPrizes.filter((_, i) => i !== index);
    setStoredPrizes(updated);
    saveStoredPrizes(updated);
  };

  const addPrize = () => {
    const updated = [...storedPrizes, { id: `prize-${Date.now()}`, label: "新奖品", weight: 0 }];
    setStoredPrizes(updated);
    saveStoredPrizes(updated);
  };

  const clearTestHistory = () => {
    localStorage.removeItem(TEST_HISTORY_KEY);
    setTestHistory([]);
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

  const testLeft = Math.max(0, testState.target - testState.answered);
  const finalScore = Math.round((testState.correct / testState.target) * 100);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-row">
          <h1>Word Quest: Northern Trails</h1>
          <div className="mode-toggle">
            <button
              className={mode === "practice" ? "active" : ""}
              onClick={() => switchMode("practice")}
              disabled={testState.running}
            >
              Practice
            </button>
            <button
              className={mode === "test" ? "active" : ""}
              onClick={() => switchMode("test")}
              disabled={testState.running}
            >
              Test
            </button>
          </div>
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
        {mode === "practice" ? (
          <>
            <div className="progress-wrap">
              <span>Practice Mode</span>
              <span>
                Streak: <strong>{state.streak}</strong>
              </span>
            </div>
            <div className="helper-text">Answer questions to earn XP and stars.</div>
          </>
        ) : (
          <>
            <div className="progress-wrap">
              <span>
                {testState.finished ? "Test Complete" : testState.running ? "Test In Progress" : "Test Mode"}
              </span>
              {(testState.running || testState.finished) && (
                <>
                  <span>Total: {testState.target}</span>
                  <span>Left: {testLeft}</span>
                </>
              )}
            </div>
            {testState.finished ? (
              <div className="zone-message">
                Final Score: {finalScore}% ({testState.correct}/{testState.target})
              </div>
            ) : testState.running ? (
              <div className="helper-text">{testLeft} questions remaining.</div>
            ) : (
              <div className="test-start-row">
                <select
                  value={String(testLength)}
                  onChange={(event) => setTestLength(Number(event.target.value) as 10 | 20 | 50)}
                >
                  {TEST_LENGTH_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} questions
                    </option>
                  ))}
                </select>
                <button onClick={startTest}>Start Test</button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="game-frame">
        <div id="phaser-root" />
      </section>

      <section className="actions">
        <button onClick={onHearWord} disabled={mode === "test" && testState.running}>
          Hear Word
        </button>
        {mode === "practice" ? (
          <button onClick={onNext} disabled={!canGoNext}>
            Next Challenge
          </button>
        ) : testState.running ? (
          <button className="danger" onClick={quitTest}>Quit Test</button>
        ) : (
          <button onClick={startTest}>{testState.finished ? "New Test" : "Start Test"}</button>
        )}
        <button onClick={() => setShopOpen(true)}>Open Camp Shop</button>
        <button onClick={openTeacherMode}>Teacher Mode</button>
        <button
          onClick={() => { setLotteryOpen(true); setLastPrize(null); }}
          disabled={state.tokens < lotteryCost}
        >
          Lottery ({lotteryCost} tokens)
        </button>
      </section>

      {lotteryOpen && (() => {
        const effectivePrizes = getEffectivePrizes(storedPrizes);
        return (
          <section className="shop-modal" role="dialog" aria-label="Lottery">
            <div className="shop-content">
              <h2>抽奖</h2>
              <p className="helper-text">
                消耗 {lotteryCost} tokens — 当前持有 {state.tokens}
              </p>
              <div className="lottery-prizes">
                {effectivePrizes.map((prize, index) => (
                  <div
                    key={prize.id}
                    className={[
                      "prize-card",
                      drawing && highlightIndex === index ? "highlighted" : "",
                      !drawing && lastPrize?.id === prize.id ? "winner" : "",
                      !drawing && lastPrize && lastPrize.id !== prize.id ? "loser" : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="prize-label">{prize.label}</div>
                  </div>
                ))}
              </div>
              {lastPrize && (
                <div className="lottery-result">
                  {lastPrize.id === "replay" ? "再来一次！" : `恭喜获得：${lastPrize.label}！`}
                </div>
              )}
              <div className="teacher-actions">
                <button onClick={drawLottery} disabled={drawing || state.tokens < lotteryCost}>
                  {drawing ? "抽奖中…" : `抽奖（${lotteryCost} tokens）`}
                </button>
                <button
                  onClick={() => {
                    setLotteryOpen(false);
                    setLastPrize(null);
                    setHighlightIndex(-1);
                    setConfetti([]);
                  }}
                >
                  关闭
                </button>
              </div>
            </div>
          </section>
        );
      })()}

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
                <div className="teacher-actions">
                  <button
                    className="danger"
                    onClick={() => {
                      localStorage.setItem(TEACHER_PASSWORD_KEY, DEFAULT_TEACHER_PASSWORD);
                      setTeacherAuthMessage("Password has been reset to default.");
                      setTeacherAuthGood(true);
                      setTeacherPasswordInput("");
                    }}
                  >
                    Reset to Default Password
                  </button>
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
                <h3>Test History</h3>
                {testHistory.length === 0 ? (
                  <p className="helper-text">No tests recorded yet.</p>
                ) : (
                  <>
                    <div className="test-history">
                      {testHistory.map((record) => (
                        <div key={record.id} className="test-record">
                          <div className="test-record-header">
                            <span className="helper-text">{formatTestDate(record.startTime)}</span>
                            <span className={record.score >= 70 ? "zone-message" : "test-record-fail"}>
                              {record.score}% ({record.correct}/{record.target})
                            </span>
                            <span className="helper-text">{formatTestDuration(record.duration)}</span>
                          </div>
                          {record.wrongWords.length > 0 && (
                            <div className="test-record-wrong">
                              Missed: {record.wrongWords.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="teacher-actions">
                      <button className="danger" onClick={clearTestHistory}>
                        Clear History
                      </button>
                    </div>
                  </>
                )}
                <hr />
                <h3>Lottery Settings</h3>
                <label htmlFor="lotteryCostInput" className="field-label">
                  Tokens per Draw
                </label>
                <input
                  id="lotteryCostInput"
                  type="number"
                  min="1"
                  max="9999"
                  value={lotteryCost}
                  onChange={(event) => {
                    const val = Math.max(1, Number(event.target.value));
                    setLotteryCost(val);
                    saveLotteryCost(val);
                  }}
                />
                <label className="field-label">Prizes</label>
                <div className="prize-editor">
                  <div className="prize-row replay-row">
                    <span>再来一次</span>
                    <span>{Math.max(0, 100 - storedPrizes.reduce((s, p) => s + p.weight, 0))}%</span>
                    <span className="helper-text">自动补齐</span>
                  </div>
                  {storedPrizes.map((prize, i) => (
                    <div key={prize.id} className="prize-row">
                      <input
                        type="text"
                        value={prize.label}
                        onChange={(e) => updatePrize(i, "label", e.target.value)}
                        placeholder="奖品名称"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={prize.weight}
                        onChange={(e) =>
                          updatePrize(i, "weight", Math.max(0, Number(e.target.value)))
                        }
                      />
                      <span>%</span>
                      <button className="danger" onClick={() => removePrize(i)}>
                        删除
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addPrize}>+ 添加奖品</button>
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

      <footer
        className={
          mode === "test" && testState.running
            ? "feedback"
            : feedback.message
              ? feedback.good
                ? "feedback good"
                : "feedback bad"
              : "feedback"
        }
      >
        {mode === "test" && testState.running ? "" : feedback.message}
      </footer>

      {confetti.length > 0 && (
        <div className="confetti-overlay" aria-hidden="true">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece"
              style={
                {
                  left: `${piece.x}%`,
                  width: `${piece.size}px`,
                  height: `${piece.isCircle ? piece.size : piece.size * 2.2}px`,
                  background: piece.color,
                  borderRadius: piece.isCircle ? "50%" : "3px",
                  animationDuration: `${piece.duration}s`,
                  animationDelay: `${piece.delay}s`,
                  "--drift": `${piece.drift}px`
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
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

const CONFETTI_COLORS = ["#f43f5e", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 7 + Math.random() * 7,
    duration: 2.4 + Math.random() * 1.6,
    delay: Math.random() * 0.7,
    drift: (Math.random() - 0.5) * 140,
    isCircle: Math.random() > 0.55
  }));
}

function loadStoredPrizes(): LotteryPrize[] {
  try {
    const raw = localStorage.getItem(LOTTERY_PRIZES_KEY);
    if (!raw) return DEFAULT_STORED_PRIZES.map((p) => ({ ...p }));
    const parsed = JSON.parse(raw) as LotteryPrize[];
    return parsed.length > 0 ? parsed : DEFAULT_STORED_PRIZES.map((p) => ({ ...p }));
  } catch {
    return DEFAULT_STORED_PRIZES.map((p) => ({ ...p }));
  }
}

function saveStoredPrizes(prizes: LotteryPrize[]): void {
  localStorage.setItem(LOTTERY_PRIZES_KEY, JSON.stringify(prizes));
}

function loadLotteryCost(): number {
  const raw = localStorage.getItem(LOTTERY_COST_KEY);
  const n = raw ? Number(raw) : DEFAULT_LOTTERY_COST;
  return n > 0 ? n : DEFAULT_LOTTERY_COST;
}

function saveLotteryCost(cost: number): void {
  localStorage.setItem(LOTTERY_COST_KEY, String(cost));
}

function pickPrize(prizes: LotteryPrize[]): LotteryPrize {
  const total = prizes.reduce((sum, p) => sum + p.weight, 0);
  let rand = Math.random() * total;
  for (const prize of prizes) {
    rand -= prize.weight;
    if (rand <= 0) return prize;
  }
  return prizes[prizes.length - 1];
}

function loadTestHistory(): TestRecord[] {
  try {
    const raw = localStorage.getItem(TEST_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TestRecord[];
  } catch {
    return [];
  }
}

function saveTestRecord(record: TestRecord): void {
  const history = loadTestHistory();
  history.unshift(record);
  if (history.length > 50) history.length = 50;
  localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(history));
}

function formatTestDate(ts: number): string {
  return new Date(ts).toLocaleString();
}

function formatTestDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
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
