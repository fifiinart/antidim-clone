import { VisibilityController } from "../dimensions/visibility-controller";
import { Effect, Effector } from "../effect";
import { GameState } from "../game-state";

export class Dimboost implements Effector {
  value = 0;
  power = 2;

  effect: Effect[] = [];
  updateEffects(): void {
    const dimensionOffsets = [0, -1, -2, -3, -4, -5, -6, -7];
    const multipliers = dimensionOffsets.map(x => Math.max(1, this.power ** (x + this.value)))
    this.effect = multipliers.map<Effect>(factor => ({ type: 'mul', factor }))
    for (let d = 0; d < 8; d++) {
      GameState.antimatterDimensions[d].effects.set(this, [this.effect[d]])
    }
  }

  get maxVisible() {
    return Math.min(8, this.value + 4)
  }

  get cost() {
    if (this.maxVisible < 8) return { dim: this.maxVisible, count: 20 }
    else return { dim: 8, count: 20 + 15 * (this.value - 4) }
  }

  get canBuy() {
    const { dim, count } = this.cost;
    return GameState.antimatterDimensions[dim - 1].value >= count;
  }

  resetDimboost() {
    GameState.antimatter.reset();
    GameState.tickspeed.reset();
    GameState.antimatterDimensions.forEach(dim => dim.reset());
    GameState.sacrifice.reset();
    VisibilityController.resetDimboost();
  }

  reset() {
    this.value = 0;
  }

  buy() {
    if (this.canBuy) {
      this.value++;
      this.resetDimboost();
    }
  }
}