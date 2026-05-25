import type { AnyObject, EmptyObject, Identity } from "#utils";
import type TypeDataModel from "../abstract/type-data.d.mts";

import fields = foundry.data.fields;

/**
 * A TypeDataModel for {@linkcode ActiveEffect}s. A single ArrayField is defined for
 * {@linkcode ActiveEffectTypeDataModel.ChangeSchema | EffectChangeData}.
 * A system can override the `changes` SchemaField but must preserve definitions for
 * `type`, `phase`, and `priority`.
 */
declare class ActiveEffectTypeDataModel<
  Schema extends fields.DataSchema = ActiveEffectTypeDataModel.Schema,
  Parent extends ActiveEffect.Implementation = ActiveEffect.Implementation,
  BaseData extends AnyObject = EmptyObject,
  DerivedData extends AnyObject = EmptyObject,
> extends TypeDataModel<Schema, Parent, BaseData, DerivedData> {
  static override defineSchema(): ActiveEffectTypeDataModel.Schema;
}

declare namespace ActiveEffectTypeDataModel {
  interface Any extends AnyActiveEffectTypeDataModel {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectTypeDataModel> {}

  interface Schema extends fields.DataSchema {
    /**
     * The array of {@linkcode ChangeSchema | EffectChangeData} objects which the ActiveEffect applies.
     * @defaultValue `[]`
     */
    changes: fields.ArrayField<fields.SchemaField<ChangeSchema>>;
  }

  /**
   * The schema of a single change applied by an ActiveEffect. Mirrors Foundry's
   * `EffectChangeData` typedef in `common/documents/_types.mjs`.
   */
  interface ChangeSchema extends fields.DataSchema {
    /**
     * The attribute path in the Actor or Item data which the change modifies.
     */
    key: fields.StringField<{ required: true }>;

    /**
     * The modification type of this change.
     * @defaultValue `"add"`
     * @remarks Validated to be a dot-delimited alphanumeric sequence or of the form `"custom.{number}"`,
     * with a minimum length of three characters. Common core values include `"add"`, `"subtract"`,
     * `"multiply"`, `"override"`, `"upgrade"`, `"downgrade"`, and `"custom"`.
     */
    type: fields.StringField<{ required: true; blank: false; initial: "add" }>;

    /**
     * The value of the change effect. Values may be primitives or any serializable structure.
     * @defaultValue `""`
     * @remarks {@linkcode fields.AnyField | AnyField} ignores the runtime options
     * (`required`, `nullable`, `serializable`, `initial`) passed to its constructor.
     */
    value: fields.AnyField;

    /**
     * The application phase under which this change is applied. Each phase is its own priority
     * group; application of a change in an earlier phase occurs before a change in a later phase,
     * regardless of priority.
     * @defaultValue `"initial"`
     */
    phase: fields.StringField<{ required: true; blank: false; initial: "initial" }>;

    /**
     * The order in which this change is applied among other changes in a common phase. A `null`
     * value is initialized to its default priority.
     * @defaultValue `undefined`
     */
    priority: fields.NumberField;
  }
}

declare abstract class AnyActiveEffectTypeDataModel extends ActiveEffectTypeDataModel<
  ActiveEffectTypeDataModel.Schema,
  ActiveEffect.Implementation
> {
  constructor(...args: never);
}

export default ActiveEffectTypeDataModel;
