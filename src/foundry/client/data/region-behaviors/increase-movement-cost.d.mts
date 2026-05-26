import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ModifyMovementCostRegionBehaviorType {
  /**
   * Per-action difficulty multiplier (range `[0, 5]`, step `0.25`, initial `1`).
   *
   * Keys are dynamically derived from {@linkcode CONFIG.Token.movement.actions}, so this is typed
   * as an open record of `NumberField` schemas rather than a fixed shape.
   */
  interface Difficulties extends foundry.data.fields.DataSchema {
    [movementAction: string]: fields.NumberField<{
      required: true;
      nullable: true;
      initial: 1;
      step: 0.25;
      min: 0;
      max: 5;
      label: string;
      hint: string;
    }>;
  }

  interface Schema extends foundry.data.fields.DataSchema {
    /**
     * The per-movement-action difficulty multiplier applied within the Region. `1` is unchanged
     * cost; `0` is unrestricted; `null` defers to the action's terrain-derived difficulty (if any).
     */
    difficulties: fields.SchemaField<Difficulties>;
  }

  interface Events extends Record<string, RegionBehaviorType.EventBehaviorStaticHandler> {
    behaviorViewed: RegionBehaviorType.EventBehaviorStaticHandler;
    behaviorUnviewed: RegionBehaviorType.EventBehaviorStaticHandler;
    regionBoundary: RegionBehaviorType.EventBehaviorStaticHandler;
  }
}

/**
 * The data model for a behavior that modifies the per-movement-action difficulty within a Region.
 *
 * The file name remains `increase-movement-cost.mjs` for compatibility with the behavior type id
 * `modifyMovementCost`.
 */
declare class ModifyMovementCostRegionBehaviorType extends RegionBehaviorType<ModifyMovementCostRegionBehaviorType.Schema> {
  #modifyMovementCostRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.modifyMovementCost", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ModifyMovementCostRegionBehaviorType.Schema;

  static override events: ModifyMovementCostRegionBehaviorType.Events;
}

export default ModifyMovementCostRegionBehaviorType;
