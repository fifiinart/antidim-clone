import { GameConstants } from "../game-constants";
import { Producer, Resource } from "../game-interfaces";
import { applyEffects, Effect, Effectible, Effector } from "../effect";
import { GameState } from "../game-state";
import { VisibilityController } from "./visibility-controller";

export class AntimatterDimension implements Resource, Producer, Effectible {
  dimension: number;

  value = 0;
  rate = 0;
  purchases = 0;

  resource: Resource;
  multiplier = 1;
  tickspeed = 1;

  buy10Effector: Effector = {
    effect: [],
    updateEffects: () => {
      this.buy10Effector.effect = [{ type: 'mul', factor: 2 ** this.fullSets }]
      this.effects.set(this.buy10Effector, this.buy10Effector.effect);
    }
  }

  effects: Map<Effector, Effect[]> = new Map();

  locked = false;
  visible = true;

  constructor(dimension: number, resource: Resource) {
    this.dimension = dimension;
    this.resource = resource;
  }

  resolveEffects(): void {
    if (this.effects.has(GameState.tickspeed)) { // tickspeed does not count for multiplier, applied later
      this.tickspeed = applyEffects(GameState.tickspeed.effect, 1)
      this.effects.delete(GameState.tickspeed);
    }

    this.multiplier = applyEffects(this.effects, 1);
  }

  produce(): void {
    this.resource.rate = this.value * this.multiplier * this.tickspeed;
  }

  tick(delta: number): void {
    this.value += this.rate * delta;
  }

  get fullSets() {
    return Math.floor(this.purchases / 10);
  }

  get cost() {
    return GameConstants.amDimCost[this.dimension] * (GameConstants.amDimCostIncrease[this.dimension] ** this.fullSets);
  }

  get canBuy() {
    return !this.locked && GameState.antimatter.value >= this.cost;
  }

  get purchasesInSetOf10() {
    return this.purchases % 10;
  }

  get pendingPurchases() {
    return Math.min(Math.floor(GameState.antimatter.value / this.cost), 10 - this.purchasesInSetOf10);
  }

  get canBuyUntil10() {
    return !this.locked && this.pendingPurchases + this.purchasesInSetOf10 === 10;
  }

  static buyUntil10Mode = true;

  buy(amount: number = this.pendingPurchases, forceBuyUntil10 = false) {
    if (forceBuyUntil10 && !this.canBuyUntil10) return false;
    if (!this.locked && amount <= this.pendingPurchases) {
      GameState.antimatter.value -= amount * this.cost;
      this.purchases += amount;
      this.value += amount;
      VisibilityController.buy(this.dimension)
      return true;
    }
    return false;
  }

  buyButton() {
    this.buy(AntimatterDimension.buyUntil10Mode ? this.pendingPurchases : 1);
  }

  static toggleBuyUntil10() {
    AntimatterDimension.buyUntil10Mode = !AntimatterDimension.buyUntil10Mode;
  }

  buyMax(maxPurchases: number = Infinity) {
    while (this.buy(undefined, true) && maxPurchases-- > 0);
  }

  reset() {
    this.value = 0;
    this.purchases = 0;
    this.rate = 0;
  }

}


