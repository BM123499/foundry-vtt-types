import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ModifyMovementCostRegionBehaviorType {
  interface DifficultiesSchema extends fields.DataSchema {
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

  interface Schema extends fields.DataSchema {
    difficulties: fields.SchemaField<DifficultiesSchema>;
  }
}

/** The data model for a behavior that allows to modify the movement cost within the Region. */
declare class ModifyMovementCostRegionBehaviorType extends RegionBehaviorType<ModifyMovementCostRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.modifyMovementCost", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ModifyMovementCostRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /** The difficulty of each movement action. */
  declare difficulties: Record<string, number | null>;

  override prepareBaseData(): void;

  protected override _getTerrainEffects(
    token: TokenDocument.Implementation,
    segment: Pick<TokenDocument.MovementWaypoint, "width" | "height" | "shape" | "level" | "action"> & {
      preview: boolean;
    },
    options?: Omit<foundry.canvas.placeables.Token.CreateTerrainMovementPathOptions, "preview">,
  ): Array<{ name: "difficulty"; difficulty: number }>;

  #ModifyMovementCostRegionBehaviorType: true;
}

export default ModifyMovementCostRegionBehaviorType;
