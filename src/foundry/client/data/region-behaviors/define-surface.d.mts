import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace DefineSurfaceRegionBehaviorType {
  type Placement = "bottom" | "top" | "both";

  interface Schema extends foundry.data.fields.DataSchema {
    /**
     * Is the surface at the bottom, top, or both ends of the Region's elevation range?
     * @defaultValue `"bottom"`
     */
    placement: fields.StringField<{
      required: true;
      blank: false;
      initial: "bottom";
      choices: {
        bottom: "BEHAVIOR.TYPES.defineSurface.PLACEMENTS.bottom.label";
        top: "BEHAVIOR.TYPES.defineSurface.PLACEMENTS.top.label";
        both: "BEHAVIOR.TYPES.defineSurface.PLACEMENTS.both.label";
      };
    }>;

    /**
     * Does the surface restrict light?
     * @defaultValue `true`
     */
    light: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface restrict movement?
     * @defaultValue `true`
     */
    move: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface restrict sight?
     * @defaultValue `true`
     */
    sight: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface restrict sound?
     * @defaultValue `true`
     */
    sound: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface cause occlusion?
     * @defaultValue `true`
     */
    occlusion: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface cause exposure?
     * @defaultValue `false`
     */
    exposure: fields.BooleanField;

    /**
     * Does the surface cause culling?
     * @defaultValue `false`
     */
    culling: fields.BooleanField;
  }

  interface Events extends Record<string, RegionBehaviorType.EventBehaviorStaticHandler> {
    behaviorActivated: RegionBehaviorType.EventBehaviorStaticHandler;
    behaviorDeactivated: RegionBehaviorType.EventBehaviorStaticHandler;
    behaviorViewed: RegionBehaviorType.EventBehaviorStaticHandler;
    behaviorUnviewed: RegionBehaviorType.EventBehaviorStaticHandler;
    regionBoundary: RegionBehaviorType.EventBehaviorStaticHandler;
  }
}

/**
 * The data model for a behavior that defines surface(s) that can restrict light, movement, sight,
 * and sound within a Region.
 */
declare class DefineSurfaceRegionBehaviorType extends RegionBehaviorType<DefineSurfaceRegionBehaviorType.Schema> {
  #defineSurfaceRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.defineSurface", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): DefineSurfaceRegionBehaviorType.Schema;

  static override events: DefineSurfaceRegionBehaviorType.Events;

  /**
   * Whether the surface restricts darkness. Darkness is restricted iff light is restricted.
   */
  get darkness(): boolean;
}

export default DefineSurfaceRegionBehaviorType;
