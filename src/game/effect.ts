
export interface Effector {
  effect: Effect[];

  updateEffects(): void;
}

export interface Effectible {
  effects: Map<Effector, Effect[]>

  resolveEffects(): void;
}

export interface Effect {
  type: 'add' | 'mul' | 'exp';
  factor: number;
}
export function applyEffects(effects: Effect[], base: number): number
export function applyEffects(effects: Map<Effector, Effect[]>, base: number): number
export function applyEffects(effects: Effect[] | Map<Effector, Effect[]>, base: number): number {
  let addEffect = 0;
  let mulEffect = 1;
  let expEffect = 1;
  for (const effect of [...effects.values()].flat()) {
    switch (effect.type) {
      case "add":
        addEffect += effect.factor;
        break;
      case "mul":
        mulEffect *= effect.factor;
        break;
      case "exp":
        expEffect *= effect.factor;
        break;
      default:
        throw new Error(`Invalid effect ${effect.type}.`);
    }
  }
  return ((base + addEffect) * mulEffect) ** expEffect;
}

export function distributeEffects(effector: Effector, effects: Effect[], objects: Effectible[]) {
  for (const object of objects) {
    object.effects.set(effector, effects);
  }
}