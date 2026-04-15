import Phaser from "phaser";
import { gameEvents } from "./events";
import { applyCorrect, applyFailedRound, breakStreak, pickNextLevel } from "./store";
import { speakWord } from "./tts";
import type { Level } from "./types";

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
  private choiceNodes: ChoiceNode[] = [];
  private audioEnabled = true;
  private speechRate = 0.88;
  private testMode = false;
  private disposed = false;

  constructor() {
    super("ChallengeScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#ffffff");
    this.add.rectangle(430, 210, 840, 390, 0xf0f8ff).setStrokeStyle(2, 0xbfdbfe);

    this.typeText = this.add.text(30, 26, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#0099cc",
      fontSize: "13px",
      fontStyle: "bold"
    });

    this.promptText = this.add.text(30, 52, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#0a3d5c",
      fontSize: "22px",
      wordWrap: { width: 790 }
    });

    this.hintText = this.add.text(30, 300, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#92400e",
      fontSize: "16px",
      wordWrap: { width: 790 }
    });

    this.metaText = this.add.text(30, 356, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#475569",
      fontSize: "15px",
      wordWrap: { width: 790 }
    });

    gameEvents.on("command-next", this.startRound, this);
    gameEvents.on("command-pronounce", this.pronounceCurrent, this);
    gameEvents.on("command-audio-settings", this.applyAudioSettings, this);
    gameEvents.on("command-set-mode", this.applyModeSettings, this);
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

    const CHOICE_LETTERS = ["A", "B", "C", "D"];
    const startY = 128;
    this.level.choices.forEach((choice, index) => {
      const y = startY + index * 56;
      const letter = CHOICE_LETTERS[index] ?? String(index + 1);

      const bg = this.add.rectangle(430, y, 770, 46, 0xffffff).setStrokeStyle(1.5, 0xbfdbfe);

      const badgeBg = this.add.rectangle(74, y, 28, 28, 0xdbeafe);
      const badgeLabel = this.add.text(74 - 5, y - 9, letter, {
        fontFamily: "Trebuchet MS, sans-serif",
        color: "#0a3d5c",
        fontSize: "14px",
        fontStyle: "bold"
      });

      const label = this.add.text(114, y - 11, choice, {
        fontFamily: "Trebuchet MS, sans-serif",
        color: "#0a3d5c",
        fontSize: "18px",
        wordWrap: { width: 670 }
      });

      const container = this.add
        .container(0, 0, [bg, badgeBg, badgeLabel, label])
        .setSize(770, 46)
        .setInteractive(
          new Phaser.Geom.Rectangle(45, y - 23, 770, 46),
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

    gameEvents.emit("feedback", { message: "", good: false });
    gameEvents.emit("round-start");
    this.pronounceCurrent();
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
      this.speak(this.level.answer, this.level.contextSentence);
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
    this.speak(this.level.answer, this.level.contextSentence);
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
