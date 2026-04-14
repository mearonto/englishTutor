# UI Redesign: Arctic Explorer Theme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Word Quest UI from the current plain beige theme to the "Arctic Explorer" blue/white design approved in the spec.

**Architecture:** CSS-only change. `src/App.css` is fully rewritten using new design tokens. `src/index.css` gets an updated body background. No changes to `App.tsx`, game logic, or Phaser scene.

**Tech Stack:** Plain CSS custom properties, Vite dev server for visual verification, `npm run build` for lint/type-check gate.

---

### Task 1: Design tokens + body background

**Files:**
- Modify: `src/App.css` (lines 1–8, the `:root` block)
- Modify: `src/index.css`

- [ ] **Step 1: Replace `:root` tokens in `src/App.css`**

Replace the entire `:root` block (lines 1–8) with:

```css
:root {
  --bg-start: #e8f4fd;
  --bg-end: #dbeeff;
  --surface: #ffffff;
  --ink: #0a3d5c;
  --ink-light: #475569;
  --accent: #0099cc;
  --accent-dark: #0a3d5c;
  --border: #bfdbfe;
  --ok-bg: #dcfce7;
  --ok-text: #166534;
  --ok-accent: #4ade80;
  --bad-bg: #fee2e2;
  --bad-text: #991b1b;
  --bad-accent: #f87171;
}
```

- [ ] **Step 2: Update `body` background in `src/App.css`**

Replace the existing `body { ... }` rule with:

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Segoe UI", system-ui, "Trebuchet MS", sans-serif;
  color: var(--ink);
  background: linear-gradient(160deg, var(--bg-start) 0%, var(--bg-end) 100%);
  min-height: 100vh;
}
```

- [ ] **Step 3: Update `src/index.css`**

Replace the entire file with:

```css
html,
body,
#root {
  margin: 0;
  min-height: 100%;
}
```

(No change needed — keep as-is. The body background is now set in App.css.)

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

Expected: exits 0 with no TypeScript or lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.css src/index.css
git commit -m "style: add Arctic Explorer design tokens and body background"
```

---

### Task 2: App shell + header (topbar)

**Files:**
- Modify: `src/App.css` — `.app-shell`, `.topbar`, `.topbar-row`, `.stats`

- [ ] **Step 1: Replace `.app-shell` and topbar rules**

Remove the existing `.app-shell`, `.topbar h1`, `.topbar-row`, `.topbar-row h1`, `.stats` rules and replace with:

```css
.app-shell {
  width: min(940px, 94vw);
  margin: 1.5rem auto 2rem;
  background: var(--surface);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 100, 180, 0.15);
}

.topbar {
  background: linear-gradient(135deg, #0a3d5c 0%, #1a6b8a 60%, #0099cc 100%);
  padding: 1rem 1.4rem 0.9rem;
  color: white;
}

.topbar-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.topbar-row h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.3px;
}

.topbar-row button {
  background: white;
  color: var(--accent-dark);
  border: none;
  border-radius: 20px;
  padding: 0.35rem 1rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  flex-shrink: 0;
}

.topbar-row button:hover {
  background: #f0f9ff;
}

.stats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stats span {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
}

.stats strong {
  font-weight: 800;
}
```

- [ ] **Step 2: Run dev server and verify header visually**

```bash
npm run dev
```

Open http://localhost:5173. The header should show a deep blue → teal gradient with white chip badges for Grade, XP, Stars, Tokens, Streak.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/App.css
git commit -m "style: Arctic Explorer header with gradient and stat chips"
```

---

### Task 3: Panels — metrics bar + game frame

**Files:**
- Modify: `src/App.css` — `.map-panel`, `.metrics-panel`, `.progress-wrap`, `.zone-message`, `.helper-text`, `#phaser-root`

- [ ] **Step 1: Replace panel rules**

Remove `.map-panel`, `.game-frame`, `.actions`, `.feedback` (the shared margin rule), `.metrics-panel`, `.map-panel` (the bordered rule), `.zone-message`, `.progress-wrap`, `#phaser-root`, `#phaser-root canvas`, `.helper-text` and replace with:

```css
.map-panel,
.game-frame,
.actions,
.feedback {
  margin-top: 0.8rem;
}

.metrics-panel {
  margin: 0.8rem 1rem 0;
  background: var(--surface);
  border-radius: 12px;
  padding: 0.6rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 100, 180, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.progress-wrap {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.progress-wrap span {
  background: #f1f5f9;
  color: #475569;
  border-radius: 20px;
  padding: 0.2rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.zone-message {
  font-weight: 700;
  color: var(--ok-text);
  background: var(--ok-bg);
  border-radius: 20px;
  padding: 0.2rem 0.7rem;
  font-size: 0.82rem;
}

.helper-text {
  font-size: 0.82rem;
  color: var(--ink-light);
}

.game-frame {
  margin: 0.8rem 1rem 0;
}

#phaser-root {
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 100, 180, 0.1);
}

#phaser-root canvas {
  display: block;
  width: 100%;
  height: auto;
}
```

- [ ] **Step 2: Verify visually**

Open http://localhost:5173. The test status bar should be a white pill-style card. The Phaser game canvas should sit in a white card with soft blue shadow and no visible border.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/App.css
git commit -m "style: white card panels for metrics and game frame"
```

---

### Task 4: Buttons + action row

**Files:**
- Modify: `src/App.css` — global `button`, `.actions`, `.teacher-actions`

- [ ] **Step 1: Replace button and action rules**

Remove the existing `button`, `button:hover:enabled`, `button:disabled`, `button.danger`, `.actions`, `.teacher-actions` rules and replace with:

```css
button {
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--ink);
  border-radius: 10px;
  padding: 0.55rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.15s, border-color 0.15s;
}

button:hover:enabled {
  background: #dbeafe;
  border-color: #93c5fd;
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

button.danger {
  border-color: var(--bad-accent);
  color: var(--bad-text);
}

button.danger:hover:enabled {
  background: var(--bad-bg);
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0 1rem;
}

.actions button {
  flex: 1;
  min-width: 130px;
}

/* Primary action: Next Challenge / Next Test Question */
.actions button:nth-child(2) {
  background: linear-gradient(135deg, #0099cc, #0a3d5c);
  color: white;
  border: none;
}

.actions button:nth-child(2):hover:enabled {
  background: linear-gradient(135deg, #0088bb, #082f47);
}

.teacher-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin: 0.6rem 0 1rem;
}
```

- [ ] **Step 2: Verify visually**

Open http://localhost:5173. "Next Challenge" button should have the blue gradient. Other buttons should have a light border, white bg, hover to soft blue.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/App.css
git commit -m "style: redesigned buttons with primary gradient for Next action"
```

---

### Task 5: Feedback bar

**Files:**
- Modify: `src/App.css` — `.feedback`, `.feedback.good`, `.feedback.bad`

- [ ] **Step 1: Replace feedback rules**

Remove the existing `.feedback`, `.feedback.good`, `.feedback.bad` rules and replace with:

```css
.feedback {
  margin: 0.6rem 1rem 1rem;
  min-height: 2rem;
  padding: 0.45rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  border-left: 4px solid transparent;
  transition: background 0.2s, color 0.2s;
}

.feedback.good {
  background: var(--ok-bg);
  color: var(--ok-text);
  border-left-color: var(--ok-accent);
}

.feedback.bad {
  background: var(--bad-bg);
  color: var(--bad-text);
  border-left-color: var(--bad-accent);
}
```

- [ ] **Step 2: Verify visually**

Answer a question correctly in the game. The bottom feedback bar should show a green tinted panel with a left border. Wrong answer shows red panel.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/App.css
git commit -m "style: feedback bar with colored accent border panels"
```

---

### Task 6: Modals (Shop + Teacher Mode)

**Files:**
- Modify: `src/App.css` — `.shop-modal`, `.shop-content`, `.inline-note`

- [ ] **Step 1: Replace modal rules**

Remove `.shop-modal`, `.shop-content`, `.shop-content ul`, `.shop-content li`, `.inline-note`, `.inline-note.good`, `.inline-note.bad` and replace with:

```css
.shop-modal {
  position: fixed;
  inset: 0;
  background: rgba(10, 61, 92, 0.45);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 100;
}

.shop-content {
  background: var(--surface);
  border-radius: 16px;
  border-top: 4px solid var(--accent);
  width: min(520px, 92vw);
  padding: 1.2rem 1.4rem;
  max-height: min(86vh, 760px);
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(10, 61, 92, 0.2);
}

.shop-content h2 {
  color: var(--accent-dark);
  margin-top: 0;
}

.shop-content h3 {
  color: var(--accent-dark);
  margin-bottom: 0.4rem;
}

.shop-content ul {
  padding-left: 1rem;
}

.shop-content li {
  margin-bottom: 0.6rem;
}

.inline-note {
  margin: 0.3rem 0 0.8rem;
  font-weight: 700;
  font-size: 0.88rem;
}

.inline-note.good {
  color: var(--ok-text);
}

.inline-note.bad {
  color: var(--bad-text);
}
```

- [ ] **Step 2: Verify visually**

Click "Open Camp Shop". Modal should have a blue tinted backdrop and a white card with a teal top border and drop shadow.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/App.css
git commit -m "style: modals with blue backdrop and teal top-border card"
```

---

### Task 7: Form controls, labels, toggle + responsive

**Files:**
- Modify: `src/App.css` — `select`, `input`, `.field-label`, `.toggle-row`, `@media`

- [ ] **Step 1: Replace form and responsive rules**

Remove `select`, `input[type="password"]`, `input[type="file"]`, `.field-label`, `.toggle-row`, and the `@media (max-width: 640px)` block. Replace with:

```css
.field-label {
  display: block;
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--ink);
  margin-bottom: 0.35rem;
}

select,
input[type="password"],
input[type="file"] {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 0.45rem 0.7rem;
  margin-bottom: 0.8rem;
  background: var(--surface);
  color: var(--ink);
  font-size: 0.9rem;
}

select:focus,
input[type="password"]:focus {
  outline: 2px solid var(--accent);
  border-color: var(--accent);
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0.6rem 0;
  font-size: 0.9rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .app-shell {
    margin: 0.5rem auto 1rem;
    border-radius: 12px;
  }

  .topbar-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 0.8rem;
  }

  .actions button:nth-child(2) {
    grid-column: span 2;
  }

  .teacher-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .metrics-panel {
    margin: 0.8rem 0.6rem 0;
    flex-direction: column;
    align-items: flex-start;
  }

  .game-frame {
    margin: 0.8rem 0.6rem 0;
  }

  .feedback {
    margin: 0.6rem 0.6rem 0.8rem;
  }
}
```

- [ ] **Step 2: Verify visually**

Open Teacher Mode. Password input and selects should have the new rounded border. Check on mobile viewport (DevTools → 390px width): actions should be a 2-col grid with Next spanning full width.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/App.css
git commit -m "style: form controls, toggle row, and responsive layout updates"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All spec sections covered — tokens (Task 1), header (Task 2), panels (Task 3), buttons (Task 4), feedback (Task 5), modals (Task 6), forms + responsive (Task 7)
- [x] **No placeholders:** All steps contain actual CSS
- [x] **Type consistency:** Only CSS, no function names to mismatch
- [x] **Build gate:** Every task ends with `npm run build` verification
- [x] **No App.tsx changes:** Confirmed — all changes are CSS only
