import type { AnyObject } from "fvtt-types/utils";
import { expectTypeOf } from "vitest";

class D20Roll<D extends AnyObject> extends Roll<D> {}

declare global {
  namespace CONFIG {
    interface Dice {
      D20Roll: typeof D20Roll;
    }
  }
}

CONFIG.Dice.D20Roll = D20Roll;

const d20roll = new CONFIG.Dice.D20Roll("1d20");

d20roll.evaluate();
const movementActionDescriptor = {
  label: "TOKEN.MOVEMENT.ACTIONS.climb.label",
  speedMultiplier: 0.5,
  terrainAction: "walk",
  costMultiplier: 2,
  canSelect: (_token: TokenDocument.Implementation | foundry.data.PrototypeToken) => true,
} satisfies CONFIG.Token.Movement.ActionConfigDescriptor;

expectTypeOf(movementActionDescriptor.speedMultiplier).toBeNumber();
expectTypeOf(CONFIG.Token.movement.actions.walk).toEqualTypeOf<CONFIG.Token.Movement.ActionConfig>();
expectTypeOf(CONFIG.Token.movement.actions.walk.canSelect).toEqualTypeOf<
  (token: TokenDocument.Implementation | foundry.data.PrototypeToken) => boolean
>();
expectTypeOf(
  CONFIG.Token.movement.actions.walk.getCostFunction,
).returns.toEqualTypeOf<CONFIG.Token.Movement.MovementActionCostFunction>();
