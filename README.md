# Word Quest: Northern Trails

A Grade 3/4 vocabulary and math game for children built with **React + TypeScript + Phaser 3**, backed by a **PostgreSQL** database running in Docker.

---

## Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — must be running
- [Node.js](https://nodejs.org/) 18+

### 1. Start the database + API server

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL 16** on port `5432` (data persisted in the `pg_data` Docker volume)
- **Express API** on port `3001` (auto-runs migrations + seeds questions and students on first boot)

Check logs:
```bash
docker-compose logs -f api
```

You should see:
```
[migrate] Applying: 001_initial.sql
[seed] Seeding questions…  494 inserted.
[seed] Seeding students… Matthew and Leon created.
[api] Word Quest API listening on port 3001
```

### 2. Start the frontend

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (frontend only, port 5173) |
| `npm run dev:server` | Express API server with hot-reload (port 3001) |
| `npm run dev:all` | Both frontend + backend concurrently |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint |

> **Tip:** `npm run dev:all` is the most convenient for local development — it starts both the Vite dev server and the API server together.

---

## Architecture

```
┌─────────────────────────────────────┐
│  Browser  (React + Phaser 3)        │
│  - Student picker screen            │
│  - Game (Phaser canvas)             │
│  - Teacher dashboard                │
└──────────────┬──────────────────────┘
               │ REST API (JSON, /api proxy)
┌──────────────▼──────────────────────┐
│  Express API  (port 3001)           │
│  /api/questions  — CRUD             │
│  /api/students   — CRUD + pools     │
│  /api/test-sessions — history       │
└──────────────┬──────────────────────┘
               │ node-postgres
┌──────────────▼──────────────────────┐
│  PostgreSQL 16  (Docker)            │
│  persistent volume: pg_data         │
└─────────────────────────────────────┘
```

### Key design decisions

- **Offline-first**: if the API is unreachable the app falls back to localStorage + static question files. Nothing breaks.
- **Question cache**: Phaser requires synchronous level selection. Questions are pre-fetched async into a module-level cache on student select; `pickNextLevel()` reads the cache synchronously.
- **Debounced progress sync**: game state changes are pushed to the API with a 2-second debounce. localStorage remains the canonical in-session store.
- **Soft deletes**: questions are marked `active=false` rather than hard-deleted.

---

## Database

Tables: `questions`, `students`, `student_questions`, `test_configs`, `test_sessions`, `test_answers`.

Migrations run automatically on startup from `server/migrations/` (idempotent, tracked in `_migrations`).

To reset the database:
```bash
docker-compose down -v   # removes pg_data volume — all data lost
docker-compose up -d     # fresh DB, re-seeded automatically
```

---

## Teacher Mode

Click **Teacher Mode** in the app and enter password `2222` (default).

Tabs:
- **📚 Questions** — browse, add, edit, import (JSON/CSV), and soft-delete questions
- **👩‍🎓 Students** — manage student profiles, assign custom question pools per student, set difficulty range, view test history
- **⚙️ Settings** — categories, font size, audio, lottery prizes, bonus tokens, password change

### Per-student difficulty

Each student has a **difficulty_min / difficulty_max** (1–5). Only questions within that range are served during practice and tests. Set it in the student's Edit form.

### Custom question pools

By default students draw from the global pool (all active questions). You can assign a curated subset per student using the **📚 Questions** button on their card.

---

## Seeded content

| Subject | Questions |
|---------|-----------|
| Astronomy | 324 |
| Canada G4 | 50 |
| Math Kangaroo | 120 |
| **Total** | **494** |

All seeded at difficulty 3 (Standard). Adjust individual question difficulties via the Questions tab in Teacher Mode.

---

## Offline / guest mode

If the API is not reachable (Docker not running), the student picker shows a **Continue as Guest** button. The game runs entirely on localStorage + the bundled static question files — no data is lost.
