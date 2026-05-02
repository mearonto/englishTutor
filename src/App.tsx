import { useEffect, useRef, useState, useCallback, type CSSProperties, type ChangeEvent } from "react";
import { StudentPicker } from "./components/StudentPicker";
import { KnowledgeCard, type KnowledgeCardData } from "./components/KnowledgeCard";
import { studentsApi, testSessionsApi, type ApiStudent } from "./api/client";
import { loadQuestionPool, invalidateCache } from "./game/questionCache";
import { MiniGamesModal } from "./MiniGames";
import { FONT_SIZE_STORAGE_KEY, type FontSizePref } from "./game/ChallengeScene";
import type Phaser from "phaser";
import "./App.css";
import { gameEvents } from "./game/events";
import {
  ASTRONOMY_CATEGORY_LABELS,
  CANADA_CATEGORY_LABELS,
  MATH_KANGAROO_CATEGORY_LABELS,
  SHOP_ITEMS
} from "./game/levels";
import { createGame } from "./game/createGame";
import {
  addStars,
  addTokens,
  buildReport,
  getCurrentStudentId,
  getState,
  loadStudentState,
  purchase,
  refreshAfterContentImport,
  resetAll,
  setAstronomyCategories,
  setCanadaCategories,
  setMathKangarooCategories,
  setSubject,
  spendStars,
  spendTokens,
  subscribe
} from "./game/store";
import { importLevelsFromCsv, importLevelsFromJson, reportToCsv } from "./game/teacher";
import { QuestionTable } from "./components/teacher/QuestionTable";
import { StudentList } from "./components/teacher/StudentList";
import type { PlayerState } from "./game/types";

const AUDIO_SETTINGS_KEY = "word-quest-audio-settings-v1";
const TEACHER_PASSWORD_KEY = "word-quest-teacher-password-v1";
const TEST_HISTORY_KEY = "word-quest-test-history-v1";
const LOTTERY_COST_KEY = "word-quest-lottery-cost-v1";
const LOTTERY_PRIZES_KEY = "word-quest-lottery-prizes-v1";
const LOTTERY_HISTORY_KEY = "word-quest-lottery-history-v1";
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

type LotteryRecord = {
  id: string;
  time: number;
  prizeLabel: string;
};

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
  // ── Student session ────────────────────────────────────────────────────────
  const [currentStudent, setCurrentStudent] = useState<{ id: number; name: string; difficultyMin: number; difficultyMax: number } | null>(null);

  const [questionsLoading, setQuestionsLoading] = useState(false);

  const fetchPool = useCallback(async (
    studentId: number,
    subject: string,
    categories: string[],
    difficultyMin = 1,
    difficultyMax = 5,
  ) => {
    setQuestionsLoading(true);
    await loadQuestionPool(studentId, subject, categories, difficultyMin, difficultyMax);
    setQuestionsLoading(false);
    // Trigger a new question after pool is ready
    gameEvents.emit("command-next");
  }, []);

  const handleStudentSelect = useCallback(
    async (student: { id: number; name: string; data: ApiStudent }) => {
      const s = student.data;
      loadStudentState(student.id, s);
      setCurrentStudent({
        id: student.id,
        name: student.name,
        difficultyMin: s.difficulty_min ?? 1,
        difficultyMax: s.difficulty_max ?? 5,
      });

      // Apply per-student settings
      const fs = (s.font_size ?? "small") as FontSizePref;
      const tl = (s.test_length ?? 10) as 10 | 20 | 50;
      const ae = s.audio_enabled ?? true;
      const ar = Number(s.audio_rate ?? 0.88);

      setPendingFontSize(fs);
      setTestLength(tl);
      setAudioEnabled(ae);
      setSpeechRate(ar);
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, fs);
      gameEvents.emit("command-font-size", { size: fs });
      saveAudioSettings({ enabled: ae, rate: ar });

      // Per-student enabled subjects
      const es = (s.enabled_subjects?.length ? s.enabled_subjects : [...ALL_SUBJECTS]) as string[];
      setEnabledSubjects(es);
      setPendingEnabledSubjects(es);

      // Per-student lottery settings
      const lc = s.lottery_cost ?? 50;
      const lp = s.lottery_prizes?.length ? s.lottery_prizes : DEFAULT_STORED_PRIZES.map(p => ({ ...p }));
      const lh = s.lottery_history ?? [];
      setLotteryCost(lc);
      setStoredPrizes(lp);
      setLotteryHistory(lh);

      const cats = s.subject === "astronomy" ? (s.astronomy_categories ?? [])
        : s.subject === "canada" ? (s.canada_categories ?? [])
        : s.subject === "math-kangaroo" ? (s.math_kangaroo_categories ?? [])
        : [];
      await fetchPool(student.id, s.subject, cats, s.difficulty_min ?? 1, s.difficulty_max ?? 5);
    },
    [fetchPool]
  );

  const handleSwitchStudent = useCallback(() => {
    invalidateCache();
    setCurrentStudent(null);
    setTestState({ running: false, finished: false, target: 10, answered: 0, correct: 0 });
    setFeedback({ message: "", good: false });
    setCanGoNext(false);
    gameEvents.emit("command-set-mode", { testMode: false });
  }, []);

  const handleGuest = useCallback(() => {
    setCurrentStudent({ id: -1, name: "Guest", difficultyMin: 1, difficultyMax: 5 });
    // Use static levels — no fetch needed, cache stays empty → fallback path
    invalidateCache();
  }, []);

  // Async sync: whenever game state changes, push to API (debounced, fire-and-forget)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleSync = useCallback((playerState: PlayerState) => {
    const id = getCurrentStudentId();
    if (!id || id < 0) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      studentsApi.update(id, {
        grade_unlocked: playerState.gradeUnlocked,
        xp: playerState.xp,
        stars: playerState.stars,
        tokens: playerState.tokens,
        streak: playerState.streak,
        mastery3: playerState.mastery3,
        learned: playerState.learned,
        inventory: playerState.inventory,
        subject: playerState.subject,
        astronomy_categories: playerState.astronomyCategories,
        canada_categories: playerState.canadaCategories,
        math_kangaroo_categories: playerState.mathKangarooCategories,
      } as Partial<ApiStudent>).catch(() => {/* silent — localStorage is the fallback */});
    }, 2000);
  }, []);

  // ── Game state ─────────────────────────────────────────────────────────────
  const [state, setState] = useState<PlayerState>(getState());
  const [feedback, setFeedback] = useState<{ message: string; good: boolean }>({
    message: "",
    good: false
  });
  const [shopOpen, setShopOpen] = useState(false);
  const [miniGamesOpen, setMiniGamesOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [teacherUnlocked, setTeacherUnlocked] = useState(false);
  const [teacherPasswordInput, setTeacherPasswordInput] = useState("");
  const [teacherAuthMessage, setTeacherAuthMessage] = useState("");
  const [teacherAuthGood, setTeacherAuthGood] = useState(false);
  const [teacherTab, setTeacherTab] = useState<"questions" | "students" | "settings">("settings");
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
  const dbSessionIdRef = useRef<number | null>(null);
  const testStateRef = useRef<TestState>({
    running: false,
    finished: false,
    target: 10,
    answered: 0,
    correct: 0
  });
  const [testHistory, setTestHistory] = useState<TestRecord[]>(() => loadTestHistory());
  const [lotteryHistory, setLotteryHistory] = useState<LotteryRecord[]>(() => loadLotteryHistory());
  const [dragPrizeId, setDragPrizeId] = useState<string | null>(null);
  const [dragOverPrizeId, setDragOverPrizeId] = useState<string | null>(null);
  const [canGoNext, setCanGoNext] = useState(false);
  const [knowledgeCard, setKnowledgeCard] = useState<KnowledgeCardData | null>(null);
  const [testState, setTestState] = useState<TestState>({
    running: false,
    finished: false,
    target: 10,
    answered: 0,
    correct: 0
  });
  const [pendingAstroCats, setPendingAstroCats] = useState<string[]>([]);
  const [pendingCanadaCats, setPendingCanadaCats] = useState<string[]>([]);
  const [pendingMathKangarooCats, setPendingMathKangarooCats] = useState<string[]>([]);
  const ALL_SUBJECTS = ["astronomy", "canada", "math-kangaroo", "leon"] as const;
  const [enabledSubjects, setEnabledSubjects] = useState<string[]>([...ALL_SUBJECTS]);
  const [pendingEnabledSubjects, setPendingEnabledSubjects] = useState<string[]>([...ALL_SUBJECTS]);
  const [pendingFontSize, setPendingFontSize] = useState<FontSizePref>(
    () => (localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSizePref | null) ?? "small"
  );
  const [bonusTokenInput, setBonusTokenInput] = useState(0);
  const [bonusTokenMessage, setBonusTokenMessage] = useState("");
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
      scheduleSync(nextState);
    });

    const feedbackHandler = (payload: { message: string; good: boolean }) => setFeedback(payload);
    gameEvents.on("feedback", feedbackHandler);
    gameEvents.on("round-start", () => setCanGoNext(false));
    gameEvents.on("question-complete", (payload: {
      correct: boolean; word: string;
      definition?: string; contextSentence?: string; coach?: string;
      type?: string; subject?: string;
    }) => {
      if (modeRef.current === "practice") {
        // Show knowledge card — it triggers the next question on dismiss
        setKnowledgeCard({
          word: payload.word,
          definition: payload.definition ?? "",
          contextSentence: payload.contextSentence ?? "",
          coach: payload.coach ?? "",
          type: payload.type ?? "",
          subject: payload.subject ?? "",
          correct: payload.correct,
        });
        return;
      }
      // test mode: auto-advance handled by ChallengeScene; track progress + record
      if (!payload.correct) {
        testWrongWords.current.push(payload.word);
      }
      const prev = testStateRef.current;
      if (!prev.running) return;
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
        // Persist to DB (fire-and-forget)
        if (dbSessionIdRef.current) {
          testSessionsApi.finish(dbSessionIdRef.current, {
            score: correct, total: prev.target, wrong_words: [...testWrongWords.current],
          }).catch(() => {/* silent */});
          dbSessionIdRef.current = null;
        }
        gameEvents.emit("command-set-mode", { testMode: false });
        const allCorrect = correct === prev.target;
        const tokenBonus = correct * 2 + (allCorrect ? prev.target : 0);
        // Award tokens synchronously here so they are saved to localStorage
        // before any React state update, preventing loss on page restart
        addTokens(tokenBonus);
        const bonusNote = allCorrect ? ` Perfect score bonus: +${prev.target} tokens!` : "";
        setFeedback({
          message: `Test complete: ${correct}/${prev.target} correct (${pct}%). +${tokenBonus} tokens.${bonusNote}`,
          good: pct >= 70
        });
        const nextTestState: TestState = { ...prev, answered, correct, running: false, finished: true };
        testStateRef.current = nextTestState;
        setTestState(nextTestState);
      } else {
        const nextTestState: TestState = { ...prev, answered, correct };
        testStateRef.current = nextTestState;
        setTestState(nextTestState);
      }
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
    testStateRef.current = testState;
  }, [testState]);

  useEffect(() => {
    saveAudioSettings({ enabled: audioEnabled, rate: speechRate });
    gameEvents.emit("command-audio-settings", { enabled: audioEnabled, rate: speechRate });
    const sid = getCurrentStudentId();
    if (sid && sid > 0) {
      studentsApi.update(sid, { audio_enabled: audioEnabled, audio_rate: speechRate } as Partial<ApiStudent>).catch(() => {});
    }
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

  const dismissKnowledgeCard = useCallback(() => {
    setKnowledgeCard(null);
    gameEvents.emit("command-next");
  }, []);

  const switchSubject = (newSubject: import("./game/types").Subject) => {
    if (testState.running) return;
    setSubject(newSubject);
    setTestState({ running: false, finished: false, target: testLength, answered: 0, correct: 0 });
    setCanGoNext(false);
    setKnowledgeCard(null);
    setFeedback({ message: "", good: false });
    gameEvents.emit("command-set-mode", { testMode: false });
    const sid = currentStudent?.id ?? -1;
    const cats = newSubject === "astronomy" ? state.astronomyCategories
      : newSubject === "canada" ? state.canadaCategories
      : newSubject === "math-kangaroo" ? state.mathKangarooCategories
      : [];
    void fetchPool(sid, newSubject, cats, currentStudent?.difficultyMin ?? 1, currentStudent?.difficultyMax ?? 5);
  };

  const switchMode = (newMode: Mode) => {
    if (testState.running) return;
    setMode(newMode);
    modeRef.current = newMode;
    setTestState({ running: false, finished: false, target: testLength, answered: 0, correct: 0 });
    setCanGoNext(false);
    setKnowledgeCard(null);
    setFeedback({ message: "", good: false });
    // Tell Phaser immediately whether we're in test tab (suppresses all TTS)
    gameEvents.emit("command-set-mode", { testMode: newMode === "test" });
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
    const s = getState();
    setPendingAstroCats([...s.astronomyCategories]);
    setPendingCanadaCats([...s.canadaCategories]);
    setPendingMathKangarooCats([...s.mathKangarooCategories]);
    setPendingEnabledSubjects([...enabledSubjects]);
    setPendingFontSize((localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSizePref | null) ?? "small");
    setTeacherOpen(true);
    setTeacherUnlocked(false);
    setTeacherPasswordInput("");
    setTeacherAuthMessage("");
    setOldPassword("");
    setNewPassword("");
    setChangePasswordMessage("");
  };

  const closeTeacherMode = () => {
    const s = getState();
    const astroDiff =
      JSON.stringify([...pendingAstroCats].sort()) !==
      JSON.stringify([...s.astronomyCategories].sort());
    const canadaDiff =
      JSON.stringify([...pendingCanadaCats].sort()) !==
      JSON.stringify([...s.canadaCategories].sort());
    const kangarooDiff =
      JSON.stringify([...pendingMathKangarooCats].sort()) !==
      JSON.stringify([...s.mathKangarooCategories].sort());
    const prevFontSize = (localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSizePref | null) ?? "small";
    const fontSizeDiff = pendingFontSize !== prevFontSize;
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, pendingFontSize);
    gameEvents.emit("command-font-size", { size: pendingFontSize });
    setAstronomyCategories(pendingAstroCats);
    setCanadaCategories(pendingCanadaCats);
    setMathKangarooCategories(pendingMathKangarooCats);
    setEnabledSubjects(pendingEnabledSubjects);

    // If current subject was disabled, switch to first still-enabled subject
    const prevSubject = getState().subject;
    let subjectChanged = false;
    if (!pendingEnabledSubjects.includes(prevSubject) && pendingEnabledSubjects.length > 0) {
      const next = pendingEnabledSubjects[0] as import("./game/types").Subject;
      setSubject(next);
      subjectChanged = true;
    }

    // Persist per-student settings to DB
    const sid = getCurrentStudentId();
    if (sid && sid > 0) {
      studentsApi.update(sid, {
        font_size: pendingFontSize,
        test_length: testLength,
        astronomy_categories: pendingAstroCats,
        canada_categories: pendingCanadaCats,
        math_kangaroo_categories: pendingMathKangarooCats,
        enabled_subjects: pendingEnabledSubjects,
      } as Partial<ApiStudent>).catch(() => {});
    }

    if (astroDiff || canadaDiff || kangarooDiff || fontSizeDiff || subjectChanged) {
      // Re-fetch question pool so practice & test immediately reflect the new settings
      const finalSubject = getState().subject;
      const cats = finalSubject === "astronomy" ? pendingAstroCats
        : finalSubject === "canada" ? pendingCanadaCats
        : finalSubject === "math-kangaroo" ? pendingMathKangarooCats
        : [];
      setTestState({ running: false, finished: false, target: testLength, answered: 0, correct: 0 });
      setCanGoNext(false);
      setFeedback({ message: "", good: false });
      gameEvents.emit("command-set-mode", { testMode: false });
      void fetchPool(
        currentStudent?.id ?? -1,
        finalSubject,
        cats,
        currentStudent?.difficultyMin ?? 1,
        currentStudent?.difficultyMax ?? 5,
      );
    }
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
    dbSessionIdRef.current = null;
    setTestState({ running: true, finished: false, target, answered: 0, correct: 0 });
    setCanGoNext(false);
    setFeedback({ message: "", good: false });
    gameEvents.emit("command-set-mode", { testMode: true });
    gameEvents.emit("command-next");
    // Fire-and-forget: create DB session if a real student is logged in
    const sid = getCurrentStudentId();
    if (sid && sid > 0) {
      testSessionsApi.create({ student_id: sid, subject: getState().subject })
        .then((s) => { dbSessionIdRef.current = s.id; })
        .catch(() => {/* silent — localStorage is the fallback */});
    }
  };

  const getEffectivePrizes = (prizes: LotteryPrize[]): LotteryPrize[] => {
    const total = prizes.reduce((sum, p) => sum + p.weight, 0);
    const replayWeight = Math.max(0, 100 - total);
    return [{ id: "replay", label: "Please play again", weight: replayWeight }, ...prizes];
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
        const record: LotteryRecord = { id: String(Date.now()), time: Date.now(), prizeLabel: winner.label };
        const newHistory = [record, ...lotteryHistory].slice(0, 100);
        syncLotteryHistory(newHistory);
      } else {
        step++;
        setTimeout(tick, delays[step]);
      }
    };
    setTimeout(tick, delays[0]);
  };

  const syncLotteryPrizes = (updated: LotteryPrize[]) => {
    setStoredPrizes(updated);
    saveStoredPrizes(updated);
    const sid = getCurrentStudentId();
    if (sid && sid > 0) studentsApi.update(sid, { lottery_prizes: updated } as Partial<ApiStudent>).catch(() => {});
  };

  const syncLotteryHistory = (updated: LotteryRecord[]) => {
    setLotteryHistory(updated);
    localStorage.setItem(LOTTERY_HISTORY_KEY, JSON.stringify(updated));
    const sid = getCurrentStudentId();
    if (sid && sid > 0) studentsApi.update(sid, { lottery_history: updated } as Partial<ApiStudent>).catch(() => {});
  };

  const updatePrize = (index: number, field: "label" | "weight", value: string | number) => {
    syncLotteryPrizes(storedPrizes.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const removePrize = (index: number) => {
    syncLotteryPrizes(storedPrizes.filter((_, i) => i !== index));
  };

  const addPrize = () => {
    syncLotteryPrizes([...storedPrizes, { id: `prize-${Date.now()}`, label: "新奖品", weight: 0 }]);
  };

  const reorderPrizes = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const fromIndex = storedPrizes.findIndex((p) => p.id === fromId);
    const toIndex = storedPrizes.findIndex((p) => p.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const updated = [...storedPrizes];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    syncLotteryPrizes(updated);
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <h1>Happy Study for Matthew and Leon</h1>
            {currentStudent && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(255,255,255,0.15)", borderRadius: 20,
                padding: "0.2rem 0.75rem", fontSize: "0.85rem", fontWeight: 700 }}>
                👤 {currentStudent.name}
                <button onClick={handleSwitchStudent}
                  style={{ background: "rgba(255,255,255,0.25)", border: "none",
                    borderRadius: 12, padding: "1px 8px", cursor: "pointer",
                    fontSize: "0.75rem", color: "inherit", fontWeight: 600 }}>
                  切换
                </button>
              </span>
            )}
          </div>
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
        <div className="subject-toggle-row">
          {enabledSubjects.includes("astronomy") && (
            <button
              className={`subject-btn${state.subject === "astronomy" ? " active" : ""}`}
              onClick={() => { if (state.subject !== "astronomy") switchSubject("astronomy"); }}
              disabled={testState.running}
            >
              🔭 Astronomy
            </button>
          )}
          {enabledSubjects.includes("canada") && (
            <button
              className={`subject-btn${state.subject === "canada" ? " active" : ""}`}
              onClick={() => { if (state.subject !== "canada") switchSubject("canada"); }}
              disabled={testState.running}
            >
              🍁 Canada G4
            </button>
          )}
          {enabledSubjects.includes("math-kangaroo") && (
            <button
              className={`subject-btn${state.subject === "math-kangaroo" ? " active" : ""}`}
              onClick={() => { if (state.subject !== "math-kangaroo") switchSubject("math-kangaroo"); }}
              disabled={testState.running}
            >
              🦘 Math Kangaroo
            </button>
          )}
          {enabledSubjects.includes("leon") && (
            <button
              className={`subject-btn${state.subject === "leon" ? " active" : ""}`}
              onClick={() => { if (state.subject !== "leon") switchSubject("leon"); }}
              disabled={testState.running}
            >
              🧮 Leon Math
            </button>
          )}
        </div>
        {mode === "practice" ? (
          <>
            <div className="progress-wrap">
              <span>
                {state.subject === "astronomy"
                  ? `Astronomy${state.astronomyCategories.length === 1 ? ` • ${ASTRONOMY_CATEGORY_LABELS[state.astronomyCategories[0]] ?? state.astronomyCategories[0]}` : state.astronomyCategories.length > 1 ? ` • ${state.astronomyCategories.length} categories` : ""}`
                  : state.subject === "canada"
                    ? `Canada G4${state.canadaCategories.length === 1 ? ` • ${CANADA_CATEGORY_LABELS[state.canadaCategories[0]] ?? state.canadaCategories[0]}` : state.canadaCategories.length > 1 ? ` • ${state.canadaCategories.length} subjects` : ""}`
                    : state.subject === "leon"
                      ? "Leon Math"
                      : `Math Kangaroo${state.mathKangarooCategories.length === 1 ? ` • ${MATH_KANGAROO_CATEGORY_LABELS[state.mathKangarooCategories[0]] ?? state.mathKangarooCategories[0]}` : state.mathKangarooCategories.length > 1 ? ` • ${state.mathKangarooCategories.length} grades` : ""}`}
              </span>
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
            {!testState.running && !testState.finished && (
              <span style={{ fontSize: "0.8rem", color: state.subject === "astronomy" ? "#0099cc" : state.subject === "canada" ? "#cc5500" : state.subject === "leon" ? "#7c3aed" : "#0f766e", fontWeight: 700 }}>
                {state.subject === "astronomy"
                  ? (state.astronomyCategories.length === 1
                      ? `Astronomy • ${ASTRONOMY_CATEGORY_LABELS[state.astronomyCategories[0]] ?? state.astronomyCategories[0]}`
                      : state.astronomyCategories.length > 1
                        ? `Astronomy • ${state.astronomyCategories.length} categories`
                        : "Astronomy")
                  : state.subject === "canada"
                    ? (state.canadaCategories.length === 1
                        ? `Canada G4 • ${CANADA_CATEGORY_LABELS[state.canadaCategories[0]] ?? state.canadaCategories[0]}`
                        : state.canadaCategories.length > 1
                          ? `Canada G4 • ${state.canadaCategories.length} subjects`
                          : "Canada G4")
                    : state.subject === "leon"
                      ? "Leon Math"
                      : (state.mathKangarooCategories.length === 1
                          ? `Math Kangaroo • ${MATH_KANGAROO_CATEGORY_LABELS[state.mathKangarooCategories[0]] ?? state.mathKangarooCategories[0]}`
                          : state.mathKangarooCategories.length > 1
                            ? `Math Kangaroo • ${state.mathKangarooCategories.length} grades`
                            : "Math Kangaroo")}
              </span>
            )}
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
                  onChange={(event) => {
                    const tl = Number(event.target.value) as 10 | 20 | 50;
                    setTestLength(tl);
                    const sid = getCurrentStudentId();
                    if (sid && sid > 0) studentsApi.update(sid, { test_length: tl } as Partial<ApiStudent>).catch(() => {});
                  }}
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

      <section className="game-frame"
        style={{ pointerEvents: (teacherOpen || shopOpen || lotteryOpen || miniGamesOpen || !!knowledgeCard) ? "none" : "auto" }}>
        <div id="phaser-root" />
      </section>

      <section className="actions">
        <button onClick={onHearWord} disabled={mode === "test"}>
          Hear Word
        </button>
        {mode === "practice" && (
          <button
            onClick={() => setAudioEnabled((v) => !v)}
            title={audioEnabled ? "Turn off audio" : "Turn on audio"}
            style={{ minWidth: "2.4rem", fontSize: "1.1rem" }}
          >
            {audioEnabled ? "🔊" : "🔇"}
          </button>
        )}
        {mode === "practice" ? (
          knowledgeCard ? null : (
            <button onClick={onNext} disabled={!canGoNext}>
              Next Challenge
            </button>
          )
        ) : testState.running ? (
          <button className="danger" onClick={quitTest}>Quit Test</button>
        ) : (
          <button onClick={startTest}>{testState.finished ? "New Test" : "Start Test"}</button>
        )}
        <button onClick={() => setShopOpen(true)}>Open Camp Shop</button>
        <button onClick={() => setMiniGamesOpen(true)}>🎮 Mini Games</button>
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
                  {lastPrize.id === "replay" ? "Please play again!" : `恭喜获得：${lastPrize.label}！`}
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

      {miniGamesOpen && (
        <MiniGamesModal
          stars={state.stars}
          onSpendStars={spendStars}
          onEarnStars={addStars}
          onClose={() => setMiniGamesOpen(false)}
        />
      )}

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
                {/* Tab bar */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem" }}>
                  {(["questions", "students", "settings"] as const).map((tab) => (
                    <button key={tab} onClick={() => setTeacherTab(tab)}
                      style={{
                        padding: "0.4rem 1.1rem", borderRadius: "6px 6px 0 0",
                        border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem",
                        background: teacherTab === tab ? "#3b82f6" : "#f1f5f9",
                        color: teacherTab === tab ? "#fff" : "#475569",
                      }}>
                      {tab === "questions" ? "📚 Questions" : tab === "students" ? "👩‍🎓 Students" : "⚙️ Settings"}
                    </button>
                  ))}
                </div>

                {teacherTab === "questions" && <QuestionTable />}
                {teacherTab === "students" && <StudentList />}

                {teacherTab === "settings" && <>
                <h3>Font Size</h3>
                <div className="font-size-picker">
                  {(["small", "medium", "large"] as FontSizePref[]).map((sz) => (
                    <button
                      key={sz}
                      className={pendingFontSize === sz ? "active" : ""}
                      onClick={() => setPendingFontSize(sz)}
                    >
                      {sz === "small" ? "小 Small" : sz === "medium" ? "中 Medium" : "大 Large"}
                    </button>
                  ))}
                </div>
                <p className="helper-text" style={{ marginTop: "0.2rem" }}>
                  Takes effect when you close Teacher Mode.
                </p>
                <hr />
                <h3>Available Subjects</h3>
                <p className="helper-text" style={{ marginTop: "-0.4rem" }}>
                  Control which subjects appear for this student.
                </p>
                <div className="category-checkboxes">
                  {([
                    { id: "astronomy", label: "🔭 Astronomy" },
                    { id: "canada", label: "🍁 Canada G4" },
                    { id: "math-kangaroo", label: "🦘 Math Kangaroo" },
                    { id: "leon", label: "🧮 Leon Math" },
                  ] as const).map(({ id, label }) => (
                    <label key={id} className="check-row">
                      <input
                        type="checkbox"
                        checked={pendingEnabledSubjects.includes(id)}
                        onChange={() => {
                          const next = pendingEnabledSubjects.includes(id)
                            ? pendingEnabledSubjects.filter((s) => s !== id)
                            : [...pendingEnabledSubjects, id];
                          // Keep at least one subject enabled
                          if (next.length > 0) setPendingEnabledSubjects(next);
                        }}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <hr />
                <h3>Category Settings</h3>
                <p className="helper-text" style={{ marginTop: "-0.4rem" }}>
                  Select which categories students can see. Takes effect when you close Teacher Mode.
                </p>
                {(() => {
                  const astroKeys = Object.keys(ASTRONOMY_CATEGORY_LABELS).filter(k => k !== "all");
                  const astroAllSelected = pendingAstroCats.length === 0;
                  const toggleAstro = (key: string) => {
                    const effective = astroAllSelected ? astroKeys : pendingAstroCats;
                    if (effective.includes(key)) {
                      const next = effective.filter(k => k !== key);
                      setPendingAstroCats(next.length === 0 || next.length === astroKeys.length ? [] : next);
                    } else {
                      const next = [...effective, key];
                      setPendingAstroCats(next.length === astroKeys.length ? [] : next);
                    }
                  };
                  const canadaKeys = Object.keys(CANADA_CATEGORY_LABELS).filter(k => k !== "all");
                  const canadaAllSelected = pendingCanadaCats.length === 0;
                  const toggleCanada = (key: string) => {
                    const effective = canadaAllSelected ? canadaKeys : pendingCanadaCats;
                    if (effective.includes(key)) {
                      const next = effective.filter(k => k !== key);
                      setPendingCanadaCats(next.length === 0 || next.length === canadaKeys.length ? [] : next);
                    } else {
                      const next = [...effective, key];
                      setPendingCanadaCats(next.length === canadaKeys.length ? [] : next);
                    }
                  };
                  const kangarooKeys = Object.keys(MATH_KANGAROO_CATEGORY_LABELS).filter(k => k !== "all");
                  const kangarooAllSelected = pendingMathKangarooCats.length === 0;
                  const toggleKangaroo = (key: string) => {
                    const effective = kangarooAllSelected ? kangarooKeys : pendingMathKangarooCats;
                    if (effective.includes(key)) {
                      const next = effective.filter(k => k !== key);
                      setPendingMathKangarooCats(next.length === 0 || next.length === kangarooKeys.length ? [] : next);
                    } else {
                      const next = [...effective, key];
                      setPendingMathKangarooCats(next.length === kangarooKeys.length ? [] : next);
                    }
                  };
                  return (
                    <div className="teacher-category-cols">
                      <div className="teacher-category-col">
                        <label className="field-label">🔭 Astronomy</label>
                        <div className="category-checkboxes">
                          <label className="check-row">
                            <input type="checkbox" checked={astroAllSelected}
                              onChange={() => setPendingAstroCats([])} />
                            <span>All Categories</span>
                          </label>
                          {astroKeys.map(key => (
                            <label key={key} className="check-row">
                              <input type="checkbox"
                                checked={astroAllSelected || pendingAstroCats.includes(key)}
                                onChange={() => toggleAstro(key)} />
                              <span>{ASTRONOMY_CATEGORY_LABELS[key]}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="teacher-category-col">
                        <label className="field-label">🍁 Canada G4</label>
                        <div className="category-checkboxes">
                          <label className="check-row">
                            <input type="checkbox" checked={canadaAllSelected}
                              onChange={() => setPendingCanadaCats([])} />
                            <span>All Subjects</span>
                          </label>
                          {canadaKeys.map(key => (
                            <label key={key} className="check-row">
                              <input type="checkbox"
                                checked={canadaAllSelected || pendingCanadaCats.includes(key)}
                                onChange={() => toggleCanada(key)} />
                              <span>{CANADA_CATEGORY_LABELS[key]}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="teacher-category-col">
                        <label className="field-label">🦘 Math Kangaroo</label>
                        <div className="category-checkboxes">
                          <label className="check-row">
                            <input type="checkbox" checked={kangarooAllSelected}
                              onChange={() => setPendingMathKangarooCats([])} />
                            <span>All Grades</span>
                          </label>
                          {kangarooKeys.map(key => (
                            <label key={key} className="check-row">
                              <input type="checkbox"
                                checked={kangarooAllSelected || pendingMathKangarooCats.includes(key)}
                                onChange={() => toggleKangaroo(key)} />
                              <span>{MATH_KANGAROO_CATEGORY_LABELS[key]}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <hr />
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
                    const sid = getCurrentStudentId();
                    if (sid && sid > 0) studentsApi.update(sid, { lottery_cost: val } as Partial<ApiStudent>).catch(() => {});
                  }}
                />
                <label className="field-label">Prizes</label>
                <div className="prize-editor">
                  <div className="prize-row replay-row">
                    <span>Please play again</span>
                    <span>{Math.max(0, 100 - storedPrizes.reduce((s, p) => s + p.weight, 0))}%</span>
                    <span className="helper-text">自动补齐</span>
                  </div>
                  {storedPrizes.map((prize, i) => (
                    <div
                      key={prize.id}
                      className={[
                        "prize-row",
                        dragPrizeId === prize.id ? "dragging" : "",
                        dragOverPrizeId === prize.id && dragPrizeId !== prize.id ? "drag-over" : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        setDragPrizeId(prize.id);
                        setDragOverPrizeId(prize.id);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        setDragOverPrizeId(prize.id);
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (dragPrizeId) reorderPrizes(dragPrizeId, prize.id);
                        setDragPrizeId(null);
                        setDragOverPrizeId(null);
                      }}
                      onDragEnd={() => {
                        setDragPrizeId(null);
                        setDragOverPrizeId(null);
                      }}
                    >
                      <span className="drag-handle" title="Drag to reorder" aria-label="Drag to reorder">↕</span>
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
                <h3>Lottery History</h3>
                {lotteryHistory.length === 0 ? (
                  <p className="helper-text">No draws recorded yet.</p>
                ) : (
                  <>
                    <div className="test-history">
                      {lotteryHistory.map((record) => (
                        <div key={record.id} className="test-record">
                          <div className="test-record-header">
                            <span className="helper-text">{formatTestDate(record.time)}</span>
                            <span>{record.prizeLabel}</span>
                            <button
                              className="danger"
                              style={{ marginLeft: "auto", padding: "2px 10px", fontSize: "0.8rem" }}
                              onClick={() => {
                                syncLotteryHistory(lotteryHistory.filter((r) => r.id !== record.id));
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="teacher-actions">
                      <button
                        className="danger"
                        onClick={() => { syncLotteryHistory([]); }}
                      >
                        Clear All
                      </button>
                    </div>
                  </>
                )}
                <hr />
                <h3>Bonus Tokens</h3>
                <label htmlFor="bonusTokenInput" className="field-label">
                  Award tokens to student
                </label>
                <input
                  id="bonusTokenInput"
                  type="number"
                  min="1"
                  max="9999"
                  value={bonusTokenInput || ""}
                  onChange={(e) => setBonusTokenInput(Math.max(0, Number(e.target.value)))}
                  placeholder="Enter amount"
                />
                {bonusTokenMessage && (
                  <p className="inline-note good">{bonusTokenMessage}</p>
                )}
                <div className="teacher-actions">
                  <button
                    onClick={() => {
                      if (bonusTokenInput <= 0) return;
                      addTokens(bonusTokenInput);
                      setBonusTokenMessage(`+${bonusTokenInput} tokens awarded!`);
                      setBonusTokenInput(0);
                      setTimeout(() => setBonusTokenMessage(""), 3000);
                    }}
                    disabled={bonusTokenInput <= 0}
                  >
                    Award Tokens
                  </button>
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
                </>}
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

      {/* Student picker — fixed overlay, shown until a student is chosen */}
      {!currentStudent && (
        <StudentPicker onSelect={handleStudentSelect} onGuest={handleGuest} />
      )}

      {/* Questions loading overlay */}
      {questionsLoading && (
        <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "1rem", zIndex: 9999,
          background: "linear-gradient(135deg, #1e3a5f, #0d6e8a)", color: "#fff" }}>
          <div style={{ fontSize: "2rem" }}>⏳</div>
          <p style={{ fontSize: "1.1rem", margin: 0 }}>Loading questions…</p>
        </div>
      )}

      {knowledgeCard && (
        <KnowledgeCard data={knowledgeCard} onDismiss={dismissKnowledgeCard} />
      )}

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

function loadLotteryHistory(): LotteryRecord[] {
  try {
    const raw = localStorage.getItem(LOTTERY_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LotteryRecord[];
  } catch {
    return [];
  }
}


export default App;
