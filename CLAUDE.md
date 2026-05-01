# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (usually http://localhost:5173)
npm run build      # Type-check with tsc then build with Vite
npm run lint       # Run ESLint
npm run preview    # Preview the production build locally
```

There are no automated tests in this project.

## Commit Rules

When implementing a user-requested feature change, make **one single commit at the end** after all files are modified and the build passes. Do not commit after each individual file change.

**At the end of every conversation**, create one commit summarizing all changes made in that session, then **push to the remote** (`git push origin main`). The commit message should be a concise summary based on what the user asked for during the conversation.

## Architecture Overview

This is **Word Quest: Northern Trails**, a Grade 3/4 vocabulary game for children built with **React + TypeScript + Phaser 3**, bundled by Vite.

### Two-layer rendering model

The UI is split between two independent rendering systems that communicate via a shared event bus:

1. **Phaser canvas** (`src/game/ChallengeScene.ts`) — renders the question prompt, multiple-choice buttons, and hint text inside a `<div id="phaser-root">` canvas element. All gameplay interaction (clicking choices, showing hints, coach mode) happens here.
2. **React shell** (`src/App.tsx`) — renders the header HUD (XP, stars, tokens, streak, grade), test status panel, action buttons (Hear Word, Next Challenge), the Camp Shop modal, and the Teacher Mode modal.

These two layers never share React state directly. They communicate exclusively through `gameEvents` (a Phaser `EventEmitter` instance in `src/game/events.ts`).

### Event bus protocol (`gameEvents`)

| Direction | Event | Description |
|---|---|---|
| React → Phaser | `command-next` | Advance to the next question |
| React → Phaser | `command-pronounce` | Re-pronounce the current word |
| React → Phaser | `command-audio-settings` | Push `{ enabled, rate }` audio config |
| Phaser → React | `feedback` | `{ message, good }` status bar update |
| Phaser → React | `round-start` | New question loaded (disables Next button) |
| Phaser → React | `question-complete` | `{ correct }` answer submitted (enables Next button, updates test counters) |

### Game state (`src/game/store.ts`)

A plain module-level singleton (not React context / Redux). `PlayerState` (XP, stars, tokens, streak, grade, mastery, inventory) is persisted to `localStorage` via `src/game/storage.ts`. Components call `subscribe(listener)` to receive updates; `App.tsx` wires this to `useState`.

### Level content (`src/game/levels.ts`)

Exports the built-in level pool (Grade 3 and 4) and manages the custom word pack overlay imported by teachers. `getLevels()` returns the merged pool. `SHOP_ITEMS` is also exported from here.

### Level selection flow

`pickNextLevel()` in `store.ts` calls `getLevels()`, filters to unlocked grades, sorts by least-played, and picks randomly from the top 4 — ensuring varied but least-practiced questions surface first. Grade 4 unlocks when Grade 3 mastery ≥ 80%.

### Retry / scaffold logic (in `ChallengeScene`)

- Miss 1: reveal `hints[0]`
- Miss 2: reveal `hints[1]` + remove one wrong distractor
- Miss 3: coach mode — reveal answer, show `coach` text, still award +1 XP

### Teacher mode

Password-protected panel in React (`localStorage` key `word-quest-teacher-password-v1`, default `"2222"`). Allows importing custom word packs (JSON or CSV) via `src/game/teacher.ts`, running fixed-length tests (10/20/50 questions), exporting progress reports, and changing the teacher password.

### Audio

TTS via the browser `speechSynthesis` API (`src/game/tts.ts`). Web Audio API tones generated directly in `ChallengeScene` (success sparkle at 660/880/1100 Hz triangle wave; miss thud at 130 Hz sawtooth). Audio settings are persisted to `localStorage` under `word-quest-audio-settings-v1`.

### Key types (`src/game/types.ts`)

- `Level` — one question (id, grade, type, word, prompt, choices, answer, definition, contextSentence, hints[2], coach)
- `PlayerState` — persisted progression (xp, stars, tokens, streak, gradeUnlocked, mastery3, learned, inventory)
- `SkillType` — `"spelling" | "homophone" | "prefix" | "suffix" | "multiple-meaning" | "word-relationships" | "compound-word" | "context-clues"`
