import { GameState } from "../game-state"

export const VisibilityController = {
  reset() {
    for (const dim of GameState.antimatterDimensions) {
      dim.locked = dim.dimension !== 1;
      dim.visible = dim.dimension === 1;
    }
    GameState.tickspeed.locked = true;
    GameState.tickspeed.visible = false;

    GameState.sacrifice.visible = false;
  },

  buy(dimension: number) {
    if (dimension === 2) {
      GameState.tickspeed.locked = false;
      GameState.tickspeed.visible = true;
    }
    if (dimension !== 8) {
      const dim = GameState.antimatterDimensions[dimension] // next dim
      if (dim.dimension <= GameState.dimboost.maxVisible) {
        dim.visible = true;
        dim.locked = false;
      }
    }
  },

  resetDimboost() {
    for (const dim of GameState.antimatterDimensions) {
      dim.locked = dim.dimension !== 1;
    }
    if (GameState.dimboost.value >= 5) {
      GameState.sacrifice.visible = true;
    }
  },

  resetGalaxy() {
    for (const dim of GameState.antimatterDimensions) {
      dim.locked = dim.dimension !== 1;
      dim.visible = dim.dimension === 1;
    }
    //TODO: check
    GameState.tickspeed.locked = true;
    GameState.tickspeed.visible = false;

    GameState.sacrifice.visible = false;
  }
};