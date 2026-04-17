import Phaser from "phaser";
import { ChallengeScene } from "./ChallengeScene";

export function createGame(parent: string): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 860,
    height: 560,
    backgroundColor: "#ffffff",
    scene: [ChallengeScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  });
}
