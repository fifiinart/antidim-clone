import { Resource } from "./game-interfaces";
import { AntimatterDimension } from "./dimensions/antimatter-dimension";
import { Antimatter } from "./resources/antimatter";
import { Tickspeed } from "./basic/tickspeed";
import { Dimboost } from "./basic/dimboost";
import { Galaxy } from "./basic/galaxy";
import { Sacrifice } from "./basic/sacrifice";

export interface GameState {
  galaxy: any;
  antimatter: Antimatter
  antimatterDimensions: AntimatterDimension[]
  tickspeed: Tickspeed
  dimboost: Dimboost
  sacrifice: Sacrifice
}

const antimatter = new Antimatter();

const dimensions: AntimatterDimension[] = [];
for (let dim = 1; dim <= 8; dim++) {
  const resource: Resource = dimensions.length === 0 ? antimatter : dimensions[dimensions.length - 1]
  dimensions.push(new AntimatterDimension(dim, resource))
}

export const GameState: GameState = {
  antimatter, antimatterDimensions: dimensions,
  tickspeed: new Tickspeed(),
  dimboost: new Dimboost(),
  galaxy: new Galaxy(),
  sacrifice: new Sacrifice()
};