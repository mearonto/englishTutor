# Word Quest: Northern Trails (React + Phaser)

A web-based Grade 3/4 vocabulary game built with React, TypeScript, and Phaser.

## Run

```bash
cd /Users/alexwang/Documents/AI/englishTutor
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## What Is Included

- Phaser challenge loop with supportive retries (hint, distractor removal, coach mode).
- React HUD for XP, stars, tokens, streak, grade unlock, and mastery progress.
- Grade 3 and Grade 4 starter content with Canadian spellings.
- Reward shop and local save (`localStorage`).
- Audio support for language learners:
  - Built-in TTS pronunciation of the challenge word and context sentence.
  - Manual `Hear Word` button to replay pronunciation.
  - Phaser/WebAudio success sparkle cue and miss thud cue.
  - Teacher-controlled `Audio On/Off` toggle.
  - Teacher-controlled pronunciation speed: `Slow`, `Normal`, `Fast`.
- Teacher Mode:
  - Import custom word packs from `.json` or `.csv`.
  - Export learner progress reports as `.json` or `.csv`.
  - Configure and run fixed-length tests: `10`, `20`, or `50` questions.
  - End-of-test scoring summary (correct count + percentage).

## Teacher Pack Import Format

### JSON
Provide an array of level objects. Example keys:

- `id`, `grade`, `type`, `word`, `prompt`
- `choices` (array), `answer`
- `definition`, `contextSentence`
- `hints` (array of 2 strings), `coach`

### CSV headers

`id,grade,type,word,prompt,choice1,choice2,choice3,answer,definition,contextSentence,hint1,hint2,coach`

## Project Structure

- `src/game/ChallengeScene.ts`: Phaser gameplay scene.
- `src/game/store.ts`: progression, rewards, unlock logic, reporting.
- `src/game/teacher.ts`: CSV/JSON import + CSV report conversion.
- `src/game/levels.ts`: base and custom level content management.
- `src/App.tsx`: React shell, controls, shop, teacher mode.

## Archived Prototype

The original vanilla prototype is preserved at:

- `/Users/alexwang/Documents/AI/englishTutor/archive/vanilla-mvp-2026-03-08`
