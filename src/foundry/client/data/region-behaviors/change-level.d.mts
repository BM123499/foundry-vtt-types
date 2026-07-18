import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ChangeLevelRegionBehaviorType {
  interface Schema extends fields.DataSchema {
    movementActions: fields.SetField<
      fields.StringField<{
        required: true;
        blank: false;
        nullable: false;
        initial: undefined;
        choices: () => CONFIG.Token.Movement.Actions;
      }>
    >;
  }
}

/** The data model for a behavior that prompts to change the level of Tokens that enter the Region. */
declare class ChangeLevelRegionBehaviorType extends RegionBehaviorType<ChangeLevelRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.changeLevel", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ChangeLevelRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  #ChangeLevelRegionBehaviorType: true;
}

export default ChangeLevelRegionBehaviorType;
