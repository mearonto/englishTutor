# Word Quest: Northern Trails

A web-based English vocabulary game for Grades 3-4 (Ontario/Western Canada style outcomes), designed for kids ages 8-10.

## Run

1. Open `/Users/alexwang/Documents/AI/englishTutor/index.html` in a modern browser.
2. Play immediately. No install required.

## MVP Features Implemented

- Grade 3 and Grade 4 word challenges.
- Canadian spellings included (for example: `colour`, `centre`, `travelled`).
- Homophone tasks (`there/their/they're`).
- Prefix/suffix and multiple-meaning-word tasks.
- Supportive failure flow:
  - First miss: hint appears.
  - Second miss: one wrong choice removed.
  - Third miss: coach mode shows explanation and gives partial XP.
- Progression:
  - Grade 4 unlocks at 80% Grade 3 mastery.
  - XP, stars, tokens, streak tracking.
- Reward shop with token spending.
- Save system using `localStorage`.

## Files

- `index.html`: UI layout.
- `styles.css`: responsive visual styling.
- `script.js`: game logic, word data, progression, rewards, save/load.
