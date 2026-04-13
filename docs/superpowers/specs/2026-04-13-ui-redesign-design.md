# UI Redesign: Arctic Explorer Theme

**Date:** 2026-04-13  
**Scope:** `src/App.css` + `src/index.css` (CSS-only, no structural changes to `App.tsx` or game logic)

---

## Visual Direction

**Arctic Explorer** — clean, modern, blue/white palette. Inspired by a polar adventure aesthetic. Targets Grade 3–4 students; must feel fun and legible without being cartoonish.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#dbeeff` → `#e8f4fd` gradient | Page background |
| `--surface` | `#ffffff` | Card/panel backgrounds |
| `--ink` | `#0a3d5c` | Primary text |
| `--ink-light` | `#475569` | Secondary text, labels |
| `--accent` | `#0099cc` | Primary buttons, active states |
| `--accent-dark` | `#0a3d5c` | Gradient end, headings |
| `--border` | `#bfdbfe` | Card borders, input borders |
| `--ok` | `#4ade80` / `#166534` | Correct feedback |
| `--bad` | `#f87171` / `#991b1b` | Wrong feedback |

---

## Component Designs

### Header (`topbar`)

- Deep blue gradient banner: `linear-gradient(135deg, #0a3d5c, #1a6b8a, #0099cc)`
- Title left-aligned, white, bold. Grade label next to it in muted opacity.
- "Start Test" button right-aligned: white pill button with dark text.
- Stats row: horizontal flex of **chip** badges — `rgba(white, 0.15)` background, `rgba(white, 0.3)` border, rounded pill shape. Each shows icon + value.

### Test Status Bar (`.metrics-panel`)

- White card with `box-shadow: 0 2px 8px rgba(0,100,180,0.08)`.
- Left: status label in `--ink-light`.
- Right: colored pill badges — neutral (gray) for Total/Left, green for Correct, red for Wrong.

### Game Frame (`#phaser-root`)

- White card, `border-radius: 14px`, `box-shadow: 0 4px 20px rgba(0,100,180,0.10)`.
- No visible border — box-shadow provides depth.
- Phaser canvas renders inside this card unchanged.

### Action Buttons (`.actions`)

Four buttons in a flex row:
- **Hear Word** — outline style: white bg, `--border` border, `--accent-dark` text
- **Next Challenge** — primary: `linear-gradient(135deg, #0099cc, #0a3d5c)`, white text
- **Shop** — ghost: `#f0f9ff` bg, light border
- **Teacher** — ghost: same as Shop

### Feedback Bar (`.feedback`)

- Replaces plain text footer with a styled bar.
- Left border accent: `4px solid` — green for good, red for bad.
- `border-radius: 8px`, colored background tint.
- Good: `background: #dcfce7`, `color: #166534`, `border-left-color: #4ade80`
- Bad: `background: #fee2e2`, `color: #991b1b`, `border-left-color: #f87171`
- Empty state: no background, invisible (height maintained).

### Modals (`.shop-modal` / `.shop-content`)

- Backdrop: `rgba(10, 61, 92, 0.4)` (tinted blue instead of plain black)
- Modal card: white, `border-radius: 16px`, top border `4px solid #0099cc`
- Modal heading: `--accent-dark` color

### Buttons (global)

- Border: `1.5px solid #bfdbfe`
- Border-radius: `10px`
- Hover: `background: #dbeafe`
- Disabled: `opacity: 0.45`
- `.danger`: `border-color: #f87171`, hover `background: #fee2e2`

### Inputs & Selects

- Border: `1.5px solid #bfdbfe`
- Border-radius: `10px`
- Focus: `outline: 2px solid #0099cc`, `border-color: #0099cc`

---

## What Is Not Changing

- `App.tsx` HTML structure — no class renames, no new elements
- Phaser `ChallengeScene.ts` — game canvas visuals are independent
- All game logic, events, store, teacher import/export
- Responsive breakpoints (kept, updated to match new styles)

---

## Files Changed

| File | Change |
|---|---|
| `src/App.css` | Full rewrite of all rules using new palette and component styles |
| `src/index.css` | Update `body` background gradient to match Arctic palette |
