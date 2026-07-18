import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace DefineSurfaceRegionBehaviorType {
  interface Schema extends fields.DataSchema {
    placement: fields.StringField<
      {
        required: true;
        blank: false;
        initial: "bottom";
        choices: {
          bottom: "BEHAVIOR.TYPES.defineSurface.PLACEMENTS.bottom.label";
          top: "BEHAVIOR.TYPES.defineSurface.PLACEMENTS.top.label";
          both: "BEHAVIOR.TYPES.defineSurface.PLACEMENTS.both.label";
        };
      },
      "bottom" | "top" | "both",
      "bottom" | "top" | "both",
      "bottom" | "top" | "both"
    >;
    light: fields.BooleanField<{ initial: true }>;
    move: fields.BooleanField<{ initial: true }>;
    sight: fields.BooleanField<{ initial: true }>;
    sound: fields.BooleanField<{ initial: true }>;
    occlusion: fields.BooleanField<{ initial: true }>;
    exposure: fields.BooleanField;
    culling: fields.BooleanField;
  }
}

/** The data model for a behavior that defines surface(s) that can restrict light, movement, sight, and sound. */
declare class DefineSurfaceRegionBehaviorType extends RegionBehaviorType<DefineSurfaceRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.defineSurface", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): DefineSurfaceRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /** Restricts darkness? Darkness is restricted if and only if light is restricted. */
  get darkness(): boolean;

  #DefineSurfaceRegionBehaviorType: true;
}

export default DefineSurfaceRegionBehaviorType;
