import { Effectible, Effector } from "./game/effect";
import { Producer, Resource } from "./game/game-interfaces";

export interface Heartbeat {
  effectors: Effector[];
  effectibles: Effectible[];
  producers: Producer[];
  resources: Resource[];

  register(...objects: (Effector | Effectible | Producer | Resource)[]): void;
  cycle(delta: number): void;
}
export const Heartbeat: Heartbeat = {
  effectors: [],
  effectibles: [],
  producers: [],
  resources: [],

  register(...objects) { // yay duck typing
    for (const object of objects) {
      if ('effect' in object && Array.isArray(object.effect) && 'updateEffects' in object && typeof object.updateEffects === 'function') {
        this.effectors.push(object);
      }
      if ('effects' in object && object.effects instanceof Map && 'resolveEffects' in object && typeof object.resolveEffects === 'function') {
        this.effectibles.push(object);
      }
      if ('resource' in object && typeof object.resource === "object" && object.resource !== null && 'produce' in object && typeof object.produce === 'function') {
        this.producers.push(object);
      }
      if ('tick' in object && typeof object.tick === 'function') {
        this.resources.push(object);
      }
    }
  },

  cycle(delta: number) {
    for (const effector of this.effectors) {
      effector.updateEffects()
    }

    for (const effectible of this.effectibles) {
      effectible.resolveEffects()
    }

    for (const producer of this.producers) {
      producer.produce()
    }

    for (const resource of this.resources) {
      resource.tick(delta)
    }
  }
}