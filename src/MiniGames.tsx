import { useCallback, useEffect, useRef, useState } from "react";

// ── Shared ────────────────────────────────────────────────────────────────────
type GameId = "memory" | "mole" | "blaster";

interface Props {
  stars: number;
  onSpendStars: (n: number) => { ok: boolean; message: string };
  onEarnStars: (n: number) => void;
  onClose: () => void;
}

// ── Memory Match ──────────────────────────────────────────────────────────────
const MEMORY_COST = 5;
const MEMORY_WIN_STARS = 12;
const MEMORY_SLOW_STARS = 7;
const MEMORY_TIME = 90; // seconds

const CARD_EMOJIS = ["🍁", "🦫", "🐻", "🦌", "🏔️", "🌊", "🦉", "🐦‍⬛"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface CardState {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function MemoryGame({ onResult }: { onResult: (won: boolean, fast: boolean) => void }) {
  const [cards, setCards] = useState<CardState[]>(() =>
    shuffle([...CARD_EMOJIS, ...CARD_EMOJIS]).map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false
    }))
  );
  const [, setSelected] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MEMORY_TIME);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setDone(true);
          onResult(false, false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [onResult]);

  const flip = useCallback(
    (id: number) => {
      if (locked || done) return;
      setCards((prev) => {
        const card = prev[id];
        if (card.flipped || card.matched) return prev;
        return prev.map((c) => (c.id === id ? { ...c, flipped: true } : c));
      });
      setSelected((prev) => {
        const next = [...prev, id];
        if (next.length === 2) {
          setLocked(true);
          setTimeout(() => {
            setCards((prevCards) => {
              const [a, b] = next;
              const cardA = prevCards[a];
              const cardB = prevCards[b];
              if (cardA.emoji === cardB.emoji) {
                const updated = prevCards.map((c) =>
                  c.id === a || c.id === b ? { ...c, matched: true } : c
                );
                const allMatched = updated.every((c) => c.matched);
                if (allMatched) {
                  clearInterval(timerRef.current!);
                  const elapsed = (Date.now() - startRef.current) / 1000;
                  setDone(true);
                  onResult(true, elapsed < MEMORY_TIME * 0.6);
                }
                return updated;
              } else {
                return prevCards.map((c) =>
                  c.id === a || c.id === b ? { ...c, flipped: false } : c
                );
              }
            });
            setSelected([]);
            setLocked(false);
          }, 800);
          return next;
        }
        return next;
      });
    },
    [locked, done, onResult]
  );

  const matchedCount = cards.filter((c) => c.matched).length / 2;

  return (
    <div className="minigame-area">
      <div className="minigame-hud">
        <span>⏱ {timeLeft}s</span>
        <span>✅ {matchedCount} / 8 pairs</span>
      </div>
      <div className="memory-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            className={[
              "memory-card",
              card.flipped || card.matched ? "face-up" : "",
              card.matched ? "matched" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => flip(card.id)}
            disabled={card.matched || locked || done}
          >
            <span className="card-front">{card.emoji}</span>
            <span className="card-back">🍀</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Whack-a-Mole ──────────────────────────────────────────────────────────────
const MOLE_COST = 3;
const MOLE_TIME = 30;
const MOLE_APPEAR_MS = 1100;

interface MoleState {
  active: boolean;
  whacked: boolean;
}

function MoleGame({ onResult }: { onResult: (score: number) => void }) {
  const CELLS = 9;
  const [moles, setMoles] = useState<MoleState[]>(
    Array.from({ length: CELLS }, () => ({ active: false, whacked: false }))
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MOLE_TIME);
  const [done, setDone] = useState(false);
  const activeTimers = useRef<(ReturnType<typeof setTimeout> | null)[]>(
    Array(CELLS).fill(null)
  );
  const scoreRef = useRef(0);
  const doneRef = useRef(false);

  const spawnMole = useCallback(() => {
    if (doneRef.current) return;
    const idx = Math.floor(Math.random() * CELLS);
    setMoles((prev) => {
      if (prev[idx].active) return prev;
      return prev.map((m, i) => (i === idx ? { active: true, whacked: false } : m));
    });
    activeTimers.current[idx] = setTimeout(() => {
      setMoles((prev) =>
        prev.map((m, i) => (i === idx && m.active ? { active: false, whacked: false } : m))
      );
    }, MOLE_APPEAR_MS);
  }, []);

  useEffect(() => {
    // spawn interval — varies to keep it fresh
    const spawn = () => {
      if (doneRef.current) return;
      spawnMole();
      if (Math.random() > 0.5) spawnMole();
      spawnTimeout = setTimeout(spawn, 550 + Math.random() * 350);
    };
    let spawnTimeout = setTimeout(spawn, 400);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          clearTimeout(spawnTimeout);
          doneRef.current = true;
          setDone(true);
          onResult(scoreRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(spawnTimeout);
      activeTimers.current.forEach((t) => t && clearTimeout(t));
    };
  }, [spawnMole, onResult]);

  const whack = (idx: number) => {
    if (done) return;
    setMoles((prev) => {
      if (!prev[idx].active || prev[idx].whacked) return prev;
      const next = prev.map((m, i) =>
        i === idx ? { active: false, whacked: true } : m
      );
      // clear disappear timer
      if (activeTimers.current[idx]) {
        clearTimeout(activeTimers.current[idx]!);
        activeTimers.current[idx] = null;
      }
      // reset whacked flash
      setTimeout(() => {
        setMoles((p) => p.map((m, i) => (i === idx ? { ...m, whacked: false } : m)));
      }, 300);
      return next;
    });
    scoreRef.current += 1;
    setScore((s) => s + 1);
  };

  return (
    <div className="minigame-area">
      <div className="minigame-hud">
        <span>⏱ {timeLeft}s</span>
        <span>🔨 Score: {score}</span>
      </div>
      <div className="mole-grid">
        {moles.map((mole, i) => (
          <button
            key={i}
            className={[
              "mole-hole",
              mole.active ? "mole-up" : "",
              mole.whacked ? "mole-whacked" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => whack(i)}
          >
            {mole.active && !mole.whacked && <span className="mole-emoji">🐹</span>}
            {mole.whacked && <span className="mole-emoji">⭐</span>}
          </button>
        ))}
      </div>
      <p className="helper-text" style={{ marginTop: "0.5rem" }}>
        Tap the hamsters before they hide!
      </p>
    </div>
  );
}

// ── Space Blaster ─────────────────────────────────────────────────────────────
const BLASTER_COST = 4;
const BLASTER_TIME = 35;
const BLASTER_APPEAR_MS = 950;

interface BlasterCell {
  active: boolean;
  kind: "target" | "trap" | null;
  hit: boolean;
}

function SpaceBlasterGame({ onResult }: { onResult: (score: number, trapsHit: number) => void }) {
  const CELLS = 12;
  const [cells, setCells] = useState<BlasterCell[]>(
    Array.from({ length: CELLS }, () => ({ active: false, kind: null, hit: false }))
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BLASTER_TIME);
  const [done, setDone] = useState(false);
  const activeTimers = useRef<(ReturnType<typeof setTimeout> | null)[]>(
    Array(CELLS).fill(null)
  );
  const scoreRef = useRef(0);
  const trapRef = useRef(0);
  const doneRef = useRef(false);

  const spawn = useCallback(() => {
    if (doneRef.current) return;
    const idx = Math.floor(Math.random() * CELLS);
    const isTrap = Math.random() < 0.25;

    setCells((prev) => {
      if (prev[idx].active) return prev;
      return prev.map((c, i) =>
        i === idx ? { active: true, kind: isTrap ? "trap" : "target", hit: false } : c
      );
    });

    activeTimers.current[idx] = setTimeout(() => {
      setCells((prev) =>
        prev.map((c, i) =>
          i === idx && c.active ? { active: false, kind: null, hit: false } : c
        )
      );
    }, BLASTER_APPEAR_MS);
  }, []);

  useEffect(() => {
    let spawnTimeout: ReturnType<typeof setTimeout> | null = null;
    const loop = () => {
      if (doneRef.current) return;
      spawn();
      if (Math.random() > 0.55) spawn();
      spawnTimeout = setTimeout(loop, 420 + Math.random() * 260);
    };
    spawnTimeout = setTimeout(loop, 350);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          if (spawnTimeout) clearTimeout(spawnTimeout);
          doneRef.current = true;
          setDone(true);
          onResult(scoreRef.current, trapRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (spawnTimeout) clearTimeout(spawnTimeout);
      activeTimers.current.forEach((t) => t && clearTimeout(t));
    };
  }, [onResult, spawn]);

  const blast = (idx: number) => {
    if (done) return;
    setCells((prev) => {
      const c = prev[idx];
      if (!c.active || !c.kind) return prev;

      if (activeTimers.current[idx]) {
        clearTimeout(activeTimers.current[idx]!);
        activeTimers.current[idx] = null;
      }

      if (c.kind === "target") {
        scoreRef.current += 1;
        setScore((s) => s + 1);
      } else {
        trapRef.current += 1;
        scoreRef.current = Math.max(0, scoreRef.current - 1);
        setScore((s) => Math.max(0, s - 1));
      }

      const next = prev.map((x, i) => (i === idx ? { ...x, hit: true } : x));
      setTimeout(() => {
        setCells((p) =>
          p.map((x, i) =>
            i === idx ? { active: false, kind: null, hit: false } : x
          )
        );
      }, 180);
      return next;
    });
  };

  return (
    <div className="minigame-area">
      <div className="minigame-hud">
        <span>⏱ {timeLeft}s</span>
        <span>🚀 Score: {score}</span>
      </div>
      <div className="blaster-grid">
        {cells.map((cell, i) => (
          <button
            key={i}
            className={[
              "blaster-cell",
              cell.active && cell.kind === "target" ? "blaster-target" : "",
              cell.active && cell.kind === "trap" ? "blaster-trap" : "",
              cell.hit ? "blaster-hit" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => blast(i)}
          >
            {cell.active && !cell.hit && cell.kind === "target" && (
              <span className="blaster-emoji">☄️</span>
            )}
            {cell.active && !cell.hit && cell.kind === "trap" && (
              <span className="blaster-emoji">🛰️</span>
            )}
            {cell.hit && <span className="blaster-emoji">💥</span>}
          </button>
        ))}
      </div>
      <p className="helper-text" style={{ marginTop: "0.5rem" }}>
        Hit meteors (☄️), avoid satellites (🛰️).
      </p>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export function MiniGamesModal({ stars, onSpendStars, onEarnStars, onClose }: Props) {
  const [screen, setScreen] = useState<"menu" | GameId | "result">("menu");
  const [resultMsg, setResultMsg] = useState("");
  const [resultGood, setResultGood] = useState(false);

  const startMemory = () => {
    const r = onSpendStars(MEMORY_COST);
    if (!r.ok) { setResultMsg(r.message); setResultGood(false); setScreen("result"); return; }
    setScreen("memory");
  };

  const startMole = () => {
    const r = onSpendStars(MOLE_COST);
    if (!r.ok) { setResultMsg(r.message); setResultGood(false); setScreen("result"); return; }
    setScreen("mole");
  };

  const startBlaster = () => {
    const r = onSpendStars(BLASTER_COST);
    if (!r.ok) { setResultMsg(r.message); setResultGood(false); setScreen("result"); return; }
    setScreen("blaster");
  };

  const handleMemoryResult = useCallback((won: boolean, fast: boolean) => {
    if (won) {
      const earned = fast ? MEMORY_WIN_STARS : MEMORY_SLOW_STARS;
      onEarnStars(earned);
      setResultMsg(
        fast
          ? `Amazing! You matched all pairs quickly! +${earned} ⭐`
          : `You matched all pairs! +${earned} ⭐`
      );
      setResultGood(true);
    } else {
      setResultMsg("Time's up! No stars earned. Try again!");
      setResultGood(false);
    }
    setScreen("result");
  }, [onEarnStars]);

  const handleMoleResult = useCallback((score: number) => {
    let earned = 2;
    let msg = "";
    if (score >= 20) { earned = 10; msg = `Incredible! Score ${score}! +${earned} ⭐`; }
    else if (score >= 14) { earned = 7; msg = `Great job! Score ${score}! +${earned} ⭐`; }
    else if (score >= 8) { earned = 4; msg = `Nice! Score ${score}! +${earned} ⭐`; }
    else { earned = 1; msg = `Score ${score}. Keep practising! +${earned} ⭐`; }
    onEarnStars(earned);
    setResultGood(score >= 8);
    setResultMsg(msg);
    setScreen("result");
  }, [onEarnStars]);

  const handleBlasterResult = useCallback((score: number, trapsHit: number) => {
    let earned = 2;
    let msg = "";
    if (score >= 24 && trapsHit <= 2) {
      earned = 11;
      msg = `Ace pilot! Score ${score}, only ${trapsHit} mistakes! +${earned} ⭐`;
    } else if (score >= 18) {
      earned = 8;
      msg = `Great shooting! Score ${score}! +${earned} ⭐`;
    } else if (score >= 12) {
      earned = 5;
      msg = `Good run! Score ${score}! +${earned} ⭐`;
    } else {
      earned = 2;
      msg = `Score ${score}. Try to avoid satellites next time! +${earned} ⭐`;
    }
    onEarnStars(earned);
    setResultGood(score >= 12);
    setResultMsg(msg);
    setScreen("result");
  }, [onEarnStars]);

  return (
    <section className="shop-modal" role="dialog" aria-label="Mini Games">
      <div className="shop-content minigames-content">
        <h2>🎮 Mini Games</h2>

        {screen === "menu" && (
          <>
            <p className="helper-text">You have <strong>{stars} ⭐</strong> stars. Spend some to play!</p>
            <div className="minigame-cards">
              <div className="minigame-card">
                <div className="minigame-card-icon">🃏</div>
                <h3>Memory Match</h3>
                <p>Flip cards and find all 8 matching pairs before time runs out!</p>
                <p className="minigame-cost">Cost: {MEMORY_COST} ⭐ &nbsp;|&nbsp; Win up to {MEMORY_WIN_STARS} ⭐</p>
                <button onClick={startMemory} disabled={stars < MEMORY_COST}>
                  Play! ({MEMORY_COST} ⭐)
                </button>
              </div>
              <div className="minigame-card">
                <div className="minigame-card-icon">🐹</div>
                <h3>Whack-a-Hamster</h3>
                <p>Tap the hamsters as fast as you can — 30 seconds on the clock!</p>
                <p className="minigame-cost">Cost: {MOLE_COST} ⭐ &nbsp;|&nbsp; Win up to 10 ⭐</p>
                <button onClick={startMole} disabled={stars < MOLE_COST}>
                  Play! ({MOLE_COST} ⭐)
                </button>
              </div>
              <div className="minigame-card">
                <div className="minigame-card-icon">🚀</div>
                <h3>Space Blaster</h3>
                <p>Fast action game: blast meteors, avoid satellites, beat the timer.</p>
                <p className="minigame-cost">Cost: {BLASTER_COST} ⭐ &nbsp;|&nbsp; Win up to 11 ⭐</p>
                <button onClick={startBlaster} disabled={stars < BLASTER_COST}>
                  Play! ({BLASTER_COST} ⭐)
                </button>
              </div>
            </div>
            <button onClick={onClose} style={{ marginTop: "1rem" }}>Close</button>
          </>
        )}

        {screen === "memory" && (
          <>
            <h3>🃏 Memory Match</h3>
            <MemoryGame onResult={handleMemoryResult} />
          </>
        )}

        {screen === "mole" && (
          <>
            <h3>🐹 Whack-a-Hamster</h3>
            <MoleGame onResult={handleMoleResult} />
          </>
        )}

        {screen === "blaster" && (
          <>
            <h3>🚀 Space Blaster</h3>
            <SpaceBlasterGame onResult={handleBlasterResult} />
          </>
        )}

        {screen === "result" && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
              {resultGood ? "🎉" : "😅"}
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: resultGood ? "#16a34a" : "#dc2626",
                marginBottom: "1.5rem"
              }}
            >
              {resultMsg}
            </p>
            <p className="helper-text">Stars now: {stars} ⭐</p>
            <div className="teacher-actions">
              <button onClick={() => setScreen("menu")}>Play Again</button>
              <button onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
