import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import type Phaser from "phaser";
import "./App.css";
import { gameEvents } from "./game/events";
import { getCustomLevelsCount, SHOP_ITEMS } from "./game/levels";
import { createGame } from "./game/createGame";
import {
  buildReport,
  getState,
  masteryPercent,
  purchase,
  refreshAfterContentImport,
  resetAll,
  subscribe,
  zoneLabel
} from "./game/store";
import { importLevelsFromCsv, importLevelsFromJson, reportToCsv } from "./game/teacher";
import type { PlayerState } from "./game/types";

const AUDIO_SETTINGS_KEY = "word-quest-audio-settings-v1";
const SPEED_OPTIONS = [
  { label: "Slow", value: 0.75 },
  { label: "Normal", value: 0.88 },
  { label: "Fast", value: 1.02 }
] as const;

function App() {
  const [state, setState] = useState<PlayerState>(getState());
  const [feedback, setFeedback] = useState<{ message: string; good: boolean }>({
    message: "",
    good: false
  });
  const [shopOpen, setShopOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [customCount, setCustomCount] = useState(getCustomLevelsCount());
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(0.88);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const saved = loadAudioSettings();
    setAudioEnabled(saved.enabled);
    setSpeechRate(saved.rate);

    gameRef.current = createGame("phaser-root");
    const unsub = subscribe((nextState) => {
      setState(nextState);
      setCustomCount(getCustomLevelsCount());
    });

    const feedbackHandler = (payload: { message: string; good: boolean }) => setFeedback(payload);
    gameEvents.on("feedback", feedbackHandler);

    return () => {
      unsub();
      gameEvents.off("feedback", feedbackHandler);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    saveAudioSettings({ enabled: audioEnabled, rate: speechRate });
    gameEvents.emit("command-audio-settings", { enabled: audioEnabled, rate: speechRate });
  }, [audioEnabled, speechRate]);

  const mastery = useMemo(() => masteryPercent(), [state]);

  const onNext = () => gameEvents.emit("command-next");
  const onHearWord = () => {
    if (!audioEnabled) {
      setFeedback({ message: "Audio is off. Enable it in Teacher Mode.", good: false });
      return;
    }
    gameEvents.emit("command-pronounce");
  };

  const onReset = () => {
    resetAll();
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
      setCustomCount(getCustomLevelsCount());
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

  return (
    <main className="app-shell">
      <header className="topbar">
        <h1>Word Quest: Northern Trails</h1>
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

      <section className="map-panel">
        <div className="zone-message">{zoneLabel()}</div>
        <div className="progress-wrap">
          <label htmlFor="mastery">Grade 3 Mastery</label>
          <progress id="mastery" max={100} value={mastery} />
          <span>{mastery}%</span>
          <span>Custom Pack Levels: {customCount}</span>
        </div>
      </section>

      <section className="game-frame">
        <div id="phaser-root" />
      </section>

      <section className="actions">
        <button onClick={onHearWord}>Hear Word</button>
        <button onClick={onNext}>Next Challenge</button>
        <button onClick={() => setShopOpen(true)}>Open Camp Shop</button>
        <button onClick={() => setTeacherOpen(true)}>Teacher Mode</button>
        <button className="danger" onClick={onReset}>
          Reset Save
        </button>
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
            <p>Import custom word packs (.json or .csv) and export learner progress reports.</p>
            <label htmlFor="packUpload" className="field-label">
              Import Word Pack
            </label>
            <input id="packUpload" type="file" accept=".json,.csv" onChange={onTeacherFile} />
            <p className="helper-text">
              CSV headers: id,grade,type,word,prompt,choice1,choice2,choice3,answer,definition,contextSentence,hint1,hint2,coach
            </p>
            <div className="teacher-actions">
              <button onClick={exportJsonReport}>Export Report (JSON)</button>
              <button onClick={exportCsvReport}>Export Report (CSV)</button>
            </div>
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
            <button onClick={() => setTeacherOpen(false)}>Close</button>
          </div>
        </section>
      )}

      <footer className={feedback.good ? "feedback good" : "feedback bad"}>{feedback.message}</footer>
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

export default App;
