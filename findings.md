# Findings — Word Quest Backend + DB Upgrade

**Updated:** 2026-04-30

---

## Current Architecture (source of truth)

### Frontend Stack
- React 19 + TypeScript + Phaser 3.90 + Vite 7
- Pure SPA — no backend today
- `npm run dev` starts on `http://localhost:5173`

### State Management
- `src/game/store.ts` — module-level singleton `PlayerState`
- Persisted to `localStorage` via `src/game/storage.ts`
- React components subscribe via `subscribe(listener)` pattern
- Phaser ↔ React communicate only through `gameEvents` EventEmitter (`src/game/events.ts`)

### Question Content Files
| File | Subject | # Questions |
|------|---------|------------|
| `src/game/levels.ts` | English (Grade 3/4) | ~200+ |
| `src/game/astronomyLevels.ts` | Astronomy | 162 |
| `src/game/canadaLevels.ts` | Canada | unknown |
| `src/game/mathKangarooLevels.ts` | Math Kangaroo | unknown |

### Level Structure (TypeScript `Level` interface)
```typescript
interface Level {
  id: string;           // e.g. "astro-ss-01"
  grade: number;        // 0 = all grades, 3 = Grade 3, 4 = Grade 4
  type: SkillType;      // category string
  word: string;         // key term / answer label
  prompt: string;       // the question text
  choices: string[];    // 4 choices
  answer: string;       // correct choice (exact match to one of choices[])
  definition: string;
  contextSentence: string;
  hints: [string, string];
  coach: string;        // shown after 3rd miss
}
```

### PlayerState (per-player, in localStorage today)
```typescript
interface PlayerState {
  xp: number;
  stars: number;
  tokens: number;
  streak: number;
  gradeUnlocked: Grade;    // 3 | 4
  mastery3: Record<string, number>;
  learned: Record<string, number>;
  inventory: string[];
  subject: Subject;
  astronomyCategories: string[];
  canadaCategories: string[];
  mathKangarooCategories: string[];
}
```

### Teacher Mode (current)
- Password stored in `localStorage` key `word-quest-teacher-password-v1`, default `"2222"`
- Custom word pack import: JSON or CSV via `src/game/teacher.ts`
- Fixed-length tests (10/20/50), progress export
- No per-student management exists today

### Subjects
```typescript
type Subject = "english" | "astronomy" | "canada" | "math-kangaroo";
```

### SkillTypes (all categories across subjects)
```typescript
// English
"spelling" | "homophone" | "prefix" | "suffix" | "multiple-meaning" | 
"word-relationships" | "compound-word" | "context-clues"

// Astronomy
"solar-system" | "stars-galaxies" | "space-exploration" | "nasa-ksc" | 
"earth-space" | "fun-fact" | "astronomy-vocab"

// Canada
"math" | "science" | "social-studies" | "language-arts" | "health"

// Math Kangaroo
"kangaroo-g5" | "kangaroo-g6" | "kangaroo-g7" | "kangaroo-g8"
```

---

## Target Students
- **Matthew** — student profile 1
- **Leon** — student profile 2
- Teacher can add more via UI

---

## Key Integration Points for Backend

### 1. `src/game/levels.ts` — `getLevels()` / `pickNextLevel()`
Currently returns static arrays. Must become async API calls.

### 2. `src/game/store.ts` — `saveState()` / `loadState()`
Currently reads/writes localStorage. Must also sync with `PUT /api/students/:id`.

### 3. `src/App.tsx` — initialization
Currently loads from localStorage on mount. Must instead:
1. Show StudentPicker
2. Fetch student from API
3. Fetch question pool from API
4. Start game

### 4. `TeacherModal` in `src/App.tsx`
Currently a single modal. Needs tab system: Questions | Students | Tests.

---

## Docker / Infrastructure Notes
- No `docker-compose.yml` exists today
- No `server/` directory exists today
- Vite config at `vite.config.ts` needs `/api` proxy added
- Port plan: Vite=5173, Express=3001, Postgres=5432

---

## Difficulty Level Design
| Level | Label | Color |
|-------|-------|-------|
| 1 | Easy | green |
| 2 | Medium | blue |
| 3 | Standard | yellow |
| 4 | Advanced | orange |
| 5 | Expert | red |

Default for seeded questions: **3 (Standard)**

---

## API Surface (planned)

```
GET    /api/questions                     list with filters
POST   /api/questions                     create
PUT    /api/questions/:id                 update
DELETE /api/questions/:id                 soft-delete

GET    /api/students                      list all
POST   /api/students                      create
PUT    /api/students/:id                  update progress
DELETE /api/students/:id                  remove
GET    /api/students/:id/questions        assigned pool
POST   /api/students/:id/questions        assign questions
DELETE /api/students/:id/questions/:qid   remove from pool

GET    /api/tests?student_id=             list test configs
POST   /api/tests                         create config
PUT    /api/tests/:id                     update
DELETE /api/tests/:id                     delete
POST   /api/tests/:id/sessions            start session
PUT    /api/tests/sessions/:sid           finish + save results
GET    /api/students/:id/results          test history
```
