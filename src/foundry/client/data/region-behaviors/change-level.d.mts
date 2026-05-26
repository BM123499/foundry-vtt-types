import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ChangeLevelRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /**
     * The set of {@linkcode CONFIG.Token.movement.actions | movement actions} that trigger a level
     * change prompt. An empty set means "all actions except `displace`".
     */
    movementActions: fields.SetField<
      fields.StringField<{
        required: true;
        blank: false;
        nullable: false;
        initial: undefined;
        choices: () => Record<string, { label: string }>;
      }>
    >;
  }

  interface Events extends Record<string, RegionBehaviorType.EventBehaviorStaticHandler> {
    tokenMoveIn: RegionBehaviorType.EventBehaviorStaticHandler;
    tokenExit: RegionBehaviorType.EventBehaviorStaticHandler;
  }
}

/**
 * The data model for a behavior that prompts to change the {@linkcode Level} of Tokens that enter
 * the Region.
 */
declare class ChangeLevelRegionBehaviorType extends RegionBehaviorType<ChangeLevelRegionBehaviorType.Schema> {
  #changeLevelRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.changeLevel", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ChangeLevelRegionBehaviorType.Schema;

  static override events: ChangeLevelRegionBehaviorType.Events;
}

export default ChangeLevelRegionBehaviorType;
