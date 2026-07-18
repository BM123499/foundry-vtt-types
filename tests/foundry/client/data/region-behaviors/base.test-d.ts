import { expectTypeOf } from "vitest";

import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;
import ChangeLevelRegionBehaviorType = foundry.data.regionBehaviors.ChangeLevelRegionBehaviorType;
import DefineSurfaceRegionBehaviorType = foundry.data.regionBehaviors.DefineSurfaceRegionBehaviorType;
import ModifyMovementCostRegionBehaviorType = foundry.data.regionBehaviors.ModifyMovementCostRegionBehaviorType;
import fields = foundry.data.fields;

interface Schema extends fields.DataSchema {
  count: fields.NumberField;
}

export class RegionBehaviorSubType extends RegionBehaviorType<Schema> {}

declare global {
  interface DataModelConfig {
    RegionBehavior: {
      subType: typeof RegionBehaviorSubType;
    };
  }
}

CONFIG.RegionBehavior.dataModels.subType = RegionBehaviorSubType;

expectTypeOf(ChangeLevelRegionBehaviorType.defineSchema()).toEqualTypeOf<ChangeLevelRegionBehaviorType.Schema>();
expectTypeOf(DefineSurfaceRegionBehaviorType.defineSchema()).toEqualTypeOf<DefineSurfaceRegionBehaviorType.Schema>();
expectTypeOf(
  ModifyMovementCostRegionBehaviorType.defineSchema(),
).toEqualTypeOf<ModifyMovementCostRegionBehaviorType.Schema>();

declare const changeLevel: ChangeLevelRegionBehaviorType;
declare const surface: DefineSurfaceRegionBehaviorType;
declare const movementCost: ModifyMovementCostRegionBehaviorType;

expectTypeOf(changeLevel.movementActions).toEqualTypeOf<Set<string>>();
expectTypeOf(surface.placement).toEqualTypeOf<"bottom" | "top" | "both">();
expectTypeOf(surface.darkness).toBeBoolean();
expectTypeOf(movementCost.difficulties).toEqualTypeOf<Record<string, number | null>>();
