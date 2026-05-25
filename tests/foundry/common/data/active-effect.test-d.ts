import { expectTypeOf } from "vitest";

import fields = foundry.data.fields;
import ActiveEffectTypeDataModel = foundry.data.ActiveEffectTypeDataModel;

expectTypeOf(ActiveEffectTypeDataModel.defineSchema()).toEqualTypeOf<ActiveEffectTypeDataModel.Schema>();

declare const schema: ActiveEffectTypeDataModel.Schema;
expectTypeOf(schema.changes).toEqualTypeOf<
  fields.ArrayField<fields.SchemaField<ActiveEffectTypeDataModel.ChangeSchema>>
>();

declare const changeSchema: ActiveEffectTypeDataModel.ChangeSchema;
expectTypeOf(changeSchema.key).toEqualTypeOf<fields.StringField<{ required: true }>>();
expectTypeOf(changeSchema.type).toEqualTypeOf<fields.StringField<{ required: true; blank: false; initial: "add" }>>();
expectTypeOf(changeSchema.value).toEqualTypeOf<fields.AnyField>();
expectTypeOf(changeSchema.phase).toEqualTypeOf<
  fields.StringField<{ required: true; blank: false; initial: "initial" }>
>();
expectTypeOf(changeSchema.priority).toEqualTypeOf<fields.NumberField>();

declare const model: ActiveEffectTypeDataModel;
expectTypeOf(model).toEqualTypeOf<
  foundry.abstract.TypeDataModel<ActiveEffectTypeDataModel.Schema, ActiveEffect.Implementation>
>();
