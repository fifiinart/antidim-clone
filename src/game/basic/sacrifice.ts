import { Effect, Effector } from "../effect";
import { GameState } from "../game-state";

export class Sacrifice implements Effector {
  value = 1;

  base = 2;

  visible = false;

  effect: Effect[] = [];
  updateEffects(): void {
    this.effect = [{ type: 'mul', factor: this.value }]
    GameState.antimatterDimensions[7].effects.set(this, this.effect);
  }

  get pendingValue() {
    return Math.max(Math.log10(GameState.antimatterDimensions[0].value - GameState.antimatterDimensions[0].purchases) / 10) ** this.base
  }

  get pendingMultiplier() {
    return this.pendingValue / this.value;
  }

  get canBuy() {
    return GameState.antimatterDimensions[7].value > 0 && this.pendingValue > this.value;
  }

  resetSacrifice() {
    for (let dim = 0; dim < 7; dim++) {
      GameState.antimatterDimensions[dim].value = GameState.antimatterDimensions[dim].purchases;
    }
  }

  reset() {
    this.value = 1;
  }

  buy() {
    if (this.canBuy) {
      this.value = this.pendingValue;
      this.resetSacrifice();
    }
  }
}