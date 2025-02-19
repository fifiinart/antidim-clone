import { AntimatterDimension } from "../game/dimensions/antimatter-dimension";
import { DrawFunction } from "./draw-interfaces";
import { conditionalShow, format, predicateClass } from "./util";

export const drawAntimatterDimensions: DrawFunction = (game, objects) => {
  // ANTIMATTER DIMENSIONS
  objects.get("toggle-buy-max-button").textContent = AntimatterDimension.buyUntil10Mode ? "Until 10" : "Buy 1";
  for (const AD of game.antimatterDimensions) {

    const displayPendingPurchases = Math.min(AD.pendingPurchases, AntimatterDimension.buyUntil10Mode ? 10 : 1)

    const prefix = "ad" + AD.dimension;
    objects.get(prefix + "-mult").textContent = "x" + format(AD.multiplier);
    objects.get(prefix + "-count").textContent = format(Math.floor(AD.value), 0);
    objects.get(prefix + "-cost").textContent = `Cost: ${format(AD.cost * Math.max(1, displayPendingPurchases), 0, 0)} AM`;
    objects.get(prefix + "-buy").textContent = !AD.locked ? `Buy ${displayPendingPurchases}` : 'Locked';
    objects.get(prefix + "-purchases").textContent = `Purchased ${format(AD.purchases, 0)} time${AD.purchases === 1 ? '' : 's'}`
    predicateClass(objects.get(prefix + "-buy").parentElement!, "button-disabled", AD.pendingPurchases === 0);

    objects.get(prefix + "-fill-pending").style.width = ((displayPendingPurchases + AD.purchasesInSetOf10) * 10) + "%";
    objects.get(prefix + "-fill-purchased").style.width = (AD.purchasesInSetOf10 * 10) + "%";

    if (AD.dimension !== 8) {
      conditionalShow(objects.get(prefix + "-rate"), AD.rate !== 0);
      objects.get(prefix + "-rate").textContent = `(+${format(AD.rate / AD.value * 100)}%/s)`
    }
    conditionalShow(objects.get("am-d" + AD.dimension), AD.visible);
    predicateClass(objects.get("am-d" + AD.dimension), "not-reached", AD.locked);
  }

  // TICKSPEED
  objects.get("tickspeed").textContent = format(game.tickspeed.value, 3)
  objects.get("tickspeed-effect").textContent = format(game.tickspeed.effectiveness, 3)
  objects.get("tickspeed-buy").textContent = `Tickspeed Cost: ${format(game.tickspeed.cost, 0, 0)}`
  objects.get("tickspeed-purchases").textContent = `${format(game.tickspeed.purchases, 0)} Purchased Upgrade${game.tickspeed.purchases === 1 ? '' : 's'}`
  conditionalShow(objects.get("tickspeed-upgrades"), game.tickspeed.visible)

  predicateClass(objects.get("tickspeed-buy-button"), "button-disabled", !game.tickspeed.canBuy)
  predicateClass(objects.get("tickspeed-buy-max"), "button-disabled", !game.tickspeed.canBuy)

  // DIMBOOSTS
  predicateClass(objects.get("dimboost-buy"), "button-disabled", !game.dimboost.canBuy)
  const { dim, count } = game.dimboost.cost;
  objects.get("dimboost-count").textContent = `Dimension Boost (${game.dimboost.value})`
  objects.get("dimboost-cost").textContent = `Cost: ${count} ${dim}th Antimatter D`

  if (game.dimboost.value === 0) {
    objects.get("dimboost-buy").textContent = `Reset your Dimensions to unlock the 5th Dimension and give a x2.0 multiplier to the 1st Dimension`
  }
  else if (dim !== 8) {
    objects.get("dimboost-buy").textContent = `Reset your Dimensions to unlock the ${dim + 1}th Dimension and give a x2.0 multiplier to Dimensions 1-${game.dimboost.value + 1}`
  }
  else if (game.dimboost.value === 4) {
    objects.get("dimboost-buy").textContent = `Reset your Dimensions to unlock Sacrifice and give a x2.0 multiplier to Dimensions 1-5`
  } else if (game.dimboost.value < 7) {
    objects.get("dimboost-buy").textContent = `Reset your Dimensions to give a x2.0 multiplier to Dimensions 1-${Math.min(8, game.dimboost.value + 1)}`
  } else {
    objects.get("dimboost-buy").textContent = `Reset your Dimensions to give a x2.0 multiplier to all Dimensions`
  }

  // GALAXY
  predicateClass(objects.get("galaxy-buy"), "button-disabled", !game.galaxy.canBuy)
  objects.get("galaxy-count").textContent = `Antimatter Galaxies (${game.galaxy.value})`
  objects.get("galaxy-cost").textContent = `Cost: ${game.galaxy.cost} 8th Antimatter D`

  // SACRIFICE
  conditionalShow(objects.get("sacrifice-button"), game.sacrifice.visible)
  predicateClass(objects.get("sacrifice-button"), "button-disabled", !game.sacrifice.canBuy)
  objects.get("sacrifice-button").textContent = game.antimatterDimensions[7].value === 0 ? "Dimensional Sacrifice Disabled (No 8th Antimatter Dimensions)" :
    game.sacrifice.pendingMultiplier < 1 ? "Dimensional Sacrifice Disabled (x1 multiplier)" : `Dimensional Sacrifice (x${format(game.sacrifice.pendingMultiplier, 2)})`

  // INFO BAR
  const infoStrings: string[] = [];
  infoStrings.push("Buy 10 Dimension purchase multiplier: x2.00")
  if (game.sacrifice.visible) infoStrings.push(`Dimensional Sacrifice multiplier: x${format(game.sacrifice.value, 2)}`)
  objects.get("info-bar").textContent = infoStrings.join(" | ")
}