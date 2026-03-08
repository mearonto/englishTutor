import Phaser from "phaser";

export const gameEvents = new Phaser.Events.EventEmitter();

export type FeedbackPayload = {
  message: string;
  good: boolean;
};
