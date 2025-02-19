import { GameState } from "../game/game-state";
import { ObjectCache } from "./object-cache";

export interface DrawFunction {
  (gameState: GameState, objects: ObjectCache): void
}