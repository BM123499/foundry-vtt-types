import { expectTypeOf } from "vitest";

import fields = foundry.data.fields;
import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;

expectTypeOf(
  foundry.data.regionBehaviors.ApplyActiveEffectRegionBehaviorType.defineSchema(),
).toEqualTypeOf<foundry.data.regionBehaviors.ApplyActiveEffectRegionBehaviorType.Schema>();

declare const schema: foundry.data.regionBehaviors.ApplyActiveEffectRegionBehaviorType.Schema;
expectTypeOf(schema.effects).toEqualTypeOf<
  fields.SetField<fields.DocumentUUIDField<{ type: "ActiveEffect"; nullable: false }>>
>();

const events = foundry.data.regionBehaviors.ApplyActiveEffectRegionBehaviorType.events;
expectTypeOf(events).toEqualTypeOf<foundry.data.regionBehaviors.ApplyActiveEffectRegionBehaviorType.Events>();
expectTypeOf(events.tokenEnter).toEqualTypeOf<RegionBehaviorType.EventBehaviorStaticHandler>();
expectTypeOf(events.tokenExit).toEqualTypeOf<RegionBehaviorType.EventBehaviorStaticHandler>();
expectTypeOf<"tokenEnter">().toExtend<keyof typeof events>();
expectTypeOf<"tokenExit">().toExtend<keyof typeof events>();
