import './style.css'
import { DrawController } from './draw/draw-controller';
import { GameState } from './game/game-state';
import { Heartbeat } from './heartbeat';
import { ObjectCache } from './draw/object-cache';
import { drawHeader } from './draw/header';
import { drawAntimatterDimensions } from './draw/antimatter-dimensions';
import { EventController } from './events';
import { AntimatterDimension } from './game/dimensions/antimatter-dimension';
import { VisibilityController } from './game/dimensions/visibility-controller';

let objectCache = new ObjectCache();

VisibilityController.reset();

/**************************************************************************/

EventController.init();

for (let dim = 1; dim <= 8; dim++) {
  // Buy Dimensions
  EventController.register(`keypress-${dim}`, () => GameState.antimatterDimensions[dim - 1].buy(undefined, true))
  EventController.register(`ad${dim}-buy-button`, () => GameState.antimatterDimensions[dim - 1].buyButton())
}

// Dimension Buy Behavior
EventController.register(`toggle-buy-max-button`, AntimatterDimension.toggleBuyUntil10)

// Buy Tickspeed
EventController.register(`tickspeed-buy-button`, () => GameState.tickspeed.buy())
EventController.register(`tickspeed-buy-max`, () => GameState.tickspeed.buyMax())
EventController.register(`keypress-t`, () => GameState.tickspeed.buyMax())

// Buy Max
function buyMax() {
  GameState.tickspeed.buyMax();
  GameState.antimatterDimensions.forEach(dim => dim.buyMax());
}
EventController.register('buy-max-button', buyMax)
EventController.register('keypress-m', buyMax)

// Dimboost
EventController.register('dimboost-buy', () => GameState.dimboost.buy())
EventController.register('keypress-d', () => GameState.dimboost.buy())

// Galaxy
EventController.register('galaxy-buy', () => GameState.galaxy.buy())
EventController.register('keypress-g', () => GameState.galaxy.buy())

// Galaxy
EventController.register('sacrifice-button', () => GameState.sacrifice.buy())
EventController.register('keypress-s', () => GameState.sacrifice.buy())

/**************************************************************************/

DrawController.register(drawHeader, ["header"]);
DrawController.register(drawAntimatterDimensions, ["main-AD"]);

function animate() {
  DrawController.draw("header", GameState, objectCache)
  DrawController.draw("main-AD", GameState, objectCache)
  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate)

/*************************************************************************/

Heartbeat.register(
  GameState.sacrifice,
  GameState.galaxy,
  GameState.dimboost,
  GameState.tickspeed,
  ...GameState.antimatterDimensions.map(x => x.buy10Effector),
  ...GameState.antimatterDimensions,
  GameState.antimatter,

);

let currentTime = Number(document.timeline.currentTime!);
window.setInterval(() => {
  let now = Number(document.timeline.currentTime!);
  Heartbeat.cycle((now - currentTime) / 1000);
  EventController.processEvents();
  currentTime = now;
}, 33)