import { expectTypeOf } from "vitest";
import type { EmptyObject, InterfaceToObject } from "fvtt-types/utils";
import BaseActiveEffect = foundry.documents.BaseActiveEffect;
import Document = foundry.abstract.Document;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import fields = foundry.data.fields;
import ActiveEffectTypeDataModel = foundry.data.ActiveEffectTypeDataModel;

class TestActiveEffect<out SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends ActiveEffect<SubType> {}

// @ts-expect-error Active effects require a `name` in construction data.
new TestActiveEffect();

// @ts-expect-error Active effects require a `name` in construction data.
new TestActiveEffect({});

// @ts-expect-error Name cannot be undefined.
new TestActiveEffect({ name: undefined });

const fullSource = {
  _id: "XXXXXSomeIDXXXXX",
  name: "Stuff +1", // necessary for construction
  img: "path/to/tex.webp",
  type: "base",
  system: {
    changes: [
      {
        key: "system.stuff.value",
        type: "add",
        phase: "initial",
        priority: 60,
        value: "1",
      },
    ],
  },
  disabled: true,
  start: {
    combat: "CCCCCSomeIDCCCCC",
    combatant: "BBBBBSomeIDBBBBB",
    initiative: 15,
    round: 1,
    turn: 3,
    time: 1700000,
  },
  duration: {
    value: 20,
    units: "rounds",
    expiry: "turnEnd",
    expired: false,
  },
  description: "Increment your Stuff",
  origin: "Item.WWWWWSomeIDWWWWW.ActiveEffect.VVVVVSomeIDVVVVV",
  tint: "#C8888C",
  transfer: true,
  statuses: ["invisible", "flying"],
  showIcon: CONST.ACTIVE_EFFECT_SHOW_ICON.CONDITIONAL,
  folder: null,
  sort: 7,
  flags: {
    core: {
      overlay: true,
    },
  },
  _stats: {
    // coreVersion, systemId, systemVersion, createdTime, modifiedTime, and lastModifiedBy are managed by the server and ignored if passed
    compendiumSource: "Compendium.mysystem.pack-id.Item.YYYYYSomeIDYYYYY.ActiveEffect.ZZZZZSomeIDZZZZZ",
    duplicateSource: "Item.WWWWWSomeIDWWWWW.ActiveEffect.VVVVVSomeIDVVVVV",
  },
} as const;

// TODO: infer type from creation data
const fullTestAE = new TestActiveEffect<"base">(fullSource);

new TestActiveEffect({
  _id: null,
  name: "Stuff +1", // necessary for construction
  img: null,
  type: null,
  system: null,
  disabled: null,
  start: null,
  duration: {
    value: null,
    units: null,
    expiry: null,
    expired: null,
  },
  description: null,
  origin: null,
  tint: null,
  transfer: null,
  statuses: null,
  showIcon: null,
  folder: null,
  sort: null,
  flags: null,
  _stats: {
    // coreVersion, systemId, systemVersion, createdTime, modifiedTime, and lastModifiedBy are managed by the server and ignored if passed
    compendiumSource: null,
    duplicateSource: null,
  },
});

new TestActiveEffect({
  name: "Stuff +1", // necessary for construction
  start: null,
  duration: null,
  _stats: null,
});

new TestActiveEffect({
  _id: undefined,
  name: "Stuff +1", // necessary for construction
  img: undefined,
  type: undefined,
  system: undefined,
  disabled: undefined,
  start: undefined,
  duration: {
    value: undefined,
    units: undefined,
    expiry: undefined,
    expired: undefined,
  },
  description: undefined,
  origin: undefined,
  tint: undefined,
  transfer: undefined,
  statuses: undefined,
  showIcon: undefined,
  folder: undefined,
  sort: undefined,
  flags: undefined,
  _stats: {
    // coreVersion, systemId, systemVersion, createdTime, modifiedTime, and lastModifiedBy are managed by the server and ignored if passed
    compendiumSource: undefined,
    duplicateSource: undefined,
  },
});

new TestActiveEffect({
  name: "Stuff +1", // necessary for construction
  start: undefined,
  duration: undefined,
  _stats: undefined,
});

expectTypeOf(fullTestAE).toEqualTypeOf<TestActiveEffect<"base">>();

expectTypeOf(fullTestAE._id).toEqualTypeOf<string | null>();
expectTypeOf(fullTestAE.name).toBeString();

expectTypeOf(fullTestAE.disabled).toBeBoolean();
expectTypeOf(fullTestAE.start).toEqualTypeOf<ActiveEffect.StartData | null>();
expectTypeOf(fullTestAE.duration.value).toEqualTypeOf<number | null>();
expectTypeOf(fullTestAE.duration.units).toEqualTypeOf<CONST.ACTIVE_EFFECT_DURATION_UNITS>();
expectTypeOf(fullTestAE.duration.expiry).toEqualTypeOf<string | null>();
expectTypeOf(fullTestAE.duration.expired).toBeBoolean();
expectTypeOf(fullTestAE.transfer).toBeBoolean();
expectTypeOf(fullTestAE.statuses).toEqualTypeOf<Set<string>>();
expectTypeOf(fullTestAE.showIcon).toEqualTypeOf<CONST.ACTIVE_EFFECT_SHOW_ICON>();
expectTypeOf(fullTestAE.folder).toEqualTypeOf<Folder.Stored | null>();
expectTypeOf(fullTestAE.sort).toBeNumber();
expectTypeOf(fullTestAE.flags).toEqualTypeOf<
  foundry.data.fields.DocumentFlagsField._TwoLevelPartial<
    InterfaceToObject<ActiveEffect.CoreFlags> & InterfaceToObject<Document.CoreFlags>
  >
>();

// document-specific flags
expectTypeOf(fullTestAE.flags.core?.overlay).toEqualTypeOf<boolean | undefined>();

expectTypeOf(fullTestAE._stats).toEqualTypeOf<
  foundry.data.fields.SchemaField.InitializedData<foundry.data.fields.DocumentStatsField.Schema>
>();
expectTypeOf(fullTestAE.img).toEqualTypeOf<string | null>();
expectTypeOf(fullTestAE.origin).toEqualTypeOf<string | null>();
expectTypeOf(fullTestAE.tint).toEqualTypeOf<Color>();

// schema-level assertions
declare const schema: ActiveEffect.Schema;
expectTypeOf(schema.system).toEqualTypeOf<fields.TypeDataField<typeof BaseActiveEffect>>();
expectTypeOf(schema.start).toEqualTypeOf<fields.SchemaField<ActiveEffect.StartSchema, { nullable: true }>>();
expectTypeOf(schema.duration).toEqualTypeOf<fields.SchemaField<ActiveEffect.DurationSchema>>();
expectTypeOf(schema.origin).toEqualTypeOf<
  fields.DocumentUUIDField<{ relative: true; nullable: true; initial: null }>
>();
expectTypeOf(schema.showIcon).toEqualTypeOf<
  fields.NumberField<
    { required: true; nullable: false; initial: typeof CONST.ACTIVE_EFFECT_SHOW_ICON.CONDITIONAL },
    CONST.ACTIVE_EFFECT_SHOW_ICON | null | undefined,
    CONST.ACTIVE_EFFECT_SHOW_ICON,
    CONST.ACTIVE_EFFECT_SHOW_ICON
  >
>();
expectTypeOf(schema.folder).toEqualTypeOf<fields.ForeignDocumentField<typeof foundry.documents.BaseFolder>>();

// `ActiveEffect.ChangeSchema` aliases the TypeDataModel's schema.
declare const changeSchemaAlias: ActiveEffect.ChangeSchema;
expectTypeOf(changeSchemaAlias).toEqualTypeOf<ActiveEffectTypeDataModel.ChangeSchema>();

// DurationData still types deprecated duration aliases as optional compatibility shims.
declare const durationData: ActiveEffect.DurationData;
expectTypeOf(durationData.value).toEqualTypeOf<number | null>();
expectTypeOf(durationData.units).toEqualTypeOf<CONST.ACTIVE_EFFECT_DURATION_UNITS>();
expectTypeOf(durationData.expiry).toEqualTypeOf<string | null>();
expectTypeOf(durationData.expired).toBeBoolean();
/* eslint-disable @typescript-eslint/no-deprecated -- Compatibility aliases are intentionally asserted. */
expectTypeOf(durationData.seconds).toEqualTypeOf<number | null | undefined>();
expectTypeOf(durationData.rounds).toEqualTypeOf<number | null | undefined>();
expectTypeOf(durationData.turns).toEqualTypeOf<number | null | undefined>();
expectTypeOf(durationData.startTime).toEqualTypeOf<number | null | undefined>();
expectTypeOf(durationData.startRound).toEqualTypeOf<number | null | undefined>();
expectTypeOf(durationData.startTurn).toEqualTypeOf<number | null | undefined>();
/* eslint-enable @typescript-eslint/no-deprecated */

// non-schema:
declare const someUser: User.Implementation;
// declare const storedUser: User.Stored;
expectTypeOf(fullTestAE.canUserModify(someUser, "create")).toBeBoolean();
expectTypeOf(fullTestAE.canUserModify(someUser, "delete")).toBeBoolean();
expectTypeOf(fullTestAE.canUserModify(someUser, "update")).toBeBoolean();
expectTypeOf(fullTestAE.canUserModify(someUser, "create", { name: "Test Active Effect" })).toBeBoolean();
expectTypeOf(fullTestAE.canUserModify(someUser, "create", fullTestAE.toObject())).toBeBoolean();

expectTypeOf(fullTestAE.testUserPermission(someUser, "OBSERVER")).toBeBoolean();
expectTypeOf(fullTestAE.testUserPermission(someUser, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED)).toBeBoolean();
expectTypeOf(fullTestAE.testUserPermission(someUser, "OBSERVER", {})).toBeBoolean();
expectTypeOf(fullTestAE.testUserPermission(someUser, "OBSERVER", { exact: true })).toBeBoolean();
expectTypeOf(fullTestAE.testUserPermission(someUser, "OBSERVER", { exact: undefined })).toBeBoolean();

// migrateData and shimData overridden with no signature changes

// Document template static overrides

expectTypeOf(TestActiveEffect["_initializationOrder"]()).toEqualTypeOf<
  Generator<[string, fields.DataField.Any], void, undefined>
>();
expectTypeOf(TestActiveEffect.implementation).toEqualTypeOf<ActiveEffect.ImplementationClass>();
expectTypeOf(TestActiveEffect.baseDocument).toEqualTypeOf<typeof BaseActiveEffect>();
expectTypeOf(TestActiveEffect.collectionName).toEqualTypeOf<"effects">();
expectTypeOf(TestActiveEffect.documentName).toEqualTypeOf<"ActiveEffect">();
expectTypeOf(TestActiveEffect.TYPES).toEqualTypeOf<BaseActiveEffect.SubType[]>();
expectTypeOf(TestActiveEffect.hasTypeData).toEqualTypeOf<true>();
expectTypeOf(TestActiveEffect.hierarchy).toExtend<EmptyObject>();
expectTypeOf(TestActiveEffect.DEFAULT_ICON).toBeString();

expectTypeOf(TestActiveEffect.create({ name: "New Effect" })).branded.toEqualTypeOf<
  Promise<ActiveEffect.Stored | undefined>
>();
expectTypeOf(TestActiveEffect.createDocuments([])).branded.toEqualTypeOf<Promise<ActiveEffect.Stored[]>>();
expectTypeOf(TestActiveEffect.updateDocuments([])).toEqualTypeOf<Promise<ActiveEffect.Stored[]>>();
expectTypeOf(TestActiveEffect.deleteDocuments([])).toEqualTypeOf<Promise<ActiveEffect.Stored[]>>();

// TODO: tighten create constraints for embedded-creation contexts.
expectTypeOf(TestActiveEffect.create(fullSource)).branded.toEqualTypeOf<Promise<ActiveEffect.Stored | undefined>>();
expectTypeOf(TestActiveEffect.create(fullSource)).branded.toEqualTypeOf<Promise<ActiveEffect.Stored | undefined>>();
expectTypeOf(TestActiveEffect.create(fullSource)).branded.toEqualTypeOf<Promise<ActiveEffect.Stored | undefined>>();

expectTypeOf(TestActiveEffect.get("XXXXXSomeIDXXXXX")).toEqualTypeOf<null>();
expectTypeOf(TestActiveEffect.get("XXXXXSomeIDXXXXX", {})).toEqualTypeOf<null>();
expectTypeOf(TestActiveEffect.get("XXXXXSomeIDXXXXX", { pack: "some.pack" })).toEqualTypeOf<null>();
expectTypeOf(TestActiveEffect.get("XXXXXSomeIDXXXXX", { pack: null })).toEqualTypeOf<null>();
// expectTypeOf(TestActiveEffect.get("XXXXXSomeIDXXXXX", { pack: undefined })).toEqualTypeOf<null>();

// no hierarchy, no collections
expectTypeOf(TestActiveEffect.getCollectionName("literally anything")).toBeNull();

// declare const nonBaseAE: ActiveEffect.Implementation;
// declare const createDataArray: ActiveEffect.CreateData[];
// declare const someItem: Item.Implementation;

// const effect = someItem.effects.get("effect")!;

// TODO: better tests for the operation interfaces, beyond the minimum (probably in Document tests)
// expectTypeOf(
//   TestActiveEffect["_preCreateOperation"](
//     [effect, nonBaseAE],
//     { data: createDataArray, modifiedTime: 0, render: false, renderSheet: false },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();

// expectTypeOf(
//   TestActiveEffect["_onCreateOperation"](
//     [effect],
//     { data: createDataArray, modifiedTime: 0, render: false, renderSheet: false },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<void>>();

// declare const updateDataArray: ActiveEffect.UpdateData[];
// expectTypeOf(
//   TestActiveEffect["_preUpdateOperation"](
//     [effect],
//     { modifiedTime: 0, render: false, diff: true, recursive: true, pack: null, updates: updateDataArray },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();

// expectTypeOf(
//   TestActiveEffect["_onUpdateOperation"](
//     [effect],
//     { modifiedTime: 0, render: false, diff: true, recursive: true, pack: null, updates: updateDataArray },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<void>>();

// expectTypeOf(
//   TestActiveEffect["_preDeleteOperation"](
//     [effect],
//     { modifiedTime: 0, render: false, deleteAll: false, ids: ["YYYYYSomeIDYYYYY"] },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();

// expectTypeOf(
//   TestActiveEffect["_onDeleteOperation"](
//     [effect],
//     { modifiedTime: 0, render: false, deleteAll: false, ids: ["YYYYYSomeIDYYYYY"] },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<void>>();

expectTypeOf(TestActiveEffect.hasTypeData).toEqualTypeOf<true>();
// shim methods and _logDataFieldMigration have no type changes from Document

// core's implementation for these three are actual no-ops, no point testing the modification context
// // eslint-disable-next-line @typescript-eslint/no-deprecated
// expectTypeOf(TestActiveEffect["_onCreateDocuments"]([effect, nonBaseAE], {}));
// // eslint-disable-next-line @typescript-eslint/no-deprecated
// expectTypeOf(TestActiveEffect["_onUpdateDocuments"]([effect], {}));
// // eslint-disable-next-line @typescript-eslint/no-deprecated
// expectTypeOf(TestActiveEffect["_onDeleteDocuments"]([effect], {}));

expectTypeOf(TestActiveEffect["_schema"]).toEqualTypeOf<fields.SchemaField<ActiveEffect.Schema>>();
expectTypeOf(TestActiveEffect.schema).toEqualTypeOf<fields.SchemaField<ActiveEffect.Schema>>();

expectTypeOf(
  TestActiveEffect.validateJoint({
    name: "foo",
    flags: {
      core: {
        overlay: true,
      },
    },
    _id: null,
    _stats: {
      compendiumSource: "something",
      duplicateSource: "else",
      coreVersion: "14",
      createdTime: 2,
      lastModifiedBy: "UUUUUSomeIDUUUUU",
      modifiedTime: 7,
      systemId: "dnd5e",
      systemVersion: "4.4",
      exportSource: {
        coreVersion: "14.353",
        systemId: "dnd5e",
        systemVersion: "4.4",
        uuid: "UUUUUSomeIDUUUUU",
        worldId: "UUUUUSomeIDUUUUU",
      },
    },
    description: "bar",
    disabled: false,
    start: {
      combat: "ZZZZZSomeIDZZZZZ",
      combatant: "YYYYYSomeIDYYYYY",
      initiative: 10,
      round: 1,
      turn: 1,
      time: 7,
    },
    duration: {
      value: 42,
      units: "turns",
      expiry: "turnEnd",
      expired: false,
    },
    img: "baz.webp",
    origin: "a uuid",
    sort: 2,
    statuses: [],
    showIcon: CONST.ACTIVE_EFFECT_SHOW_ICON.ALWAYS,
    folder: null,
    system: {
      changes: [
        {
          key: "system.foo.bar",
          type: "add",
          phase: "initial",
          priority: 2,
          value: "i don't know what AEs look like",
        },
      ],
    },
    tint: "#ABCDEF",
    transfer: true,
    type: "base",
  }),
).toBeVoid();

expectTypeOf(TestActiveEffect.fromSource(fullSource)).toEqualTypeOf<ActiveEffect.Implementation>();
expectTypeOf(TestActiveEffect.fromSource(fullSource, {})).toEqualTypeOf<ActiveEffect.Implementation>();
expectTypeOf(TestActiveEffect.fromSource(fullSource)).toEqualTypeOf<ActiveEffect.Implementation>();

expectTypeOf(TestActiveEffect.fromJSON("some JSON")).toEqualTypeOf<ActiveEffect.Implementation>();

// Document template instance overrides
expectTypeOf(fullTestAE.parentCollection).toEqualTypeOf<"effects" | null>();
expectTypeOf(fullTestAE.pack).toEqualTypeOf<string | null>();
expectTypeOf(fullTestAE.compendium).toEqualTypeOf<CompendiumCollection<"ActiveEffect"> | null>();

declare const aeCompendium: ActiveEffect.Implementation["compendium"];
const _activeEffectCompendium: CompendiumCollection<"ActiveEffect"> | null = aeCompendium;
// @ts-expect-error ActiveEffect compendium is not Actor/Item compendium.
const _actorOrItemCompendium: CompendiumCollection<"Actor"> | CompendiumCollection<"Item"> | null = aeCompendium;
// TODO: create fake subtype, test its `system`
// @ts-expect-error "base" system should be an ActiveEffectTypeDataModel instance, not `never`
expectTypeOf(fullTestAE.system).toBeNever();
expectTypeOf(fullTestAE.system).toEqualTypeOf<ActiveEffect.SystemOfType<"base">>();

expectTypeOf(fullTestAE.parent).toEqualTypeOf<Actor.Implementation | Item.Implementation | null>();

// @ts-expect-error updating without data is not allowed
expectTypeOf(fullTestAE.update()).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(fullTestAE.update({})).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();

// context tests
expectTypeOf(fullTestAE.update({}, {})).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update(
    {},
    {
      animate: true,
      broadcast: false,
      diff: true,
      noHook: false,
      recursive: true,
      render: false,
    },
  ),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update(
    {},
    {
      animate: undefined,
      broadcast: undefined,
      diff: undefined,
      noHook: undefined,
      recursive: undefined,
      render: undefined,
    },
  ),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
// TODO: audit nullability of this interface
expectTypeOf(
  fullTestAE.update(
    {},
    {
      // animate not allowed to be null
      // diff not allowed to be null
      // modifiedTime not allowed to be null
      // recursive not allowed to be null
      // render not allowed to be null
    },
  ),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();

// UpdateData tests

const fullUpdateData = {
  _id: "WWWWWSomeIDWWWWW", // `_id` has to be in UpdateData for batched updates, it would never make sense to include in a single update
  name: "New Name",
  _stats: {
    compendiumSource: "New UUID",
    duplicateSource: "New UUID",
    coreVersion: "14", // TODO: omit server-managed keys of _stats from UpdateData
  },
  system: {
    changes: [
      {
        key: "name",
        type: "add",
        phase: "initial",
        priority: 1,
        value: " the Second",
      },
    ],
  },
  description: "New Description",
  disabled: false,
  start: {
    combat: "CCCCCSomeIDCCCCC",
    combatant: "BBBBBSomeIDBBBBB",
    initiative: 22,
    round: 5,
    turn: 2,
    time: 37373737,
  },
  duration: {
    value: 17,
    units: "rounds",
    expiry: "turnEnd",
    expired: false,
  },
  img: "new/path/to/img.png",
  // @ts-expect-error TODO: possibly include shims
  icon: "new/path/to/img.jpg",
  foo: 7,
  origin: "A UUID",
  statuses: ["status1", "status2"],
  showIcon: CONST.ACTIVE_EFFECT_SHOW_ICON.ALWAYS,
  folder: null,
  tint: "#EDCBAF",
  transfer: true,
  sort: 32,
  flags: {
    core: {
      overlay: false,
      sheetClass: "someApplicationName",
      sheetLock: false,
    },
  },
  // TODO: mock subtype to test
  type: "base",
} as const satisfies ActiveEffect.UpdateData;
expectTypeOf(fullTestAE.update(fullUpdateData)).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update({
    name: "some name", // no initial, can't be undefined
    system: {
      changes: [
        {
          key: "name", // required, no initial
          type: undefined,
          phase: undefined,
          priority: undefined,
          value: " the Second", // required, no initial
        },
      ],
    },
    description: undefined,
    disabled: undefined,
    start: undefined,
    duration: {
      value: undefined,
      units: undefined,
      expiry: undefined,
      expired: undefined,
    },
    img: undefined,
    origin: undefined,
    statuses: undefined,
    showIcon: undefined,
    folder: undefined,
    tint: undefined,
    transfer: undefined,
    sort: undefined,
    flags: undefined,
    // TODO: mock subtype to test
    type: undefined,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update({
    system: undefined,
    duration: undefined,
    start: undefined,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update({
    system: null,
    description: null,
    disabled: null,
    start: null,
    duration: {
      value: null,
      units: null,
      expiry: null,
      expired: null,
    },
    img: null,
    origin: null,
    statuses: null,
    showIcon: null,
    folder: null,
    tint: null,
    transfer: null,
    sort: null,
    flags: null,
    type: null,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update({
    system: null,
    start: null,
    duration: null,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();

expectTypeOf(fullTestAE.delete()).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(fullTestAE.delete({})).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
// TODO: audit DeleteOperation interface generally
// expectTypeOf(
//   fullTestAE.delete({
//     animate: false,
//     broadcast: true,
//     deleteAll: false, // delete all what?
//     modifiedTime: 42,
//     noHook: false,
//     pack: "some.pack",
//     parent: someItem, // surely this isn't valid for a delete call
//     parentUuid: "someUUID",
//     render: false,
//   }),
// ).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
// expectTypeOf(
//   fullTestAE.delete({
//     animate: undefined,
//     broadcast: undefined,
//     deleteAll: undefined,
//     modifiedTime: undefined,
//     noHook: undefined,
//     pack: undefined,
//     parent: undefined,
//     parentUuid: undefined,
//     render: undefined,
//   }),
// ).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
// expectTypeOf(
//   fullTestAE.delete({
//     // animate: not allowed to be null
//     // broadcast: not allowed to be null
//     // deleteAll: not allowed to be null
//     // modifiedTime: not allowed to be null
//     noHook: null,
//     pack: null,
//     parent: null,
//     parentUuid: null,
//     // render: not allowed to be null
//   }),
// ).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();

// // traverseEmbeddedDocuments is in the Document boilerplate template but has no signature changes yet

// // TODO: wire up core flags to get/set/unsetFlag types
// // TODO: mock up configured flags to test
// expectTypeOf(fullTestAE.getFlag("core", "overlay")).toEqualTypeOf<boolean | undefined>();
// expectTypeOf(fullTestAE.setFlag("core", "overlay", true)).toEqualTypeOf<
//   Promise<TestActiveEffect<"base"> | undefined>
// >();
// expectTypeOf(fullTestAE.unsetFlag("core", "overlay")).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();

// expectTypeOf(
//   fullTestAE["_preCreate"](
//     fullSource,
//     {
//       modifiedTime: 7,
//       render: true,
//       renderSheet: false,
//       animate: false,
//       broadcast: true,
//       clearFolder: true,
//       clearOwnership: true,
//       clearSort: true,
//       fromCompendium: false,
//       keepEmbeddedIds: true,
//       keepId: false,
//       parentUuid: "someParent",
//     },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();
// expectTypeOf(
//   fullTestAE["_preCreate"](
//     fullSource,
//     {
//       modifiedTime: 7, // required
//       render: true, // required
//       renderSheet: false, // required
//       animate: undefined,
//       broadcast: undefined,
//       clearFolder: undefined,
//       clearOwnership: undefined,
//       clearSort: undefined,
//       fromCompendium: undefined,
//       keepEmbeddedIds: undefined,
//       keepId: undefined,
//       parentUuid: undefined,
//     },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();
// expectTypeOf(
//   fullTestAE["_preCreate"](
//     fullSource,
//     {
//       modifiedTime: 7, // required
//       render: true, // required
//       renderSheet: false, // required
//       // animate not allowed to be null
//       // broadcast not allowed to be null
//       clearFolder: null,
//       clearOwnership: null,
//       clearSort: null,
//       // fromCompendium not allowed to be null
//       // keepEmbeddedIds not allowed to be null
//       // keepId not allowed to be null
//       // parentUuid not allowed to be null,
//     },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();

// expectTypeOf(
//   fullTestAE["_onCreate"](
//     fullSource,
//     {
//       data: [fullSource],
//       modifiedTime: 73,
//       render: false,
//       renderSheet: false,
//       animate: true,
//       broadcast: false,
//       clearFolder: true,
//       clearOwnership: false,
//       clearSort: true,
//       fromCompendium: true,
//       keepEmbeddedIds: false,
//       keepId: true,
//       noHook: true,
//       pack: "some.pack",
//       parent: someItem,
//       parentUuid: "SomeUUID",
//       // deprecated since v12:
//       temporary: false,
//     },
//     "UUUUUSomeIDUUUUU",
//   ),
// ).toBeVoid();
// expectTypeOf(
//   fullTestAE["_onCreate"](
//     fullSource,
//     {
//       data: [fullSource], // required
//       modifiedTime: 73, // required
//       render: false, // required
//       renderSheet: false, // required
//       // animate wil never be undefined
//       // broadcast wil never be undefined
//       // clearFolder wil never be undefined
//       // clearOwnership wil never be undefined
//       // clearSort wil never be undefined
//       // fromCompendium wil never be undefined
//       // keepEmbeddedIds wil never be undefined
//       // keepId wil never be undefined
//       // noHook wil never be undefined
//       // pack wil never be undefined
//       parent: null,
//       // parentUuid not allowed to be undefined
//       // deprecated since v12:
//       temporary: undefined,
//     },
//     "UUUUUSomeIDUUUUU",
//   ),
// ).toBeVoid();
// expectTypeOf(
//   fullTestAE["_onCreate"](
//     fullSource,
//     {
//       data: [fullSource],
//       modifiedTime: 73,
//       render: false,
//       renderSheet: false,
//       // animate will never be null
//       // broadcast will never be null
//       clearFolder: null,
//       clearOwnership: null,
//       clearSort: null,
//       // fromCompendium will never be null
//       // keepEmbeddedIds will never be null
//       // keepId will never be null
//       // noHook will never be null
//       // pack: null,
//       parent: null,
//       // parentUuid: null,
//       // deprecated since v12:
//       // TODO: `temporary` is only checked for `in`, it could be any set value and apply
//       // temporary will never be null
//     },
//     "UUUUUSomeIDUUUUU",
//   ),
// ).toBeVoid();

// expectTypeOf(
//   fullTestAE["_preUpdate"](
//     fullUpdateData,
//     {
//       diff: true,
//       modifiedTime: 8989898989,
//       recursive: false,
//       render: true,
//       animate: false,
//       broadcast: true,
//       parentUuid: "someUUID",
//     },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();
// expectTypeOf(
//   fullTestAE["_preUpdate"](
//     fullUpdateData,
//     {
//       diff: true, // required
//       modifiedTime: 8989898989, // required
//       recursive: false, // required
//       render: true, // required
//       animate: undefined,
//       broadcast: undefined,
//       parentUuid: undefined,
//     },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();
// expectTypeOf(
//   fullTestAE["_preUpdate"](
//     fullUpdateData,
//     {
//       diff: true, // required
//       modifiedTime: 8989898989, // required
//       recursive: false, // required
//       render: true, // required
//       // animate will never be null,
//       broadcast: null,
//       parentUuid: null,
//     },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();

// expectTypeOf(
//   fullTestAE["_onUpdate"](
//     fullUpdateData,
//     {
//       diff: true,
//       modifiedTime: 123456789,
//       pack: "some.pack",
//       recursive: true,
//       render: true,
//       updates: [fullUpdateData],
//       animate: false,
//       broadcast: true,
//       noHook: true,
//       parent: someItem,
//       parentUuid: "SomeUUID",
//     },
//     "UUUUUSomeIDUUUUU",
//   ),
// ).toBeVoid();
// expectTypeOf(
//   fullTestAE["_onUpdate"](
//     fullUpdateData,
//     {
//       diff: true, // required
//       modifiedTime: 123456789, // required
//       pack: "some.pack", // required
//       recursive: true, // required
//       render: true, // required
//       updates: [fullUpdateData], // required
//       // animate will never be undefined
//       // broadcast will never be undefined
//       // noHook will never be undefined
//       parent: null,
//       // parentUuid will never be undefined
//     },
//     "UUUUUSomeIDUUUUU",
//   ),
// ).toBeVoid();
// expectTypeOf(
//   fullTestAE["_onUpdate"](
//     fullUpdateData,
//     {
//       diff: true, // required
//       modifiedTime: 123456789, // required
//       pack: "some.pack", // required
//       recursive: true, // required
//       render: true, // required
//       updates: [fullUpdateData], // required
//       // animate will never be null,
//       broadcast: null,
//       noHook: null,
//       parent: null,
//       parentUuid: null,
//     },
//     "UUUUUSomeIDUUUUU",
//   ),
// ).toBeVoid();

// expectTypeOf(
//   fullTestAE["_preDelete"](
//     {
//       modifiedTime: 7,
//       render: false,
//       animate: true,
//       broadcast: true,
//       parentUuid: "SomeUUID",
//     },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();
// expectTypeOf(
//   fullTestAE["_preDelete"](
//     {
//       modifiedTime: 7, // required
//       render: false, // required
//       animate: undefined,
//       broadcast: undefined,
//       parentUuid: undefined,
//     },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();
// expectTypeOf(
//   fullTestAE["_preDelete"](
//     {
//       modifiedTime: 7, // required
//       render: false, // required
//       // animate will never be null
//       // broadcast will never be null
//       parentUuid: null,
//     },
//     storedUser,
//   ),
// ).toEqualTypeOf<Promise<boolean | void>>();

// expectTypeOf(
//   fullTestAE["_onDelete"](
//     {
//       deleteAll: false,
//       ids: ["an", "array", "of", "IDs"],
//       modifiedTime: 20000000,
//       render: false,
//       animate: false,
//       broadcast: true,
//       noHook: true,
//       pack: "some.pack",
//       parent: someItem,
//       parentUuid: "SomeUUID",
//     },
//     "UUUUUSomeIDUUUUU",
//   ),
// ).toBeVoid();
// expectTypeOf(
//   fullTestAE["_onDelete"](
//     {
//       deleteAll: false, // required
//       ids: ["an", "array", "of", "IDs"], // required
//       modifiedTime: 20000000, // required
//       render: false, // required
//       // animate will never be undefined,
//       // broadcast will never be undefined,
//       // noHook will never be undefined,
//       // pack will never be undefined,
//       parent: null,
//       // parentUuid will never be undefined,
//     },
//     "UUUUUSomeIDUUUUU",
//   ),
// ).toBeVoid();
// expectTypeOf(
//   fullTestAE["_onDelete"](
//     {
//       deleteAll: false, // required
//       ids: ["an", "array", "of", "IDs"], // required
//       modifiedTime: 20000000, // required
//       render: false, // required
//       // broadcast will never be null,
//       noHook: null,
//       pack: null,
//       parent: null,
//       parentUuid: null,
//     },
//     "UUUUUSomeIDUUUUU",
//   ),
// ).toBeVoid();
