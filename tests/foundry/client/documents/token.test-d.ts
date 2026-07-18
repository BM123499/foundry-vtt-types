import { expectTypeOf } from "vitest";

declare const scene: foundry.documents.Scene;
const doc = new TokenDocument.implementation({}, { parent: scene });
expectTypeOf(doc.actor).toEqualTypeOf<Actor.Implementation | null>();

expectTypeOf(doc.move({ x: 100, y: 200, level: "LLLLLSomeIDLLLLL" })).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(doc.move([{ x: 100 }, { y: 200, checkpoint: true }], { planned: true })).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(doc.resize({ width: 2, height: 2, depth: 2 })).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(doc.startMovement()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(doc.startMovement("MMMMMSomeIDMMMMM")).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(doc.getOccupiedGridSpaceOffsets()).toEqualTypeOf<foundry.grid.BaseGrid.Offset3D[]>();
expectTypeOf(doc.getMaxOccupiedGridSpaceCount({ depth: 2 })).toBeNumber();
expectTypeOf(doc.getMovementOrigin({ level: "LLLLLSomeIDLLLLL" })).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();

class _MovementTokenDocument extends TokenDocument {
  protected override _preUpdateMovement(
    movement: TokenDocument.PreMovementOperation,
    operation: TokenDocument.Database.PreUpdateOptions,
  ) {
    movement.autoRotate = false;
    movement.showRuler = true;
    // @ts-expect-error Other pre-movement data is readonly.
    movement.method = "hud";
    expectTypeOf(operation).toEqualTypeOf<TokenDocument.Database.PreUpdateOptions>();
    return Promise.resolve();
  }

  protected override _onMovementPlanned() {}
}
expectTypeOf(doc.isOwner).toEqualTypeOf<boolean>();
expectTypeOf(doc.isLinked).toEqualTypeOf<boolean>();
expectTypeOf(doc.combatant).toEqualTypeOf<Combatant.Stored | null>();
expectTypeOf(doc.inCombat).toEqualTypeOf<boolean>();
expectTypeOf(doc.clone()).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(doc.clone({}, { save: true })).toEqualTypeOf<Promise<TokenDocument.Stored | undefined>>();
expectTypeOf(doc.actor).toEqualTypeOf<Actor.Implementation | null>();

// Can't get more specific due to delta concerns
expectTypeOf(doc.getEmbeddedCollection("Item")).toEqualTypeOf<foundry.utils.Collection<Item.Implementation>>();
expectTypeOf(doc.getEmbeddedCollection("ActiveEffect")).toEqualTypeOf<
  foundry.utils.Collection<ActiveEffect.Implementation>
>();
