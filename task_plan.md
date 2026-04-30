# Task Plan — Word Quest: Backend + DB + Teacher/Student Management

**Goal:** Evolve Word Quest from a pure-frontend localStorage app into a full-stack system with a Dockerized PostgreSQL database, Express backend API, per-student profiles, difficulty levels on questions, and a rich teacher management UI.

**Created:** 2026-04-30  
**Status:** PLANNING

---

## Requirements Summary

| # | Requirement |
|---|-------------|
| R1 | Questions stored in PostgreSQL (Docker), not TypeScript static files |
| R2 | Seed DB from existing static level files on first run |
| R3 | Teacher UI: full CRUD on questions (add, edit, delete, import, filter) |
| R4 | Difficulty level (1–5) per question; teacher can filter/assign by difficulty |
| R5 | Per-student profiles: Matthew & Leon start; teacher can add/remove students |
| R6 | Teacher assigns different question pools to each student |
| R7 | Test mode: teacher sets length, subject, category, difficulty range per student |
| R8 | All progress (XP, stars, streak, mastery, test results) stored in DB per student |
| R9 | Student selection screen on app load (pick your name, no password needed) |
| R10 | Teacher mode password-protects the management panel |

---

## Architecture Decision

```
┌─────────────────────────────────────┐
│  Browser (React + Phaser)           │
│  - Student picker screen            │
│  - Game (unchanged Phaser canvas)   │
│  - Teacher dashboard (new React UI) │
└──────────────┬──────────────────────┘
               │ REST API (JSON)
┌──────────────▼──────────────────────┐
│  Express API server  (port 3001)    │
│  - /api/questions  (CRUD)           │
│  - /api/students   (CRUD)           │
│  - /api/progress   (read/write)     │
│  - /api/tests      (CRUD + results) │
└──────────────┬──────────────────────┘
               │ node-postgres (pg)
┌──────────────▼──────────────────────┐
│  PostgreSQL 16  (Docker, port 5432) │
│  persistent volume: pg_data         │
└─────────────────────────────────────┘
```

**Tech choices:**
- Backend: Node.js + Express + TypeScript (matches existing TS codebase)
- DB client: `pg` (node-postgres) — simple, no ORM needed at this scale
- Migrations: plain SQL files run on startup (`/server/migrations/`)
- Docker: `docker-compose.yml` at repo root with `postgres` + `api` services
- Frontend dev: Vite proxy `/api` → `localhost:3001` (no CORS issues)

---

## Database Schema

### `questions`
```sql
id            SERIAL PRIMARY KEY
subject       TEXT NOT NULL          -- 'english' | 'astronomy' | 'canada' | 'math-kangaroo'
type          TEXT NOT NULL          -- SkillType value (e.g. 'solar-system')
grade         INTEGER NOT NULL DEFAULT 0
word          TEXT NOT NULL
prompt        TEXT NOT NULL
choices       JSONB NOT NULL         -- string[]
answer        TEXT NOT NULL
definition    TEXT NOT NULL
context_sentence TEXT NOT NULL
hints         JSONB NOT NULL         -- [string, string]
coach         TEXT NOT NULL
difficulty    INTEGER NOT NULL DEFAULT 3  -- 1 (easy) to 5 (hard)
active        BOOLEAN NOT NULL DEFAULT TRUE
created_at    TIMESTAMPTZ DEFAULT NOW()
updated_at    TIMESTAMPTZ DEFAULT NOW()
```

### `students`
```sql
id            SERIAL PRIMARY KEY
name          TEXT NOT NULL UNIQUE
grade_unlocked INTEGER NOT NULL DEFAULT 3
xp            INTEGER NOT NULL DEFAULT 0
stars         INTEGER NOT NULL DEFAULT 0
tokens        INTEGER NOT NULL DEFAULT 0
streak        INTEGER NOT NULL DEFAULT 0
mastery3      JSONB NOT NULL DEFAULT '{}'
learned       JSONB NOT NULL DEFAULT '{}'
inventory     JSONB NOT NULL DEFAULT '[]'
subject       TEXT NOT NULL DEFAULT 'english'
astronomy_categories  JSONB DEFAULT '["all"]'
canada_categories     JSONB DEFAULT '["all"]'
math_kangaroo_categories JSONB DEFAULT '["all"]'
created_at    TIMESTAMPTZ DEFAULT NOW()
```

### `student_questions`  (per-student question pool overrides)
```sql
id            SERIAL PRIMARY KEY
student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE
question_id   INTEGER REFERENCES questions(id) ON DELETE CASCADE
assigned      BOOLEAN NOT NULL DEFAULT TRUE
assigned_at   TIMESTAMPTZ DEFAULT NOW()
UNIQUE(student_id, question_id)
```

### `test_configs`  (teacher-defined test templates per student)
```sql
id            SERIAL PRIMARY KEY
student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE
name          TEXT NOT NULL
subject       TEXT                   -- NULL = any
category      TEXT                   -- NULL = any
difficulty_min INTEGER DEFAULT 1
difficulty_max INTEGER DEFAULT 5
question_count INTEGER NOT NULL DEFAULT 10
active        BOOLEAN NOT NULL DEFAULT TRUE
created_at    TIMESTAMPTZ DEFAULT NOW()
```

### `test_sessions`
```sql
id            SERIAL PRIMARY KEY
student_id    INTEGER REFERENCES students(id)
config_id     INTEGER REFERENCES test_configs(id)
started_at    TIMESTAMPTZ DEFAULT NOW()
finished_at   TIMESTAMPTZ
score         INTEGER                -- correct count
total         INTEGER
```

### `test_answers`
```sql
id            SERIAL PRIMARY KEY
session_id    INTEGER REFERENCES test_sessions(id)
question_id   INTEGER REFERENCES questions(id)
correct       BOOLEAN NOT NULL
answered_at   TIMESTAMPTZ DEFAULT NOW()
```

---

## Implementation Phases

### Phase 1 — Docker + Database Setup  `[ ]`
**Files to create:**
- `docker-compose.yml` — postgres + api services
- `server/` directory structure
- `server/package.json` — Express, pg, ts-node-dev, etc.
- `server/tsconfig.json`
- `server/src/db.ts` — pg Pool singleton
- `server/migrations/001_initial.sql` — all table CREATE statements
- `server/src/migrate.ts` — runs SQL migration files on startup
- Update root `package.json` scripts: `dev:server`, `dev:all`

**Acceptance:** `docker-compose up` → postgres running; `npm run dev:server` → "DB ready" log

---

### Phase 2 — Question Seeding & API  `[ ]`
**Files to create:**
- `server/src/seed.ts` — reads existing TS level files, inserts into `questions` if empty
- `server/src/routes/questions.ts` — REST endpoints:
  - `GET /api/questions?subject=&type=&difficulty_min=&difficulty_max=&student_id=`
  - `POST /api/questions` — create
  - `PUT /api/questions/:id` — update
  - `DELETE /api/questions/:id` — soft-delete (active=false)
  - `POST /api/questions/import` — bulk import JSON/CSV
- `server/src/app.ts` — Express app entry

**Seeding logic:** On startup, count questions; if 0 → import from all existing level files.  
Each question gets `difficulty=3` by default; teacher adjusts later.

**Acceptance:** GET /api/questions returns all seeded questions as JSON

---

### Phase 3 — Student API  `[ ]`
**Files to create:**
- `server/src/routes/students.ts`:
  - `GET /api/students` — list all
  - `POST /api/students` — create (name, initial settings)
  - `PUT /api/students/:id` — update progress/state
  - `DELETE /api/students/:id` — remove
  - `GET /api/students/:id/questions` — their assigned question pool
  - `POST /api/students/:id/questions` — assign questions
  - `DELETE /api/students/:id/questions/:qid` — remove from pool

**Seed data:** Insert Matthew & Leon on first run if students table empty.

**Acceptance:** API returns Matthew and Leon with default stats

---

### Phase 4 — Frontend: Student Picker & API Integration  `[ ]`
**Files to create/modify:**
- `src/api/client.ts` — typed fetch wrappers for all API routes
- `src/components/StudentPicker.tsx` — full-screen student selector shown on load
- Modify `src/App.tsx`:
  - Show `StudentPicker` when no student is selected (replaces localStorage check)
  - Load `PlayerState` from API instead of localStorage
  - Save `PlayerState` to API on changes (debounced, still save localStorage as fallback)
- Modify `src/game/store.ts`:
  - Add `currentStudentId` to state
  - `saveState()` also calls `PUT /api/students/:id`

**Acceptance:** Two buttons "Matthew" / "Leon" appear on load; picking one loads their DB state

---

### Phase 5 — Frontend: Question Loading from API  `[ ]`
**Files to modify:**
- `src/game/levels.ts` — replace static level arrays with async `fetchLevels(subject, filters)` 
- `src/game/store.ts` — `pickNextLevel()` works from fetched pool
- Add loading state in `App.tsx` while questions fetch

**Caching strategy:** Fetch question pool once on student select → store in module-level cache.  
Cache invalidates on teacher import or student question-set change.

**Acceptance:** Game plays using questions from DB; existing gameplay unchanged

---

### Phase 6 — Teacher UI: Question Management  `[ ]`
**Files to create:**
- `src/components/teacher/QuestionTable.tsx` — paginated sortable table of all questions
  - Columns: Subject, Category, Word/Prompt, Difficulty (1–5 badge), Active toggle
  - Row actions: Edit, Delete
  - Header: Filter bar (subject, type, difficulty range, search text), Import button, Add New button
- `src/components/teacher/QuestionForm.tsx` — modal form for create/edit
  - Fields: Subject, Type/Category, Grade, Word, Prompt, Choices (dynamic list), Answer, Definition, Context Sentence, Hints × 2, Coach, Difficulty slider (1–5), Active toggle
- `src/components/teacher/ImportQuestions.tsx` — drag-drop JSON/CSV import panel
- Wire into existing `TeacherModal` as a new tab "Questions"

**Acceptance:** Teacher can view, filter, add, edit, delete questions from the UI

---

### Phase 7 — Teacher UI: Student Management  `[ ]`
**Files to create:**
- `src/components/teacher/StudentList.tsx` — cards for each student showing stats
  - Stats: XP, Stars, Streak, Mastery %, last active
  - Actions: Edit, Delete, Reset Progress, View Test History
- `src/components/teacher/StudentForm.tsx` — add/edit student (name, grade unlock)
- `src/components/teacher/StudentQuestionPool.tsx` — per-student question assignment
  - Shows full question list with checkboxes; "Use global pool" vs "Custom selection"
  - Filter by subject/category/difficulty to bulk-assign
- Wire into `TeacherModal` as a new tab "Students"

**Acceptance:** Teacher can add Matthew/Leon, customize their question pools

---

### Phase 8 — Difficulty Level System  `[ ]`
**Changes:**
- `src/game/types.ts` — add `difficulty?: number` to `Level` interface
- `server/src/routes/questions.ts` — `difficulty_min`/`difficulty_max` query params
- `src/components/teacher/DifficultyBadge.tsx` — color-coded 1–5 pill component
- Teacher can set difficulty on any question in QuestionForm
- `pickNextLevel()` respects difficulty filters from active test config

**Acceptance:** Teacher sets difficulty on questions; game respects difficulty filter

---

### Phase 9 — Test Config & Results  `[ ]`
**Files to create:**
- `server/src/routes/tests.ts`:
  - `GET /api/tests?student_id=` — list configs
  - `POST /api/tests` — create config
  - `PUT /api/tests/:id` — update
  - `DELETE /api/tests/:id`
  - `POST /api/tests/:id/sessions` — start a test session
  - `PUT /api/tests/sessions/:sid` — finish session (post results)
  - `GET /api/students/:id/results` — test history
- `src/components/teacher/TestConfigPanel.tsx` — per-student test template builder
  - Fields: Name, Subject, Category, Difficulty Min/Max (sliders), Question Count, Active
- `src/components/teacher/TestResults.tsx` — table of past test sessions per student
  - Score, total, date, per-question breakdown on expand
- Wire into `TeacherModal` as "Tests" tab

**Acceptance:** Teacher creates a test config for Matthew; Matthew plays it; results saved

---

### Phase 10 — Polish & Migration  `[ ]`
- Remove dependency on localStorage for game state (DB is source of truth)
- Keep localStorage only as offline fallback / session cache
- Add `vite.config.ts` proxy: `/api` → `http://localhost:3001`
- Update `README.md` with Docker setup instructions
- `npm run seed` script to (re)seed all existing questions
- Error boundaries in React for API failures
- Loader/spinner while fetching questions or student state

---

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| — | — | — |

---

## Key Decisions Log
| Decision | Rationale |
|----------|-----------|
| Node.js + Express (not Next.js API routes) | Keep frontend as pure Vite SPA; separate concerns cleanly |
| pg (no ORM) | Simple queries, no migration framework overhead, full SQL control |
| Difficulty 1–5 integer | Easy for teacher to set; can map to labels (Easy/Medium/Hard/Advanced/Expert) |
| Student picker (no password) | Kids just tap their name; teacher mode still password-gated |
| question pool = global by default | Per-student override is opt-in; reduces teacher setup friction |
| Seeding from TS files | Preserves all existing content; no manual re-entry |
