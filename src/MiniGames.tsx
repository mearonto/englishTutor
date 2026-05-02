import { useCallback, useEffect, useRef, useState } from "react";

// ── Shared ────────────────────────────────────────────────────────────────────
type GameId = "memory" | "mole" | "blaster" | "tetris";

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

// ── Tetris ────────────────────────────────────────────────────────────────────
const TETRIS_COST = 3;
const TC = 22; // cell size px
const TW = 10; // board width in cells
const TH = 20; // board height in cells

const T_SHAPES: number[][][] = [
  [[1,1,1,1]],               // I
  [[1,1],[1,1]],             // O
  [[0,1,0],[1,1,1]],         // T
  [[0,1,1],[1,1,0]],         // S
  [[1,1,0],[0,1,1]],         // Z
  [[1,0,0],[1,1,1]],         // J
  [[0,0,1],[1,1,1]],         // L
];
const T_COLORS = ["#22d3ee","#facc15","#a855f7","#4ade80","#f87171","#60a5fa","#fb923c"];

function rotateCW(s: number[][]): number[][] {
  const rows = s.length, cols = s[0].length;
  return Array.from({length: cols}, (_, c) =>
    Array.from({length: rows}, (_, r) => s[rows - 1 - r][c])
  );
}
function randPiece() {
  const i = Math.floor(Math.random() * 7);
  return { shape: T_SHAPES[i].map(r => [...r]), color: T_COLORS[i] };
}
type TBoard = (string | 0)[][];
function emptyTBoard(): TBoard {
  return Array.from({length: TH}, () => Array<string | 0>(TW).fill(0));
}
function tFits(board: TBoard, shape: number[][], x: number, y: number): boolean {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nr = y + r, nc = x + c;
      if (nr >= TH || nc < 0 || nc >= TW || (nr >= 0 && board[nr][nc])) return false;
    }
  return true;
}
function tPlace(board: TBoard, shape: number[][], x: number, y: number, color: string): TBoard {
  const b = board.map(r => [...r]) as TBoard;
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c] && y + r >= 0) b[y + r][x + c] = color;
  return b;
}
function tClearLines(board: TBoard): { board: TBoard; cleared: number } {
  const kept = board.filter(row => row.some(c => !c));
  const cleared = TH - kept.length;
  const empty = Array.from({length: cleared}, () => Array<string | 0>(TW).fill(0));
  return { board: [...empty, ...kept] as TBoard, cleared };
}

function TetrisGame({ onResult }: { onResult: (lines: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moveRef   = useRef<(dx: number) => void>(() => {});
  const rotRef    = useRef<() => void>(() => {});
  const softRef   = useRef<() => void>(() => {});
  const hardRef   = useRef<() => void>(() => {});
  const [displayLines, setDisplayLines] = useState(0);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const s = {
      board: emptyTBoard(),
      piece: randPiece(),
      next:  randPiece(),
      x: 0, y: 0,
      lines: 0,
      done: false,
    };
    s.x = Math.floor((TW - s.piece.shape[0].length) / 2);

    let dropTimer: ReturnType<typeof setTimeout> | null = null;

    function cell(col: number, row: number, color: string, alpha = 1) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(col * TC + 1, row * TC + 1, TC - 2, TC - 2);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(col * TC + 1, row * TC + 1, TC - 2, 5);
      ctx.globalAlpha = 1;
    }

    function draw() {
      // background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, TW * TC, TH * TC);
      // grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.5;
      for (let r = 0; r <= TH; r++) { ctx.beginPath(); ctx.moveTo(0,r*TC); ctx.lineTo(TW*TC,r*TC); ctx.stroke(); }
      for (let c = 0; c <= TW; c++) { ctx.beginPath(); ctx.moveTo(c*TC,0); ctx.lineTo(c*TC,TH*TC); ctx.stroke(); }
      // placed cells
      for (let r = 0; r < TH; r++)
        for (let c = 0; c < TW; c++)
          if (s.board[r][c]) cell(c, r, s.board[r][c] as string);
      // ghost piece
      let gy = s.y;
      while (tFits(s.board, s.piece.shape, s.x, gy + 1)) gy++;
      if (gy !== s.y)
        for (let r = 0; r < s.piece.shape.length; r++)
          for (let c = 0; c < s.piece.shape[r].length; c++)
            if (s.piece.shape[r][c]) cell(s.x + c, gy + r, s.piece.color, 0.2);
      // active piece
      for (let r = 0; r < s.piece.shape.length; r++)
        for (let c = 0; c < s.piece.shape[r].length; c++)
          if (s.piece.shape[r][c] && s.y + r >= 0) cell(s.x + c, s.y + r, s.piece.color);
      // game-over overlay
      if (s.done) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, TW * TC, TH * TC);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", TW * TC / 2, TH * TC / 2);
      }
    }

    function scheduleNext() {
      if (dropTimer) clearTimeout(dropTimer);
      if (s.done) return;
      const delay = s.lines < 10 ? 600 : s.lines < 20 ? 400 : 250;
      dropTimer = setTimeout(drop, delay);
    }

    function lockAndSpawn() {
      s.board = tPlace(s.board, s.piece.shape, s.x, s.y, s.piece.color);
      const { board, cleared } = tClearLines(s.board);
      s.board = board;
      s.lines += cleared;
      setDisplayLines(s.lines);
      s.piece = s.next;
      s.next  = randPiece();
      s.x = Math.floor((TW - s.piece.shape[0].length) / 2);
      s.y = 0;
      if (!tFits(s.board, s.piece.shape, s.x, s.y)) {
        s.done = true;
        draw();
        onResultRef.current(s.lines);
        return;
      }
      draw();
      scheduleNext();
    }

    function drop() {
      if (s.done) return;
      if (tFits(s.board, s.piece.shape, s.x, s.y + 1)) {
        s.y++;
        draw();
        scheduleNext();
      } else {
        lockAndSpawn();
      }
    }

    function move(dx: number) {
      if (s.done) return;
      if (tFits(s.board, s.piece.shape, s.x + dx, s.y)) { s.x += dx; draw(); }
    }

    function rotate() {
      if (s.done) return;
      const rot = rotateCW(s.piece.shape);
      for (const kick of [0, -1, 1, -2, 2]) {
        if (tFits(s.board, rot, s.x + kick, s.y)) {
          s.piece = { ...s.piece, shape: rot };
          s.x += kick;
          draw();
          return;
        }
      }
    }

    function hardDrop() {
      if (s.done) return;
      if (dropTimer) clearTimeout(dropTimer);
      while (tFits(s.board, s.piece.shape, s.x, s.y + 1)) s.y++;
      lockAndSpawn();
    }

    // Wire refs so buttons work
    moveRef.current = move;
    rotRef.current  = rotate;
    softRef.current = () => { if (dropTimer) clearTimeout(dropTimer); drop(); };
    hardRef.current = hardDrop;

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":  e.preventDefault(); move(-1);   break;
        case "ArrowRight": e.preventDefault(); move(1);    break;
        case "ArrowDown":  e.preventDefault(); softRef.current(); break;
        case "ArrowUp":    e.preventDefault(); rotate();   break;
        case " ":          e.preventDefault(); hardDrop(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    draw();
    scheduleNext();

    return () => {
      if (dropTimer) clearTimeout(dropTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const btn: React.CSSProperties = {
    padding: "0.5rem 0.85rem", fontSize: "1.15rem", borderRadius: 8,
    border: "none", background: "#334155", color: "#fff",
    cursor: "pointer", fontWeight: 700, touchAction: "manipulation",
  };

  return (
    <div className="minigame-area">
      <div className="minigame-hud">
        <span>🧱 Lines: {displayLines}</span>
        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>↑ rotate · Space = drop</span>
      </div>
      <canvas
        ref={canvasRef}
        width={TW * TC}
        height={TH * TC}
        style={{ border: "2px solid #1e293b", borderRadius: 8, display: "block" }}
      />
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", justifyContent: "center" }}>
        <button style={btn} onPointerDown={() => moveRef.current(-1)}>◀</button>
        <button style={btn} onPointerDown={() => rotRef.current()}>↻</button>
        <button style={btn} onPointerDown={() => moveRef.current(1)}>▶</button>
        <button style={{...btn, background: "#475569"}} onPointerDown={() => softRef.current()}>▼</button>
        <button style={{...btn, background: "#dc2626"}} onPointerDown={() => hardRef.current()}>⬇⬇</button>
      </div>
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

  const startTetris = () => {
    const r = onSpendStars(TETRIS_COST);
    if (!r.ok) { setResultMsg(r.message); setResultGood(false); setScreen("result"); return; }
    setScreen("tetris");
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

  const handleTetrisResult = useCallback((lines: number) => {
    let earned = 0;
    let msg = "";
    if (lines >= 15)      { earned = 12; msg = `Tetris master! ${lines} lines! +${earned} ⭐`; }
    else if (lines >= 10) { earned = 8;  msg = `Excellent! ${lines} lines! +${earned} ⭐`; }
    else if (lines >= 5)  { earned = 5;  msg = `Nice! ${lines} lines cleared! +${earned} ⭐`; }
    else if (lines >= 2)  { earned = 3;  msg = `${lines} lines! Keep practising! +${earned} ⭐`; }
    else                  { earned = 1;  msg = `${lines} line${lines === 1 ? "" : "s"}. Keep going! +${earned} ⭐`; }
    onEarnStars(earned);
    setResultGood(lines >= 5);
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
              <div className="minigame-card">
                <div className="minigame-card-icon">🧱</div>
                <h3>Tetris</h3>
                <p>Stack the falling blocks and clear as many lines as you can!</p>
                <p className="minigame-cost">Cost: {TETRIS_COST} ⭐ &nbsp;|&nbsp; Win up to 12 ⭐</p>
                <button onClick={startTetris} disabled={stars < TETRIS_COST}>
                  Play! ({TETRIS_COST} ⭐)
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

        {screen === "tetris" && (
          <>
            <h3>🧱 Tetris</h3>
            <TetrisGame onResult={handleTetrisResult} />
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
