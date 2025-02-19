import { format } from "./util";
import { DrawFunction } from "./draw-interfaces";

export const drawHeader: DrawFunction = (game, objects) => {
  objects.get("antimatter").textContent = format(game.antimatter.value);
  objects.get("antimatter-rate").textContent = format(game.antimatter.rate);
}