import Phaser from "phaser";
import { gameEvents } from "./events";
import { applyCorrect, applyFailedRound, breakStreak, pickNextLevel } from "./store";
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

  constructor() {
    super("ChallengeScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#ffffff");
    this.add.rectangle(430, 210, 840, 390, 0xfaf9f3).setStrokeStyle(2, 0xd8d2c6);

    this.typeText = this.add.text(30, 30, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#49656f",
      fontSize: "16px"
    });

    this.promptText = this.add.text(30, 58, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#18343f",
      fontSize: "23px",
      wordWrap: { width: 790 }
    });

    this.hintText = this.add.text(30, 300, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#8c5a14",
      fontSize: "17px",
      wordWrap: { width: 790 }
    });

    this.metaText = this.add.text(30, 352, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      color: "#23414e",
      fontSize: "16px",
      wordWrap: { width: 790 }
    });

    gameEvents.on("command-next", this.startRound, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      gameEvents.off("command-next", this.startRound, this);
    });

    this.startRound();
  }

  private startRound(): void {
    this.level = pickNextLevel();
    this.tries = 0;
    this.complete = false;

    this.choiceNodes.forEach((node) => node.container.destroy());
    this.choiceNodes = [];

    if (!this.level || !this.promptText || !this.metaText || !this.typeText || !this.hintText) {
      return;
    }

    this.typeText.setText(`Grade ${this.level.grade} • ${this.level.type}`);
    this.promptText.setText(this.level.prompt);
    this.metaText.setText(`Definition: ${this.level.definition}`);
    this.hintText.setText("");

    const startY = 130;
    this.level.choices.forEach((choice, index) => {
      const y = startY + index * 54;
      const bg = this.add.rectangle(430, y, 770, 44, 0xffffff).setStrokeStyle(1, 0x3d6f73);
      const label = this.add.text(60, y - 12, choice, {
        fontFamily: "Trebuchet MS, sans-serif",
        color: "#18343f",
        fontSize: "18px",
        wordWrap: { width: 720 }
      });
      const container = this.add.container(0, 0, [bg, label]).setSize(770, 44).setInteractive(
        new Phaser.Geom.Rectangle(45, y - 22, 770, 44),
        Phaser.Geom.Rectangle.Contains
      );

      container.on("pointerover", () => {
        if (!this.complete) {
          bg.setFillStyle(0xf0fffb);
        }
      });
      container.on("pointerout", () => {
        if (!this.complete) {
          bg.setFillStyle(0xffffff);
        }
      });
      container.on("pointerdown", () => this.onChoice(choice));

      this.choiceNodes.push({ container, bg, label, value: choice });
    });

    gameEvents.emit("feedback", { message: "", good: false });
  }

  private onChoice(choice: string): void {
    if (!this.level || this.complete || !this.hintText) {
      return;
    }

    this.tries += 1;
    const isCorrect = choice === this.level.answer;

    if (isCorrect) {
      this.complete = true;
      const reward = applyCorrect(this.level, this.tries);
      this.choiceNodes.forEach((node) => {
        if (node.value === choice) {
          node.bg.setFillStyle(0xe0f7f2);
        }
      });
      gameEvents.emit("feedback", {
        message: `Correct! +${reward.xp} XP, +${reward.stars} stars, +${reward.tokens} tokens`,
        good: true
      });
      return;
    }

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
        node.bg.setFillStyle(0xfff2df);
      }
      node.container.disableInteractive();
    });
    gameEvents.emit("feedback", {
      message: `Answer: ${this.level.answer}. You still earn +${reward.xp} XP.`,
      good: false
    });
  }
}
