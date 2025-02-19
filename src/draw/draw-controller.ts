import { GameState } from "../game/game-state";
import { ObjectCache } from "./object-cache";
import { DrawFunction } from "./draw-interfaces";

export interface DrawController {
  registered: Map<string, DrawFunction[]>;
  register(fn: DrawFunction, tags: string[]): void;
  draw(tag: string, gameState: GameState, objectCache: ObjectCache): void;
}

export const DrawController = {
  registered: new Map<string, DrawFunction[]>(),

  register(fn: DrawFunction, tags: string[]) {
    for (const tag of tags) {
      if (this.registered.has(tag)) {
        this.registered.get(tag)!.push(fn);
      } else {
        this.registered.set(tag, [fn])
      }
    }
  },

  draw(tag: string, gameState: GameState, objectCache: ObjectCache) {
    for (const fn of this.registered.get(tag) ?? []) {
      fn(gameState, objectCache)
    }
  }
}