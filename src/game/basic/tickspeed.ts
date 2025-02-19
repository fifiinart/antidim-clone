import { applyEffects, distributeEffects, Effect, Effectible, Effector } from "../effect";
import { GameConstants } from "../game-constants";
import { GameState } from "../game-state";
import { Galaxy } from "./galaxy";

export class Tickspeed implements Effector, Effectible {
  purchases = 0;

  get value() {
    return this.effectiveness ** this.purchases
  }
  effectiveness = 1.1245;

  effect: Effect[] = [];
  locked = false;
  visible = true;

  updateEffects(): void {
    this.effect = [{ type: 'mul', factor: this.value }];
    distributeEffects(this, this.effect, GameState.antimatterDimensions)
  }

  effects: Map<Effector, Effect[]> = new Map();

  resolveEffects(): void {
    for (const [effector, effect] of this.effects.entries()) {
      if (effector instanceof Galaxy) {
        this.effectiveness = applyEffects(effect, 1)
      }
    }
  }

  get cost() {
    return GameConstants.tickspeedCost * (GameConstants.tickspeedCostIncrease) ** this.purchases;
  };

  get canBuy() {
    return !this.locked && GameState.antimatter.value >= this.cost;
  }

  buy() {
    if (this.canBuy) {
      this.purchases++;
      GameState.antimatter.value >= this.cost;
      return true;
    }
    return false;
  }

  buyMax() {
    while (this.buy()); // TODO: use geometric series to calculate cost because this does Not scale
  }

  reset() {
    this.purchases = 0;
  }

}