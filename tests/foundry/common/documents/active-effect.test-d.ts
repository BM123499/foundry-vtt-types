import { expectTypeOf } from "vitest";

import BaseActiveEffect = foundry.documents.BaseActiveEffect;
import fields = foundry.data.fields;

class TestActiveEffect<
  out SubType extends BaseActiveEffect.SubType = BaseActiveEffect.SubType,
> extends BaseActiveEffect<SubType> {
  get compendium() {
    return this.inCompendium
      ? (game.packs!.get(this.pack!) as foundry.documents.collections.CompendiumCollection.ForDocument<"ActiveEffect">)
      : null;
  }
}

// @ts-expect-error Active effects require a `name` in construction data.
new TestActiveEffect();

// @ts-expect-error Active effects require a `name` in construction data.
new TestActiveEffect({});

const effect = new TestActiveEffect({
  name: "V14 Effect",
  system: {
    changes: [
      {
        key: "name",
        type: "add",
        phase: "initial",
        priority: 60,
        value: " Suffix",
      },
    ],
  },
  start: {
    combat: null,
    combatant: null,
    initiative: null,
    round: 1,
    turn: 1,
    time: 1700000,
  },
  duration: {
    value: 10,
    units: "rounds",
    expiry: "turnEnd",
    expired: false,
  },
  showIcon: CONST.ACTIVE_EFFECT_SHOW_ICON.CONDITIONAL,
  folder: null,
  statuses: ["invisible"],
});

expectTypeOf(effect.name).toBeString();
expectTypeOf(effect.start).toEqualTypeOf<ActiveEffect.StartData | null>();
expectTypeOf(effect.duration.value).toEqualTypeOf<number | null>();
expectTypeOf(effect.duration.units).toEqualTypeOf<CONST.ACTIVE_EFFECT_DURATION_UNITS>();
expectTypeOf(effect.duration.expiry).toEqualTypeOf<string | null>();
expectTypeOf(effect.duration.expired).toBeBoolean();
expectTypeOf(effect.showIcon).toEqualTypeOf<CONST.ACTIVE_EFFECT_SHOW_ICON>();
expectTypeOf(effect.folder).toEqualTypeOf<Folder.Stored | null>();
expectTypeOf(effect.origin).toEqualTypeOf<string | null>();
expectTypeOf(effect.flags.core?.overlay).toEqualTypeOf<boolean | undefined>();
expectTypeOf(effect.statuses).toEqualTypeOf<Set<string>>();

expectTypeOf(TestActiveEffect.schema).toEqualTypeOf<fields.SchemaField<ActiveEffect.Schema>>();
expectTypeOf(TestActiveEffect["_schema"]).toEqualTypeOf<fields.SchemaField<ActiveEffect.Schema>>();
expectTypeOf(TestActiveEffect.collectionName).toEqualTypeOf<"effects">();
expectTypeOf(TestActiveEffect.documentName).toEqualTypeOf<"ActiveEffect">();
expectTypeOf(TestActiveEffect.hasTypeData).toEqualTypeOf<true>();
expectTypeOf(TestActiveEffect.baseDocument).toEqualTypeOf<typeof BaseActiveEffect>();
expectTypeOf(TestActiveEffect.DEFAULT_ICON).toBeString();

expectTypeOf(TestActiveEffect.create({ name: "New Effect" })).branded.toEqualTypeOf<
  Promise<ActiveEffect.Stored | undefined>
>();
expectTypeOf(TestActiveEffect.createDocuments([])).branded.toEqualTypeOf<Promise<ActiveEffect.Stored[]>>();
expectTypeOf(TestActiveEffect.updateDocuments([])).toEqualTypeOf<Promise<ActiveEffect.Stored[]>>();
expectTypeOf(TestActiveEffect.deleteDocuments([])).toEqualTypeOf<Promise<ActiveEffect.Stored[]>>();
