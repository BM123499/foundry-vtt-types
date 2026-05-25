import { expectTypeOf } from "vitest";

const registry = new foundry.helpers.ActiveEffectRegistry();

expectTypeOf(registry.initialized).toBeBoolean();
expectTypeOf(registry._initialize()).toBeVoid();

declare const effect: ActiveEffect.Implementation;
declare const actor: Actor.Implementation;
declare const item: Item.Implementation;
declare const combat: Combat.Implementation;
declare const refreshContext: foundry.helpers.ActiveEffectRegistry.RefreshContext;

expectTypeOf(registry.add(effect)).toEqualTypeOf<foundry.helpers.ActiveEffectRegistry>();
expectTypeOf(registry.addFromParent(actor)).toEqualTypeOf<foundry.helpers.ActiveEffectRegistry>();
expectTypeOf(registry.addFromParent(item)).toEqualTypeOf<foundry.helpers.ActiveEffectRegistry>();
expectTypeOf(registry.deleteFromParent(actor)).toBeBoolean();
expectTypeOf(registry.deleteFromParent(item)).toBeBoolean();
expectTypeOf(registry.values()).toExtend<IterableIterator<ActiveEffect.Implementation>>();

expectTypeOf(refreshContext.combat).toEqualTypeOf<Combat.Implementation | undefined>();
expectTypeOf(refreshContext.actors).toEqualTypeOf<Set<Actor.Implementation> | undefined>();

expectTypeOf(registry.refresh("turnStart")).toEqualTypeOf<Promise<void>>();
expectTypeOf(registry.refresh("turnStart", {})).toEqualTypeOf<Promise<void>>();
expectTypeOf(registry.refresh("turnStart", refreshContext)).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  registry.refresh("turnEnd", {
    combat,
    actors: new Set<Actor.Implementation>(),
  }),
).toEqualTypeOf<Promise<void>>();
