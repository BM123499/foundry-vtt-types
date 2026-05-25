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

expectTypeOf(foundry.data.regionBehaviors.ApplyActiveEffectRegionBehaviorType.events["tokenEnter"]).toEqualTypeOf<
  RegionBehaviorType.EventBehaviorStaticHandler | undefined
>();
expectTypeOf(foundry.data.regionBehaviors.ApplyActiveEffectRegionBehaviorType.events["tokenExit"]).toEqualTypeOf<
  RegionBehaviorType.EventBehaviorStaticHandler | undefined
>();
