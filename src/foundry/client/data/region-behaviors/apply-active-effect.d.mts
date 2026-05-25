import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ApplyActiveEffectRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /** The Active Effects that are applied to Tokens within the Region. */
    effects: fields.SetField<fields.DocumentUUIDField<{ type: "ActiveEffect"; nullable: false }>>;
  }
}

/**
 * The data model for a behavior that applies Active Effects to Tokens within the Region.
 *
 * Applies the configured Active Effects to the Token's Actor when the Token enters the region,
 * and removes them when the Token exits.
 */
declare class ApplyActiveEffectRegionBehaviorType extends RegionBehaviorType<ApplyActiveEffectRegionBehaviorType.Schema> {
  #applyActiveEffectRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.applyActiveEffect", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ApplyActiveEffectRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;
}

export default ApplyActiveEffectRegionBehaviorType;
