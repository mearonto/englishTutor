import Phaser from "phaser";
import { gameEvents } from "./events";
import { applyCorrect, applyFailedRound, breakStreak, pickNextLevel } from "./store";
import { speakWord } from "./tts";
import type { Level } from "./types";

export type FontSizePref = "small" | "medium" | "large";
export const FONT_SIZE_STORAGE_KEY = "word-quest-font-size-v1";

const SIZE_CONFIG: Record<FontSizePref, {
  type: number; prompt: number; choice: number; hint: number;
  spacing: number; choiceH: number; canvas: number;
}> = {
  small:  { type: 12, prompt: 17, choice: 15, hint: 13, spacing: 52, choiceH: 42, canvas: 420 },
  medium: { type: 14, prompt: 20, choice: 18, hint: 15, spacing: 62, choiceH: 50, canvas: 490 },
  large:  { type: 16, prompt: 23, choice: 21, hint: 17, spacing: 72, choiceH: 58, canvas: 560 },
};

type ChoiceNode = {
  container: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
  value: string;
};

export class ChallengeScene extends Phaser.Scene {
  private level?: Level;
  private tries = 0;
  private complete = false;
  private promptText?: Phaser.GameObjects.Text;
  private metaText?: Phaser.GameObjects.Text;
  private hintText?: Phaser.GameObjects.Text;
  private typeText?: Phaser.GameObjects.Text;
  private bgRect?: Phaser.GameObjects.Rectangle;
  private choiceNodes: ChoiceNode[] = [];
  private audioEnabled = true;
  private speechRate = 0.88;
  private testMode = false;
  private disposed = false;
  private fontSize: FontSizePref = "small";

  constructor() {
    super("ChallengeScene");
  }

  create(): void {
    const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSizePref | null;
    if (saved && saved in SIZE_CONFIG) this.fontSize = saved;

    this.cameras.main.setBackgroundColor("#ffffff");
    this.bgRect = this.add.rectangle(430, 210, 840, 400, 0xf0f8ff).setStrokeStyle(2, 0xbfdbfe);

    this.typeText = this.add.text(28, 14, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#0099cc",
      fontSize: "12px",
      fontStyle: "bold"
    });

    this.promptText = this.add.text(28, 36, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#0a3d5c",
      fontSize: "17px",
      wordWrap: { width: 804 }
    });

    // y-positions are overridden dynamically in startRound()
    this.hintText = this.add.text(28, 360, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#92400e",
      fontSize: "13px",
      wordWrap: { width: 804 }
    });

    this.metaText = this.add.text(28, 395, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#475569",
      fontSize: "13px",
      wordWrap: { width: 804 }
    });

    gameEvents.on("command-next", this.startRound, this);
    gameEvents.on("command-pronounce", this.pronounceCurrent, this);
    gameEvents.on("command-audio-settings", this.applyAudioSettings, this);
    gameEvents.on("command-set-mode", this.applyModeSettings, this);
    gameEvents.on("command-font-size", this.applyFontSize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.cleanup, this);

    this.startRound();
  }

  private startRound(): void {
    if (!this.canRender()) {
      return;
    }
    this.level = pickNextLevel();
    this.tries = 0;
    this.complete = false;

    this.choiceNodes.forEach((node) => node.container.destroy());
    this.choiceNodes = [];

    if (!this.level || !this.promptText || !this.metaText || !this.typeText || !this.hintText) {
      return;
    }

    // Apply font size config for this round
    const cfg = SIZE_CONFIG[this.fontSize];
    if (this.scale.height !== cfg.canvas) {
      this.scale.resize(860, cfg.canvas);
    }
    // Resize background box to match canvas height
    if (this.bgRect) {
      this.bgRect.setY(cfg.canvas / 2);
      this.bgRect.setSize(840, cfg.canvas - 8);
    }
    this.typeText.setFontSize(cfg.type);
    this.promptText.setFontSize(cfg.prompt);
    this.hintText.setFontSize(cfg.hint);
    this.metaText.setFontSize(cfg.hint);

    const ASTRO_LABELS: Record<string, string> = {
      "solar-system": "Solar System",
      "stars-galaxies": "Stars & Galaxies",
      "space-exploration": "Space Exploration",
      "nasa-ksc": "NASA & KSC",
      "earth-space": "Earth & Space",
      "fun-fact": "Fun Fact",
      "astronomy-vocab": "Astronomy Vocab"
    };
    this.typeText.setText(
      this.level.grade === 0
        ? `Astronomy • ${ASTRO_LABELS[this.level.type] ?? this.level.type}`
        : `Grade ${this.level.grade} • ${this.level.type}`
    );
    this.promptText.setText(this.level.prompt);
    this.metaText.setText("");
    this.hintText.setText("");

    // Measure the actual prompt height after word-wrap so choices never overlap it
    const promptBottom = this.promptText.y + this.promptText.height;
    const choiceStartY = Math.max(cfg.choiceH * 2, promptBottom + 14);
    const choiceSpacing = cfg.spacing;
    const choiceHeight = cfg.choiceH;

    const CHOICE_LETTERS = ["A", "B", "C", "D"];
    this.level.choices.forEach((choice, index) => {
      const y = choiceStartY + index * choiceSpacing;
      const letter = CHOICE_LETTERS[index] ?? String(index + 1);

      const bg = this.add.rectangle(430, y, 800, choiceHeight, 0xffffff).setStrokeStyle(1.5, 0xbfdbfe);

      const badgeBg = this.add.rectangle(72, y, 24, 24, 0xdbeafe);
      const badgeLabel = this.add.text(72 - 4, y - 8, letter, {
        fontFamily: "Trebuchet MS, sans-serif",
        color: "#0a3d5c",
        fontSize: "12px",
        fontStyle: "bold"
      });

      const label = this.add.text(106, y - 10, choice, {
        fontFamily: "Trebuchet MS, sans-serif",
        color: "#0a3d5c",
        fontSize: `${cfg.choice}px`,
        wordWrap: { width: 700 }
      });

      const container = this.add
        .container(0, 0, [bg, badgeBg, badgeLabel, label])
        .setSize(800, choiceHeight)
        .setInteractive(
          new Phaser.Geom.Rectangle(42, y - choiceHeight / 2, 800, choiceHeight),
          Phaser.Geom.Rectangle.Contains
        );

      container.on("pointerover", () => {
        if (!this.complete) {
          bg.setFillStyle(0xdbeafe);
          badgeBg.setFillStyle(0x93c5fd);
        }
      });
      container.on("pointerout", () => {
        if (!this.complete) {
          bg.setFillStyle(0xffffff);
          badgeBg.setFillStyle(0xdbeafe);
        }
      });
      container.on("pointerdown", () => this.onChoice(choice));

      this.choiceNodes.push({ container, bg, label, value: choice });
    });

    // Position hint and meta text below the last choice
    const lastChoiceBottom = choiceStartY + (this.level.choices.length - 1) * choiceSpacing + choiceHeight / 2;
    if (this.hintText) {
      this.hintText.setY(lastChoiceBottom + 10);
    }
    if (this.metaText) {
      this.metaText.setY(lastChoiceBottom + 40);
    }

    gameEvents.emit("feedback", { message: "", good: false });
    gameEvents.emit("round-start");
    if (!this.testMode) {
      this.pronounceCurrent();
    }
  }

  private onChoice(choice: string): void {
    if (!this.level || this.complete || !this.hintText) {
      return;
    }

    this.resumeAudioContext();
    this.tries += 1;
    const isCorrect = choice === this.level.answer;

    if (this.testMode) {
      this.complete = true;
      if (isCorrect) {
        this.playSuccessCue();
        applyCorrect(this.level, 1, true);
        this.choiceNodes.forEach((node) => {
          if (node.value === choice) {
            node.bg.setFillStyle(0xdcfce7);
            node.bg.setStrokeStyle(2, 0x4ade80);
          }
        });
      } else {
        this.playMissCue();
        breakStreak();
        applyFailedRound(this.level, 1);
        this.choiceNodes.forEach((node) => {
          if (node.value === this.level?.answer) {
            node.bg.setFillStyle(0xfef3c7);
            node.bg.setStrokeStyle(2, 0xf59e0b);
          }
          node.container.disableInteractive();
        });
      }
      gameEvents.emit("question-complete", { correct: isCorrect, answer: this.level.answer, word: this.level.word, tries: 1 });
      this.time.delayedCall(900, () => {
        if (this.canRender()) {
          this.startRound();
        }
      });
      return;
    }

    if (isCorrect) {
      this.complete = true;
      this.playSuccessCue();
      const reward = applyCorrect(this.level, this.tries);
      this.choiceNodes.forEach((node) => {
        if (node.value === choice) {
          node.bg.setFillStyle(0xdcfce7);
          node.bg.setStrokeStyle(2, 0x4ade80);
        }
      });
      if (!this.testMode) {
        this.speak(this.level.answer, this.level.contextSentence);
      }
      gameEvents.emit("feedback", {
        message: `Correct! +${reward.xp} XP, +${reward.stars} stars, +${reward.tokens} tokens`,
        good: true
      });
      gameEvents.emit("question-complete", { correct: true, answer: this.level.answer, word: this.level.word, tries: this.tries });
      return;
    }

    this.playMissCue();
    breakStreak();
    if (this.tries === 1) {
      this.hintText.setText(`Hint: ${this.level.hints[0]}`);
      gameEvents.emit("feedback", { message: "Not yet. Try again with a clue.", good: false });
      return;
    }

    if (this.tries === 2) {
      const wrongEnabled = this.choiceNodes.filter(
        (node) => node.value !== this.level?.answer && node.container.input?.enabled
      );
      if (wrongEnabled.length > 1) {
        wrongEnabled[0].container.disableInteractive();
        wrongEnabled[0].bg.setAlpha(0.35);
      }
      this.hintText.setText(`Hint: ${this.level.hints[1]}`);
      gameEvents.emit("feedback", { message: "Closer. One wrong answer is removed.", good: false });
      return;
    }

    this.complete = true;
    const reward = applyFailedRound(this.level, this.tries);
    this.hintText.setText(`Coach Mode: ${this.level.coach}`);
    this.choiceNodes.forEach((node) => {
      if (node.value === this.level?.answer) {
        node.bg.setFillStyle(0xfef3c7);
        node.bg.setStrokeStyle(2, 0xf59e0b);
      }
      node.container.disableInteractive();
    });
    if (!this.testMode) {
      this.speak(this.level.answer, this.level.contextSentence);
    }
    gameEvents.emit("feedback", {
      message: `Answer: ${this.level.answer}. You still earn +${reward.xp} XP.`,
      good: false
    });
    gameEvents.emit("question-complete", { correct: false, answer: this.level.answer, word: this.level.word, tries: this.tries });
  }

  private pronounceCurrent(): void {
    if (!this.level) {
      return;
    }
    this.resumeAudioContext();
    if (this.testMode) {
      this.speak(this.level.prompt);
    } else {
      this.speak(this.level.word, this.level.contextSentence);
    }
  }

  private resumeAudioContext(): void {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === "suspended") {
      void ctx.resume();
    }
  }

  private playSuccessCue(): void {
    if (!this.audioEnabled) {
      return;
    }
    const ctx = this.getAudioContext();
    if (!ctx) {
      return;
    }
    const now = ctx.currentTime;
    this.playTone(ctx, 660, now, 0.08, "triangle", 0.06);
    this.playTone(ctx, 880, now + 0.08, 0.08, "triangle", 0.05);
    this.playTone(ctx, 1100, now + 0.16, 0.1, "sine", 0.05);
  }

  private playMissCue(): void {
    if (!this.audioEnabled) {
      return;
    }
    const ctx = this.getAudioContext();
    if (!ctx) {
      return;
    }
    const now = ctx.currentTime;
    this.playTone(ctx, 130, now, 0.15, "sawtooth", 0.08, 60);
  }

  private playTone(
    ctx: AudioContext,
    freq: number,
    start: number,
    duration: number,
    type: OscillatorType,
    gainPeak: number,
    endFreq?: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private getAudioContext(): AudioContext | null {
    const maybeCtx = (this.sound as unknown as { context?: AudioContext }).context;
    return maybeCtx ?? null;
  }

  private speak(word: string, contextSentence?: string): void {
    if (!this.audioEnabled) {
      return;
    }
    speakWord(word, contextSentence, this.speechRate);
  }

  private applyModeSettings(payload: { testMode: boolean }): void {
    this.testMode = payload.testMode;
  }

  private applyFontSize(payload: { size: FontSizePref }): void {
    if (payload.size in SIZE_CONFIG) {
      this.fontSize = payload.size;
    }
  }

  private applyAudioSettings(payload: { enabled?: boolean; rate?: number }): void {
    if (typeof payload.enabled === "boolean") {
      this.audioEnabled = payload.enabled;
    }
    if (typeof payload.rate === "number" && payload.rate > 0.5 && payload.rate <= 1.2) {
      this.speechRate = payload.rate;
    }
  }

  private cleanup(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    gameEvents.off("command-next", this.startRound, this);
    gameEvents.off("command-pronounce", this.pronounceCurrent, this);
    gameEvents.off("command-audio-settings", this.applyAudioSettings, this);
    gameEvents.off("command-set-mode", this.applyModeSettings, this);
    gameEvents.off("command-font-size", this.applyFontSize, this);
  }

  private canRender(): boolean {
    if (this.disposed || !this.sys?.isActive()) {
      return false;
    }
    const renderer = (this.game as { renderer?: { destroyed?: boolean } } | null)?.renderer;
    if (!renderer || renderer.destroyed) {
      return false;
    }
    return true;
  }
}
