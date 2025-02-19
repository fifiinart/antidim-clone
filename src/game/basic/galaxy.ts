import { VisibilityController } from "../dimensions/visibility-controller";
import { Effect, Effector } from "../effect";
import { GameState } from "../game-state";

export class Galaxy implements Effector {
  value = 0;

  strength = 1;

  get power() {
    // 1/(baseMultiplier - (Galaxies * Galaxy strength (see table above) * 0.02))
    if (this.value < 3) {
      const baseMultiplier =
        this.value === 0 ? 1 / 1.1245 :
          this.value === 1 ? 1 / 1.11888888 :
            1 / 1.11267177;
      return 1 / (baseMultiplier - (this.value * this.strength * 0.02));
    } else {
      throw new Error("Galaxies over 2 not implemented")
    }
  }

  effect: Effect[] = [];
  updateEffects(): void {
    this.effect = [{ type: 'mul', factor: this.power }]
    GameState.tickspeed.effects.set(this, this.effect)
  }

  get cost() {
    return 80 + 60 * this.value;
  }

  get canBuy() {
    return GameState.antimatterDimensions[7].value >= this.cost;
  }

  resetGalaxy() {
    GameState.antimatter.reset();
    GameState.tickspeed.reset();
    GameState.antimatterDimensions.forEach(dim => dim.reset());
    GameState.dimboost.reset();
    GameState.sacrifice.reset();
    VisibilityController.resetGalaxy();
  }

  buy() {
    if (this.canBuy) {
      this.value++;
      this.resetGalaxy();
    }
  }
}