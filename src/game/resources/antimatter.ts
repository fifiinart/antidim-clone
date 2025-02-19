import { GameConstants } from "../game-constants";
import { Resource } from "../game-interfaces";

export class Antimatter implements Resource {
  value: number;
  rate: number;

  constructor() {
    this.value = GameConstants.startingAM;
    this.rate = 0;
  }

  tick(delta: number): void {
    this.value += this.rate * delta;
  }

  reset() {
    this.value = GameConstants.startingAM;
    this.rate = 0;
  }
}