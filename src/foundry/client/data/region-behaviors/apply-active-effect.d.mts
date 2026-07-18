import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ApplyActiveEffectRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /** The Active Effects that are applied to Token within the Region. */
    effects: fields.SetField<fields.DocumentUUIDField<{ type: "ActiveEffect"; nullable: false }>>;
  }
}

/**
 * The data model for a behavior that applies Active Effects to Tokens within the Region.
 *
 * This is a behavior that applies the configured Active Effects to the Token's Actor when the Token enters the region.
 * Once the Token exists the Region, these Active Effects are removed from the Token's Actor.
 */
declare class ApplyActiveEffectRegionBehaviorType extends RegionBehaviorType<ApplyActiveEffectRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.applyActiveEffect", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ApplyActiveEffectRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  override _onUpdate(changed: object, options: object, userId: string): void;

  #ApplyActiveEffectRegionBehaviorType: true;
}

export default ApplyActiveEffectRegionBehaviorType;
