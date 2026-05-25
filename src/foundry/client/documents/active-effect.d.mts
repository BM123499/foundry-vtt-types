import type { ConfiguredActiveEffect } from "#configuration";
import type {
  AnyMutableObject,
  Identity,
  IntentionalPartial,
  InterfaceToObject,
  MaybeArray,
  Merge,
  RequiredProps,
} from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type ActiveEffectTypeDataModel from "#common/data/active-effect.d.mts";
import type { DataModel, DatabaseBackend, Document } from "#common/abstract/_module.d.mts";
import type { BaseActiveEffect, BaseCombat, BaseCombatant, BaseFolder } from "#common/documents/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

import type ActiveEffectRegistry from "#client/helpers/active-effect-registry.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDatabaseBackend from "#client/data/client-backend.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDocumentMixin from "#client/documents/abstract/client-document.d.mts";

declare namespace ActiveEffect {
  /**
   * The document's name.
   */
  type Name = "ActiveEffect";

  /**
   * The context used to create an `ActiveEffect`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `ActiveEffect`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `ActiveEffect` document instance configured through
   * {@linkcode CONFIG.ActiveEffect.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredActiveEffect | fvtt-types/configuration/ConfiguredActiveEffect} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `ActiveEffect` document configured through
   * {@linkcode CONFIG.ActiveEffect.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "ActiveEffect";
      collection: "effects";
      hasTypeData: true;
      baseTypeAllowed: true;
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
      label: "DOCUMENT.ActiveEffect";
      labelPlural: "DOCUMENT.ActiveEffects";
      schemaVersion: "14.353";
      permissions: Metadata.Permissions;
    }>
  > {}

  namespace Metadata {
    interface Permissions {
      /**
       * Embedded `ActiveEffect`s depend on parent (viz. `Actor` or `Item`) ownership; otherwise
       * the user must be at least an Assistant Gamemaster.
       */
      create(user: User.Internal.Implementation, doc: Implementation): boolean;
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `ActiveEffect`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.ActiveEffect.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"ActiveEffect">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"ActiveEffect">;

  /**
   * `Known` represents the types of `ActiveEffect` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = ActiveEffect.OfType<ActiveEffect.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `ActiveEffect` with the corresponding type. This works with both the
   * builtin `ActiveEffect` class or a custom subclass if that is set up in
   * {@linkcode ConfiguredActiveEffect | fvtt-types/configuration/ConfiguredActiveEffect}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType extends Identity<{
    [Type in SubType]: Type extends unknown
      ? ConfiguredActiveEffect<Type> extends { document: infer Document }
        ? Document
        : // eslint-disable-next-line @typescript-eslint/no-restricted-types
          ActiveEffect<Type>
      : never;
  }> {}

  /**
   * `SystemOfType` returns the system property for a specific `ActiveEffect` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<Name, _SystemMap, Type, ConfiguredSubType>;

  /**
   * @internal
   */
  interface _ModelMap extends Document.Internal.ModelMap<Name> {}

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<Name> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Actor.Implementation | Item.Implementation | null;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all instances, or never if the document doesn't have any descendants.
   */
  type Descendant = never;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = never;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = never;

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for the descendant Document operation methods, e.g
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `ActiveEffect` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `ActiveEffect` that comes from the database.
   */
  type Stored<SubType extends ActiveEffect.SubType = ActiveEffect.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode ActiveEffect._source | ActiveEffect#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode ActiveEffect.create}
   * and {@linkcode ActiveEffect | new ActiveEffect(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends fields.SchemaField
    .CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode ActiveEffect.create} and {@linkcode ActiveEffect.createDocuments} signatures, and
   * {@linkcode ActiveEffect.Database.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode ActiveEffect.create}, returning (a single | an array of) (temporary | stored)
   * `ActiveEffect`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<ActiveEffect.TemporaryIf<Temporary>>
      : ActiveEffect.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode ActiveEffect.name | ActiveEffect#name}.
   *
   * This is data transformed from {@linkcode ActiveEffect.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode ActiveEffect.update | ActiveEffect#update}.
   * It is a distinct type from {@linkcode ActiveEffect.CreateData | DeepPartial<ActiveEffect.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode ActiveEffect.update | ActiveEffect#update} and
   * {@linkcode ActiveEffect.updateDocuments} signatures, and {@linkcode ActiveEffect.Database.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode ActiveEffect}. This is the source of truth for how an ActiveEffect document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode ActiveEffect}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends fields.DataSchema {
    /**
     * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of the ActiveEffect
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * An image path used to depict the ActiveEffect as an icon.
     * @defaultValue `ActiveEffect.implementation.DEFAULT_ICON` (`"icons/svg/aura.svg"` for core)
     */
    img: fields.FilePathField<{ categories: ["IMAGE"] }>;

    type: fields.DocumentTypeField<typeof BaseActiveEffect, { initial: typeof CONST.BASE_DOCUMENT_TYPE }>;

    /**
     * The system-data sub-schema. Defaults to {@linkcode ActiveEffectTypeDataModel} for the base
     * subtype, which provides the `changes` ArrayField.
     */
    system: fields.TypeDataField<typeof BaseActiveEffect>;

    /**
     * Is this ActiveEffect currently disabled?
     * @defaultValue `false`
     */
    disabled: fields.BooleanField;

    /**
     * Data pertaining to when the ActiveEffect was created. `null` for ActiveEffects that were
     * not created on an embedded Actor.
     */
    start: fields.SchemaField<StartSchema, { nullable: true }>;

    /**
     * An EffectDurationData object which describes the duration of the ActiveEffect.
     * @remarks Compatibility aliases (`seconds`, `rounds`, `turns`, `startTime`, `startRound`,
     * `startTurn`, `combat`) remain readable on the initialized object via shim getters that emit
     * a compatibility warning when accessed. See {@linkcode Duration}.
     */
    duration: fields.SchemaField<DurationSchema>;

    /**
     * The HTML text description for this ActiveEffect document.
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ textSearch: true }>;

    /**
     * A UUID reference to the document from which this ActiveEffect originated.
     * @defaultValue `null`
     * @remarks Non-UUID strings are migrated to `null` and copied to `flags.core.originText` by
     * {@linkcode BaseActiveEffect.migrateData}. Runtime construction uses this field with
     * `{ relative: true }` at runtime so `.parent.id`-style relative UUIDs may be resolved.
     * `nullable: true; initial: null` are re-passed here to preserve the {@linkcode fields.DocumentUUIDField}
     * defaults — see the remark on {@linkcode fields.DocumentUUIDField.Options.relative | Options.relative}.
     */
    origin: fields.DocumentUUIDField<{ relative: true; nullable: true; initial: null }>;

    /**
     * A color string which applies a tint to the ActiveEffect icon
     * @defaultValue `"#ffffff"`
     */
    tint: fields.ColorField<{ nullable: false; initial: "#ffffff" }>;

    /**
     * Does this ActiveEffect automatically transfer from an Item to an Actor?
     * @defaultValue `true`
     */
    transfer: fields.BooleanField<{ initial: true }>;

    /**
     * Special status IDs that pertain to this effect
     * @defaultValue `[]`
     */
    statuses: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

    /**
     * Should this ActiveEffect's image be prominently displayed as an icon alongside Tokens,
     * Combatants, etc.?
     * @defaultValue `CONST.ACTIVE_EFFECT_SHOW_ICON.CONDITIONAL` (`1`)
     */
    showIcon: fields.NumberField<
      { required: true; nullable: false; initial: typeof CONST.ACTIVE_EFFECT_SHOW_ICON.CONDITIONAL },
      CONST.ACTIVE_EFFECT_SHOW_ICON | null | undefined,
      CONST.ACTIVE_EFFECT_SHOW_ICON,
      CONST.ACTIVE_EFFECT_SHOW_ICON
    >;

    /**
     * The containing Folder, if any.
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof BaseFolder>;

    /**
     * The sort value
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name, InterfaceToObject<CoreFlags>>;

    _stats: fields.DocumentStatsField;
  }

  /**
   * The schema of a single EffectChangeData.
   * @remarks The canonical definition lives on {@linkcode ActiveEffectTypeDataModel.ChangeSchema}
   * as part of the `system.changes` ArrayField; this alias keeps `ActiveEffect.ChangeSchema`
   * available for callers that referenced the prior root-level schema.
   */
  interface ChangeSchema extends ActiveEffectTypeDataModel.ChangeSchema {}

  /**
   * The schema for the `start` SchemaField. Captures the combat/turn/round/time information at
   * which the effect was first applied. The wrapping field is `nullable: true`.
   */
  interface StartSchema extends fields.DataSchema {
    /**
     * The `_id` of the {@linkcode Combat} that was active when this Effect first started.
     * @defaultValue `null`
     */
    combat: fields.ForeignDocumentField<typeof BaseCombat>;

    /**
     * The `_id` of the Combatant whose turn was active when the Effect first started.
     * @defaultValue `null`
     */
    combatant: fields.ForeignDocumentField<typeof BaseCombatant, { idOnly: true }>;

    /**
     * The Combatant's initiative roll at the time the Effect first started.
     * @defaultValue `null`
     */
    initiative: fields.NumberField<{ required: true }>;

    /**
     * The round of the Combat when the Effect first started.
     * @defaultValue `null`
     */
    round: fields.NumberField<{ required: true; integer: true; min: 0 }>;

    /**
     * The turn of the Combat when the Effect first started.
     * @defaultValue `null`
     */
    turn: fields.NumberField<{ required: true; integer: true; min: 0 }>;

    /**
     * The world time at which the Effect first started.
     * @defaultValue `0`
     */
    time: fields.NumberField<{ required: true; nullable: false; integer: true }>;
  }

  /**
   * Initialized form of the `start` data. May be `null` for effects not created on an embedded Actor.
   */
  interface StartData extends fields.SchemaField.InitializedData<StartSchema> {}

  /**
   * Schema for the `duration` SchemaField.
   * @remarks Legacy field names (`seconds`, `rounds`, `turns`, `startTime`, `startRound`,
   * `startTurn`, `combat`, `type`, `duration`) remain readable on the initialized object via
   * shim getters that emit compatibility warnings; see {@linkcode Duration} and {@linkcode DurationData}.
   */
  interface DurationSchema extends fields.DataSchema {
    /**
     * The amount of time the effect lasts, expressed in {@linkcode units}.
     * @defaultValue `null`
     */
    value: fields.NumberField<{ required: true; nullable: true; integer: true; min: 0 }>;

    /**
     * The unit in which {@linkcode value} is measured.
     * @defaultValue `"seconds"`
     */
    units: fields.StringField<
      { required: true; initial: "seconds" },
      CONST.ACTIVE_EFFECT_DURATION_UNITS | null | undefined,
      CONST.ACTIVE_EFFECT_DURATION_UNITS,
      CONST.ACTIVE_EFFECT_DURATION_UNITS
    >;

    /**
     * The event that triggers expiry of this effect (`"turnStart"`, `"turnEnd"`,
     * `"roundStart"`, `"roundEnd"`, `"combatStart"`, `"combatEnd"`, `"updateWorldTime"`,
     * or a custom value registered via {@linkcode CONFIG.ActiveEffect.expiryEvents}).
     * @defaultValue `"turnStart"` when `duration.value` is a number; otherwise `null`.
     */
    expiry: fields.StringField<{ required: true; blank: false; nullable: true }>;

    /**
     * Has the effect already expired? Tracked separately from the time/turn calculation
     * so that effects can be flagged as expired without immediately being deleted.
     * @defaultValue `false`
     */
    expired: fields.BooleanField;
  }

  /**
   * Initialized form of the duration data. See {@linkcode Duration} for the prepared/derived form
   * (which adds `seconds`, `remaining`, `secondsRemaining`, `label`, and `_worldTime`).
   *
   * @remarks Compatibility field aliases are readable via runtime shims that emit a compatibility
   * warning. They are typed here as optional to match runtime behavior.
   */
  interface DurationData extends fields.SchemaField.InitializedData<DurationSchema> {
    /**
     * @deprecated "You are accessing ActiveEffect#duration#seconds. Duration data now has value and units fields." (since v14, until v16)
     * @remarks Replaced by `duration.value` + `duration.units`.
     */
    seconds?: number | null;

    /**
     * @deprecated "You are accessing ActiveEffect#duration#rounds. Duration data now has value and units fields." (since v14, until v16)
     * @remarks Replaced by `duration.value` + `duration.units`.
     */
    rounds?: number | null;

    /**
     * @deprecated "You are accessing ActiveEffect#duration#turns. Duration data now has value and units fields." (since v14, until v16)
     * @remarks Replaced by `duration.value` + `duration.units`.
     */
    turns?: number | null;

    /**
     * @deprecated "You are accessing ActiveEffect#duration#startTime. Duration data now has value and units fields." (since v14, until v16)
     * @remarks Replaced by `start.time`.
     */
    startTime?: number | null;

    /**
     * @deprecated "You are accessing ActiveEffect#duration#startRound. Duration data now has value and units fields." (since v14, until v16)
     * @remarks Replaced by `start.round`.
     */
    startRound?: number | null;

    /**
     * @deprecated "You are accessing ActiveEffect#duration#startTurn. Duration data now has value and units fields." (since v14, until v16)
     * @remarks Replaced by `start.turn`.
     */
    startTurn?: number | null;

    /**
     * @deprecated "You are accessing ActiveEffect#duration#combat. Duration data now has value and units fields." (since v14, until v16)
     * @remarks Replaced by `start.combat`.
     */
    combat?: BaseCombat | null;
  }

  namespace Database {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `ActiveEffect` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<ActiveEffect.Parent> {}

    /**
     * The interface for passing to {@linkcode ActiveEffect.get}.
     * @see {@linkcode Document.Database.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `ActiveEffect` documents.
     * @see {@linkcode Document.Database.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `ActiveEffect` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ActiveEffect.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<ActiveEffect.CreateInput, ActiveEffect.Parent, Temporary> {
      /**
       * @remarks If passed as explicit `false`, the {@linkcode ActiveEffect._displayScrollingStatus | ActiveEffect#_displayScrollingStatus}
       * call in {@linkcode ActiveEffect._onCreate | ActiveEffect#_onCreate} is prevented.
       */
      animate?: boolean;

      /**
       * @remarks This property is not intended to be passed by user code, this is a signal to various parts of the database code that this
       * operation is restoring some or all of the data on a {@link TokenDocument.actor | synthetic token actor} to match its
       * {@link TokenDocument.baseActor | base actor}, moderated by its {@linkcode ActorDelta}.
       *
       * It can appear in the `CreateOperation`s and `UpdateOperation`s of any documents with an associated
       * {@linkcode fields.EmbeddedCollectionDeltaField} in the {@linkcode ActorDelta.Schema}, via
       * {@linkcode foundry.abstract.EmbeddedCollectionDelta.restoreDocuments | EmbeddedCollectionDelta#restoreDocuments}.
       */
      restoreDelta?: boolean;
    }

    /**
     * The interface for passing to {@linkcode ActiveEffect.create} or {@linkcode ActiveEffect.createDocuments}.
     * @see {@linkcode Document.Database.CreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `ActiveEffect` documents. (see {@linkcode ActiveEffect.Parent})
     * @see {@linkcode Document.Database.CreateEmbeddedOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateEmbeddedOperation extends Document.Database.CreateEmbeddedOperation<CreateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `ActiveEffect` documents.
     * @see {@linkcode Document.Database.BackendCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database.BackendCreateOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preCreate | ActiveEffect#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateActiveEffect` hook}.
     * @see {@linkcode Document.Database.PreCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database
      .PreCreateOptions<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preCreateOperation}.
     * @see {@linkcode Document.Database.PreCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database
      .PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode ActiveEffect._onCreateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database.OnCreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onCreate | ActiveEffect#_onCreate} and
     * {@link Hooks.CreateDocument | the `createActiveEffect` hook}.
     * @see {@linkcode Document.Database.OnCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOptions extends Document.Database.OnCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onCreateOperation} and `ActiveEffect`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOperation extends Document.Database.OnCreateOperation<CreateOperation> {}

    /* ***********************************************
     *              UPDATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.UpdateOperation | DatabaseUpdateOperation}
     * interface for `ActiveEffect` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ActiveEffect.update | ActiveEffect#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<ActiveEffect.UpdateInput, ActiveEffect.Parent> {
      /**
       * @remarks If passed as explicit `false`, the {@linkcode ActiveEffect._displayScrollingStatus | ActiveEffect#_displayScrollingStatus}
       * call in {@linkcode ActiveEffect._onUpdate | ActiveEffect#_onUpdate} is prevented.
       */
      animate?: boolean;

      /**
       * @remarks This property is not intended to be passed by user code, this is a signal to various parts of the database code that this
       * operation is restoring some or all of the data on a {@link TokenDocument.actor | synthetic token actor} to match its
       * {@link TokenDocument.baseActor | base actor}, moderated by its {@linkcode ActorDelta}.
       *
       * It can appear in the `CreateOperation`s and `UpdateOperation`s of any documents with an associated
       * {@linkcode fields.EmbeddedCollectionDeltaField} in the {@linkcode ActorDelta.Schema}, via
       * {@linkcode foundry.abstract.EmbeddedCollectionDelta.restoreDocuments | EmbeddedCollectionDelta#restoreDocuments}.
       */
      restoreDelta?: boolean;
    }

    /**
     * The interface for passing to {@linkcode ActiveEffect.update | ActiveEffect#update}.
     * @see {@linkcode Document.Database.UpdateOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateOneDocumentOperation extends Document.Database.UpdateOneDocumentOperation<UpdateOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `ActiveEffect` documents (see {@linkcode ActiveEffect.Parent}). This interface is just an alias
     * for {@linkcode UpdateOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateEmbeddedOperation extends UpdateOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode ActiveEffect.updateDocuments}.
     * @see {@linkcode Document.Database.UpdateManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateManyDocumentsOperation extends Document.Database.UpdateManyDocumentsOperation<UpdateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `ActiveEffect` documents.
     * @see {@linkcode Document.Database.BackendUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendUpdateOperation extends Document.Database.BackendUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preUpdate | ActiveEffect#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateActiveEffect` hook}.
     * @see {@linkcode Document.Database.PreUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preUpdateOperation}.
     * @see {@linkcode Document.Database.PreUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOperation extends Document.Database.PreUpdateOperation<UpdateOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode ActiveEffect._onUpdateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database.OnUpdateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateDocumentsOperation extends Document.Database.OnUpdateDocumentsOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onUpdate | ActiveEffect#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateActiveEffect` hook}.
     * @see {@linkcode Document.Database.OnUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOptions extends Document.Database.OnUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onUpdateOperation} and `ActiveEffect`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOperation extends Document.Database.OnUpdateOperation<UpdateOperation> {}

    /* ***********************************************
     *              DELETE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.DeleteOperation | DatabaseDeleteOperation}
     * interface for `ActiveEffect` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ActiveEffect.delete | ActiveEffect#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<ActiveEffect.Parent> {
      /**
       * @remarks If passed as explicit `false`, the {@linkcode ActiveEffect._displayScrollingStatus | ActiveEffect#_displayScrollingStatus}
       * call in {@linkcode ActiveEffect._onDelete | ActiveEffect#_onDelete} is prevented.
       */
      animate?: boolean;
    }

    /**
     * The interface for passing to {@linkcode ActiveEffect.delete | ActiveEffect#delete}.
     * @see {@linkcode Document.Database.DeleteOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteOneDocumentOperation extends Document.Database.DeleteOneDocumentOperation<DeleteOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `ActiveEffect` documents (see {@linkcode ActiveEffect.Parent}). This interface is just an alias
     * for {@linkcode DeleteOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteEmbeddedOperation extends DeleteOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode ActiveEffect.deleteDocuments}.
     * @see {@linkcode Document.Database.DeleteManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteManyDocumentsOperation extends Document.Database.DeleteManyDocumentsOperation<DeleteOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `ActiveEffect` documents.
     * @see {@linkcode Document.Database.BackendDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendDeleteOperation extends Document.Database.BackendDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preDelete | ActiveEffect#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteActiveEffect` hook}.
     * @see {@linkcode Document.Database.PreDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOptions extends Document.Database.PreDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._preDeleteOperation}.
     * @see {@linkcode Document.Database.PreDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOperation extends Document.Database.PreDeleteOperation<DeleteOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode ActiveEffect._onDeleteDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database.OnDeleteDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteDocumentsOperation extends Document.Database.OnDeleteDocumentsOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onDelete | ActiveEffect#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteActiveEffect` hook}.
     * @see {@linkcode Document.Database.OnDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOptions extends Document.Database.OnDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActiveEffect._onDeleteOperation} and `ActiveEffect`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOperation extends Document.Database.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap<Temporary extends boolean | undefined = boolean | undefined> {
        GetDocumentsOperation: ActiveEffect.Database.GetDocumentsOperation;
        BackendGetOperation: ActiveEffect.Database.BackendGetOperation;
        GetOperation: ActiveEffect.Database.GetOperation;

        CreateDocumentsOperation: ActiveEffect.Database.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: ActiveEffect.Database.CreateEmbeddedOperation;
        BackendCreateOperation: ActiveEffect.Database.BackendCreateOperation<Temporary>;
        CreateOperation: ActiveEffect.Database.CreateOperation<Temporary>;
        PreCreateOptions: ActiveEffect.Database.PreCreateOptions<Temporary>;
        PreCreateOperation: ActiveEffect.Database.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: ActiveEffect.Database.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: ActiveEffect.Database.OnCreateOptions;
        OnCreateOperation: ActiveEffect.Database.OnCreateOperation;

        UpdateOneDocumentOperation: ActiveEffect.Database.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: ActiveEffect.Database.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: ActiveEffect.Database.UpdateManyDocumentsOperation;
        BackendUpdateOperation: ActiveEffect.Database.BackendUpdateOperation;
        UpdateOperation: ActiveEffect.Database.UpdateOperation;
        PreUpdateOptions: ActiveEffect.Database.PreUpdateOptions;
        PreUpdateOperation: ActiveEffect.Database.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: ActiveEffect.Database.OnUpdateDocumentsOperation;
        OnUpdateOptions: ActiveEffect.Database.OnUpdateOptions;
        OnUpdateOperation: ActiveEffect.Database.OnUpdateOperation;

        DeleteOneDocumentOperation: ActiveEffect.Database.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: ActiveEffect.Database.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: ActiveEffect.Database.DeleteManyDocumentsOperation;
        BackendDeleteOperation: ActiveEffect.Database.BackendDeleteOperation;
        DeleteOperation: ActiveEffect.Database.DeleteOperation;
        PreDeleteOptions: ActiveEffect.Database.PreDeleteOptions;
        PreDeleteOperation: ActiveEffect.Database.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: ActiveEffect.Database.OnDeleteDocumentsOperation;
        OnDeleteOptions: ActiveEffect.Database.OnDeleteOptions;
        OnDeleteOperation: ActiveEffect.Database.OnDeleteOperation;
      }
    }

    /* ***********************************************
     *             DocsV2 DEPRECATIONS               *
     *************************************************/

    /** @deprecated Use {@linkcode GetOperation} instead. This type will be removed in v14.  */
    type Get = GetOperation;

    /** @deprecated Use {@linkcode GetDocumentsOperation} instead. This type will be removed in v14.  */
    type GetOptions = GetDocumentsOperation;

    /** @deprecated Use {@linkcode CreateOperation} instead. This type will be removed in v14.  */
    type Create<Temporary extends boolean | undefined> = CreateOperation<Temporary>;

    /** @deprecated Use {@linkcode UpdateOperation} instead. This type will be removed in v14.  */
    type Update = UpdateOperation;

    /** @deprecated Use {@linkcode DeleteOperation} instead. This type will be removed in v14.  */
    type Delete = DeleteOperation;

    // CreateDocumentsOperation didn't change purpose or name

    /** @deprecated Use {@linkcode UpdateManyDocumentsOperation} instead. This type will be removed in v14 */
    type UpdateDocumentsOperation = UpdateManyDocumentsOperation;

    /** @deprecated Use {@linkcode DeleteManyDocumentsOperation} instead. This type will be removed in v14 */
    type DeleteDocumentsOperation = DeleteManyDocumentsOperation;

    // PreCreateOptions didn't change purpose or name

    // OnCreateOptions didn't change purpose or name

    // PreCreateOperation didn't change purpose or name

    // OnCreateOperation didn't change purpose or name

    // PreUpdateOptions didn't change purpose or name

    // OnUpdateOptions didn't change purpose or name

    // PreUpdateOperation didn't change purpose or name

    // OnUpdateOperation didn't change purpose or name

    // PreDeleteOptions didn't change purpose or name

    // OnDeleteOptions didn't change purpose or name

    // PreDeleteOperation didn't change purpose or name

    // OnDeleteOperation didn't change purpose or name

    /** @deprecated Use {@linkcode OnCreateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnCreateDocumentsContext = OnCreateDocumentsOperation;

    /** @deprecated Use {@linkcode OnUpdateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnUpdateDocumentsContext = OnUpdateDocumentsOperation;

    /** @deprecated Use {@linkcode OnDeleteDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnDeleteDocumentsContext = OnDeleteDocumentsOperation;

    /** @deprecated Use {@linkcode OnDeleteOptions} instead. This type will be removed in v14 */
    type DeleteOptions = OnDeleteOptions;

    /** @deprecated Use {@linkcode OnCreateOptions} instead. This type will be removed in v14 */
    type CreateOptions = OnCreateOptions;

    /** @deprecated Use {@linkcode OnUpdateOptions} instead. This type will be removed in v14 */
    type UpdateOptions = OnUpdateOptions;

    /** @deprecated Use {@linkcode OnDeleteDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type DeleteDocumentsContext = OnDeleteDocumentsOperation;

    /** @deprecated use {@linkcode CreateDocumentsOperation} instead. This type will be removed in v14. */
    type DialogCreateOptions = CreateDocumentsOperation;
  }

  /**
   * If `Temporary` is true then {@linkcode ActiveEffect.Implementation}, otherwise {@linkcode ActiveEffect.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? ActiveEffect.Implementation : ActiveEffect.Stored;

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name>, CoreFlags {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  /**
   * The flags provided by Foundry itself for this document.
   */
  interface CoreFlags {
    core?: { overlay?: boolean };
  }

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode ActiveEffect.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode ActiveEffect.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode ActiveEffect.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode ActiveEffect.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode ActiveEffect.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode ActiveEffect.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode ActiveEffect.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    Config extends ActiveEffect.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<ActiveEffect.TemporaryIf<Temporary>, Config>;

  /**
   * The return type for {@linkcode ActiveEffect.deleteDialog | ActiveEffect#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<Config extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    ActiveEffect.Stored,
    Config
  >;

  /* ***********************************************
   *         ACTIVE-EFFECT-SPECIFIC TYPES          *
   *************************************************/

  /**
   * @deprecated since v14, will be removed in v16
   * @remarks Replaced by {@linkcode CONST.ACTIVE_EFFECT_DURATION_UNITS}.
   */
  type DurationType = "seconds" | "turns" | "none";

  /**
   * Prepared (post-`prepareDerivedData`) form of duration data, as returned by
   * {@linkcode ActiveEffect.updateDuration | ActiveEffect#updateDuration}.
   *
   * @remarks The prepared form adds derived fields (`seconds`, `remaining`, `secondsRemaining`,
   * `label`) plus internal flags (`_worldTime`, `_combatTime`). Compatibility aliases (`type`,
   * `duration`) are installed at the same time via runtime getters that emit a
   * compatibility warning when accessed.
   */
  interface Duration extends DurationData {
    /** The derived total duration of the effect in seconds (or `Infinity` for indefinite effects). */
    seconds: number;

    /** The remaining effect duration in the effect's own {@linkcode DurationSchema.units | units}. */
    remaining: number;

    /** The remaining effect duration in seconds (when computable). */
    secondsRemaining?: number;

    /** A formatted string label that represents the remaining duration. */
    label: string;

    /** Internal flag used to determine when to recompute time-based duration. */
    _worldTime?: number;

    /** Internal flag used to determine when to recompute combat-based duration. */
    _combatTime?: number;

    /**
     * @deprecated "You are accessing ActiveEffectDuration#type, which is now at ActiveEffectDuration#units." (since v14, until v16)
     * @remarks Replaced by {@linkcode DurationSchema.units | units}. The runtime shim returns
     * `units` when `value` is a number, otherwise `"none"`.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type?: DurationType;

    /**
     * @deprecated "You are accessing ActiveEffectDuration#duration, which is now at ActiveEffectDuration#seconds." (since v14, until v16)
     * @remarks Replaced by {@linkcode Duration.seconds | seconds}. The runtime shim approximates
     * remaining duration in seconds from `start.time` and `seconds`.
     */
    duration?: number | null;
  }

  /**
   * Return type of {@linkcode ActiveEffect._prepareDuration | ActiveEffect#_prepareDuration}; the
   * partially-populated prepared duration before the final shim getters are installed.
   */
  interface PrepareDurationReturn extends RequiredProps<IntentionalPartial<Duration>, "units"> {}

  /**
   * Initialized form of the `start` SchemaField, returned by {@linkcode ActiveEffect.getEffectStart}.
   * Aliased to {@linkcode StartData} for callers that prefer the Foundry-side typedef name.
   */
  interface EffectStartData extends StartData {}

  /**
   * @deprecated since v14, will be removed in v16
   * @remarks Replaced by {@linkcode EffectStartData}, available via {@linkcode ActiveEffect.getEffectStart}.
   */
  interface InitialDurationData {
    /** @defaultValue `game.time.worldTime` */
    startTime: number;

    /** @remarks Only exists `if (game.combat)` */
    startRound?: number;

    /** @remarks Only exists `if (game.combat)` */
    startTurn?: number;
  }

  /**
   * @deprecated since v14, will be removed in v16
   * @remarks Replaced by `{ start: EffectStartData }` returned by
   * {@linkcode ActiveEffect.getEffectStart}.
   */
  interface GetInitialDurationReturn {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    duration: InitialDurationData;
  }

  /**
   * Initialized form of a single change applied by an ActiveEffect.
   *
   * @remarks The numeric `mode` is still readable on each change object via a deprecated getter
   * that maps it to the string `type` (`0` → `"custom"`, `1` → `"multiply"`, `2` → `"add"`,
   * `3` → `"downgrade"`, `4` → `"upgrade"`, `5` → `"override"`). Each phase is its own priority
   * group; application of a change in an earlier phase occurs before changes in a later phase
   * regardless of priority. The `effect` back-reference is populated transiently by
   * {@linkcode ActiveEffect.prepareBaseData | ActiveEffect#prepareBaseData} and is not part of
   * persisted source data.
   */
  interface ChangeData {
    /**
     * The attribute path in the Actor or Item data which the change modifies.
     */
    key: string;

    /**
     * The application phase under which this change is applied.
     * @defaultValue `"initial"`
     */
    phase: string;

    /**
     * The modification type of this change. Validated to be a dot-delimited alphanumeric sequence
     * or `"custom.{number}"`. Common core types include `"add"`, `"subtract"`, `"multiply"`,
     * `"override"`, `"upgrade"`, `"downgrade"`, and `"custom"`.
     * @defaultValue `"add"`
     */
    type: string;

    /**
     * The value of the change. This is modeled as an `AnyField`, so values may be any serializable
     * structure.
     * @defaultValue `""`
     */
    value: unknown;

    /**
     * The priority level with which this change is applied within its `phase`. A `null` value is
     * initialized to its type's default priority during {@linkcode ActiveEffect.prepareBaseData}.
     * @defaultValue `null`
     */
    priority: number | null | undefined;

    /**
     * The owning ActiveEffect, assigned during `prepareBaseData`. Not present on raw source.
     * @internal
     */
    effect?: ActiveEffect.Implementation;

    /**
     * @deprecated "You are accessing the numeric #mode of an ActiveEffect change. Use the string #type instead." (since v14, until v16)
     * @remarks Replaced by {@linkcode ChangeData.type}. The runtime shim maps numeric modes
     * (`0`–`5`) to string types.
     */
    mode?: CONST.ACTIVE_EFFECT_MODES;
  }

  type ApplyFieldReturn<Field extends fields.DataField.Any | null | undefined> = Field extends fields.DataField.Any
    ? fields.DataField.InitializedTypeFor<Field>
    : unknown;

  /**
   * Configuration for a single change application phase. Resolved entries appear in
   * {@linkcode ActiveEffect.CHANGE_PHASES}.
   */
  interface ChangePhaseConfig {
    /** Localization key for the phase's display name. */
    label: string;

    /** Localization key for the phase's tooltip / hint text. */
    hint: string;
  }

  /**
   * Configuration for a single change type, as resolved by {@linkcode ActiveEffect.CHANGE_TYPES}.
   * Custom types may be added via {@linkcode CONFIG.ActiveEffect.changeTypes}.
   */
  interface ChangeTypeConfig {
    /** Display label or localization key for the change type. */
    label: string;

    /** Default priority assigned when a change of this type omits `priority`. */
    defaultPriority: number;

    /**
     * Optional custom handler invoked by {@linkcode ActiveEffect.applyChange} instead of the
     * core field-based application pipeline. When provided, the handler is fully responsible for
     * modifying the target document.
     */
    handler: ChangeTypeHandler | null;

    /** Optional custom renderer for the change row in the ActiveEffectConfig sheet. */
    render: ChangeTypeRenderer | null;
  }

  /** Custom handler signature for {@linkcode ChangeTypeConfig.handler}. */
  type ChangeTypeHandler = (
    targetDoc: Document.Any,
    change: ChangeData,
    options: {
      field: fields.DataField.Any | undefined;
      replacementData: Record<string, unknown>;
      modifyTarget: boolean;
    },
  ) => unknown;

  /** Custom renderer signature for {@linkcode ChangeTypeConfig.render}. */
  type ChangeTypeRenderer = (change: ChangeData, options: Record<string, unknown>) => string | HTMLElement;

  /**
   * Options for {@linkcode ActiveEffect.applyChange}.
   */
  interface ApplyChangeOptions {
    /**
     * Data used to resolve `@`-prefixed references in a string value.
     * @defaultValue `{}`
     */
    replacementData?: Record<string, unknown>;

    /**
     * Modify the target Document with the updated value.
     * @defaultValue `true`
     */
    modifyTarget?: boolean;
  }

  /**
   * Options for {@linkcode ActiveEffect.applyChangeField}.
   */
  interface ApplyChangeFieldOptions extends ApplyChangeOptions {
    /**
     * The field to update. If not supplied, it is retrieved from the supplied Document via
     * `targetDoc.getFieldForProperty(change.key)`.
     */
    field?: fields.DataField.Any;
  }

  /**
   * Optional context passed to {@linkcode ActiveEffect.updateDuration | ActiveEffect#updateDuration}
   * and the underlying `_prepareDuration` family. Carries the current combat round and turn when
   * invoked from {@linkcode ActiveEffectRegistry.refresh}.
   */
  interface UpdateDurationContext {
    /** Current combat round (overrides `game.combat.round`). */
    round?: number;

    /** Current combat turn (overrides `game.combat.turn`). */
    turn?: number;
  }

  /**
   * Optional context passed to {@linkcode ActiveEffect.isExpiryEvent | ActiveEffect#isExpiryEvent}.
   */
  interface IsExpiryEventContext {
    /** The Combat associated with the event being evaluated. */
    combat?: Combat.Implementation;
  }

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended. This type will be removed in v14.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode ActiveEffect.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side ActiveEffect document which extends the common BaseActiveEffect model.
 * Each ActiveEffect belongs to the effects collection of its parent Document.
 * Each ActiveEffect contains a ActiveEffectData object which provides its source data.
 *
 * @see {@linkcode ActiveEffectData}          The ActiveEffect data schema
 * @see {@linkcode Actor}                     The Actor document which contains ActiveEffect embedded documents
 * @see {@linkcode Item}                      The Item document which contains ActiveEffect embedded documents
 */
declare class ActiveEffect<out SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends BaseActiveEffect
  .Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `ActiveEffect`
   * @param context - Construction context options
   */
  constructor(data: ActiveEffect.CreateData<SubType>, context?: ActiveEffect.ConstructionContext);

  /**
   * A cached compilation of core and registered application phases, along with their labels.
   * Keys are phase identifiers (e.g. `"initial"`).
   * @remarks Lazily compiled from {@linkcode CONFIG.ActiveEffect.phases | CONFIG.ActiveEffect.phases}
   * and {@linkcode CONST.ACTIVE_EFFECT_CHANGE_PHASES} on first access.
   */
  static get CHANGE_PHASES(): Record<string, ActiveEffect.ChangePhaseConfig>;

  /**
   * A cached compilation of core and registered change types, along with their labels and default
   * priorities. Keys are change-type identifiers (e.g. `"add"`, `"override"`).
   * @remarks Lazily compiled from {@linkcode CONST.ACTIVE_EFFECT_CHANGE_TYPES} and
   * {@linkcode CONFIG.ActiveEffect.changeTypes} on first access.
   */
  static get CHANGE_TYPES(): Record<string, ActiveEffect.ChangeTypeConfig>;

  /**
   * A cached compilation of core and registered expiry events. Keys are event identifiers
   * (e.g. `"turnStart"`); values are localization labels.
   * @remarks Lazily compiled from {@linkcode CONFIG.ActiveEffect.expiryEvents} and
   * {@linkcode CONST.ACTIVE_EFFECT_EXPIRY_EVENTS} on first access.
   */
  static get EXPIRY_EVENTS(): Record<string, string>;

  /**
   * A helper class that accepts registration of ActiveEffects and manages their prepared duration
   * and expiry data.
   * @remarks The reference is frozen at class load via a non-writable, non-configurable
   * `Object.defineProperty` descriptor and may not be reassigned by consumers.
   */
  static readonly registry: ActiveEffectRegistry;

  /**
   * Create an ActiveEffect instance from some status effect ID.
   * Delegates to {@linkcode ActiveEffect._fromStatusEffect} to create the ActiveEffect instance
   * after creating the ActiveEffect data from the status effect data if `CONFIG.statusEffects`.
   * @param statusId - The status effect ID.
   * @param options  - Additional options to pass to the ActiveEffect constructor.
   * @returns The created ActiveEffect instance.
   *
   * @throws An error if there is no status effect in `CONFIG.statusEffects` with the given status ID and if
   * the status has implicit statuses but doesn't have a static _id.
   */
  static fromStatusEffect(
    statusId: string,
    options?: ActiveEffect.ConstructionContext,
  ): Promise<ActiveEffect.Implementation>;

  /**
   * Create an ActiveEffect instance from status effect data.
   * Called by {@linkcode ActiveEffect.fromStatusEffect}.
   * @param statusId   - The status effect ID.
   * @param effectData - The status effect data.
   * @param options    - Additional options to pass to the ActiveEffect constructor.
   * @returns The created ActiveEffect instance.
   *
   * @remarks Core's implementation doesn't use `statusId`, simply returning `new this(effectData, options)`
   */
  protected static _fromStatusEffect(
    statusId: string,
    effectData: ActiveEffect.CreateData,
    options?: ActiveEffect.ConstructionContext,
  ): Promise<ActiveEffect.Implementation>;

  /**
   * The Actor in which this ActiveEffect is embedded, either directly or as a grandchild
   * (when the direct parent is an Item owned by the Actor).
   */
  get actor(): Actor.Implementation | null;

  /**
   * The Item in which this ActiveEffect is embedded.
   */
  get item(): Item.Implementation | null;

  /**
   * Is there some system logic that makes this active effect ineligible for application?
   * @remarks Core's implementation defers to `system.isSuppressed` on a `TypeDataModel`, else `false`. As such all overrides should begin with `if (super.isSuppressed) return true;`
   */
  get isSuppressed(): boolean;

  /**
   * Retrieve the Document that this ActiveEffect targets for modification.
   */
  get target(): Document.Any | null;

  /**
   * Whether the Active Effect currently applying its changes to the target.
   */
  get active(): boolean;

  /**
   *  Does this Active Effect currently modify an Actor?
   */
  get modifiesActor(): boolean;

  /**
   * A thumbnail image path used to represent this document. Returns {@linkcode ActiveEffect.img | img}.
   */
  get thumbnail(): string;

  /**
   * Whether this Active Effect is eligible to be registered with the
   * {@linkcode ActiveEffectRegistry}.
   * @remarks `true` only if the effect is persisted, not in a compendium, embedded, active, has
   * start data, is temporary, and is not already expired.
   */
  get isExpiryTrackable(): boolean;

  /**
   * Wires `change.effect` back-references and defaults `change.priority` from
   * {@linkcode ActiveEffect.CHANGE_TYPES}, plus defaults `duration.value` to `Infinity` and `img`
   * to {@linkcode BaseActiveEffect.DEFAULT_ICON}.
   */
  override prepareBaseData(): void;

  override prepareDerivedData(): void;

  /**
   * Update derived Active Effect duration data.
   * @param context - Contextual information about what led to this call (e.g. the current round
   *                  when invoked from {@linkcode ActiveEffectRegistry.refresh}).
   * @remarks The returned object adds the `seconds`/`remaining`/`secondsRemaining`/`label`
   * derived fields and installs compatibility-warning getters for the deprecated `type`/`duration`
   * properties.
   */
  updateDuration(context?: ActiveEffect.UpdateDurationContext): ActiveEffect.Duration;

  /**
   * Compute derived data related to active effect duration. Dispatches to
   * {@linkcode _prepareTimeBasedDuration} or {@linkcode _prepareCombatBasedDuration} based on
   * `duration.units`.
   * @param duration - Unprepared duration data; defaults to `this.duration`.
   * @param context  - Contextual information indicating what led to this call.
   * @internal
   */
  protected _prepareDuration(
    duration?: ActiveEffect.DurationData,
    context?: ActiveEffect.UpdateDurationContext,
  ): ActiveEffect.PrepareDurationReturn;

  /**
   * Prepare duration data from time-based (`"seconds"`, `"minutes"`, `"hours"`, etc.) source data.
   * @internal
   */
  protected _prepareTimeBasedDuration(
    duration: ActiveEffect.DurationData,
    context?: ActiveEffect.UpdateDurationContext,
  ): ActiveEffect.Duration;

  /**
   * Prepare duration data from combat-based (`"rounds"` or `"turns"`) source data.
   * @internal
   */
  protected _prepareCombatBasedDuration(
    duration: ActiveEffect.DurationData,
    context?: ActiveEffect.UpdateDurationContext,
  ): ActiveEffect.Duration;

  /**
   * Describe whether the ActiveEffect has a temporary duration based on combat turns or rounds.
   */
  get isTemporary(): boolean;

  /**
   * The source name of the Active Effect. The source is retrieved synchronously.
   * Therefore "Unknown" (localized) is returned if the origin points to a document inside a compendium.
   * Returns "None" (localized) if it has no origin, and "Unknown" (localized) if the origin cannot be resolved.
   */
  get sourceName(): string;

  // `toCompendium` is overridden at runtime to clear `origin` and `start` from exported data
  // unless `options.clearState === false`. The override does not change the inherited type
  // signature so no declaration is added here.

  /**
   * Apply this ActiveEffect to a target Document, dispatching through any custom handler
   * registered in {@linkcode ActiveEffect.CHANGE_TYPES} or falling back to
   * {@linkcode applyChangeField} or {@linkcode _applyChangeUnguided}.
   * @param targetDoc - The Document to which this effect should be applied.
   * @param change    - The change data being applied.
   * @param options   - Options affecting the change application.
   * @returns A record of property keys and their updated values.
   */
  static applyChange(
    targetDoc: Actor.Implementation | Item.Implementation | TokenDocument.Implementation,
    change: ActiveEffect.ChangeData,
    options?: ActiveEffect.ApplyChangeOptions,
  ): Record<string, unknown>;

  /**
   * Apply EffectChangeData to a single field within a Document.
   * @param targetDoc - The Document instance.
   * @param change    - The change to apply.
   * @param options   - Additional options. `field` is retrieved from the supplied Document via
   *                    `targetDoc.getFieldForProperty(change.key)` if not provided.
   * @returns The updated value, or `undefined` if the field-level apply returned `undefined`.
   */
  static applyChangeField(
    targetDoc: Actor.Implementation | Item.Implementation | TokenDocument.Implementation,
    change: ActiveEffect.ChangeData,
    options?: ActiveEffect.ApplyChangeFieldOptions,
  ): unknown;

  /**
   * Apply this ActiveEffect to a provided target using a heuristic to infer the value types based
   * on the current value and/or the default value in the system's template.
   * @param targetDoc - The Document or DataModel to which this effect should be applied.
   * @param change    - The change data being applied.
   * @param changes   - The aggregate update paths and their updated values.
   * @param options   - Additional options.
   */
  protected static _applyChangeUnguided(
    targetDoc: Actor.Implementation | Item.Implementation | TokenDocument.Implementation | DataModel.Any,
    change: ActiveEffect.ChangeData,
    changes: AnyMutableObject,
    options?: ActiveEffect.ApplyChangeOptions,
  ): void;

  /**
   * Recursively replace data references in a string change value. Defers to
   * {@linkcode foundry.dice.Roll.defaultImplementation.replaceFormulaData | Roll.defaultImplementation.replaceFormulaData}.
   * @param raw  - The raw value containing `@`-references.
   * @param data - An object providing replacements.
   * @returns The string with all data references resolved, or `null` if replacement failed.
   */
  protected static _replaceDataRefs(raw: string, data: Record<string, unknown>): string | null;

  /**
   * Apply an ActiveEffect that uses an `"add"` change type.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   * @remarks Core's implementation does not use `targetDoc`.
   */
  protected static _applyChangeAdd(
    targetDoc: Actor.Implementation | Item.Implementation | TokenDocument.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses a `"subtract"` change type.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   * @remarks Core's implementation does not use `targetDoc`.
   */
  protected static _applyChangeSubtract(
    targetDoc: Actor.Implementation | Item.Implementation | TokenDocument.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses a `"multiply"` change type. Changes which `"multiply"` must
   * be numeric to allow for multiplication.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   * @remarks Core's implementation does not use `targetDoc`.
   */
  protected static _applyChangeMultiply(
    targetDoc: Actor.Implementation | Item.Implementation | TokenDocument.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses an `"override"` change type. Numeric data is overridden by
   * numbers, while other data types are overridden by any value.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   * @remarks Core's implementation does not use `targetDoc` or `current`.
   */
  protected static _applyChangeOverride(
    targetDoc: Actor.Implementation | Item.Implementation | TokenDocument.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses an `"upgrade"` or `"downgrade"` change type. Changes which
   * `"upgrade"` or `"downgrade"` must be numeric to allow for comparison.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   * @remarks Core's implementation does not use `targetDoc`.
   */
  protected static _applyChangeUpgrade(
    targetDoc: Actor.Implementation | Item.Implementation | TokenDocument.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses a `"custom"` change type. Calls the `applyActiveEffect` hook.
   * @param targetDoc - The Document to which this effect should be applied
   * @param change    - The change data being applied
   * @param current   - The current value being modified
   * @param delta     - The parsed value of the change object
   * @param changes   - An object which accumulates changes to be applied
   */
  protected static _applyChangeCustom(
    targetDoc: Actor.Implementation | Item.Implementation | TokenDocument.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Determine whether the ActiveEffect's expiry event was reached. This check is independent of
   * whether the duration was also reached.
   * @param event   - The event that triggered this check.
   * @param context - Contextual information for use in the determination.
   */
  isExpiryEvent(event: string, context?: ActiveEffect.IsExpiryEventContext): boolean;

  /**
   * Retrieve the initial start data for a newly-created ActiveEffect, based on the supplied
   * Combat (defaulting to `game.combat`).
   */
  static getEffectStart(combat?: Combat.Implementation | null): ActiveEffect.EffectStartData;

  /**
   * Apply ActiveEffect.EffectChangeData to a field within a DataModel.
   * @param model  - The model instance.
   * @param change - The change to apply.
   * @param field  - The field. If not supplied, it will be retrieved from the supplied model.
   * @returns The updated value.
   *
   * @remarks `field` default provided by `??= model.schema.getField(change.key)`
   * @deprecated "You are accessing ActiveEffect.applyField, which has been moved to ActiveEffect.applyChangeField." (since v14, until v16)
   */
  static applyField<Field extends fields.DataField.Any | null | undefined = undefined>(
    model: DataModel.Any,
    change: ActiveEffect.ChangeData,
    field?: Field,
  ): ActiveEffect.ApplyFieldReturn<Field>;

  /**
   * Apply this ActiveEffect to a provided Actor.
   * @param actor  - The Actor to whom this effect should be applied
   * @param change - The change data being applied
   * @returns An object of property paths and their updated values.
   * @deprecated "You are accessing ActiveEffect#apply, which has been moved to ActiveEffect.applyChange" (since v14, until v16)
   */
  apply(actor: Actor.Implementation, change: ActiveEffect.ChangeData): AnyMutableObject;

  /**
   * Apply this ActiveEffect to a provided Actor using a heuristic to infer the value types based on the current value
   * and/or the default value in the template.json.
   * @param actor   - The Actor to whom this effect should be applied.
   * @param change  - The change data being applied.
   * @param changes - The aggregate update paths and their updated values.
   * @deprecated "You are accessing ActiveEffect#_applyLegacy, which has been moved to ActiveEffect._applyChangeUnguided" (since v14, until v16)
   */
  protected _applyLegacy(actor: Actor.Implementation, change: ActiveEffect.ChangeData, changes: AnyMutableObject): void;

  /**
   * Apply an ActiveEffect that uses an ADD application mode.
   * @deprecated "You are accessing ActiveEffect#_applyAdd, which has been moved to ActiveEffect._applyChangeAdd" (since v14, until v16)
   */
  protected _applyAdd(
    actor: Actor.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses a MULTIPLY application mode.
   * @deprecated "You are accessing ActiveEffect#_applyMultiply, which has been moved to ActiveEffect._applyChangeMultiply" (since v14, until v16)
   */
  protected _applyMultiply(
    actor: Actor.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses an OVERRIDE application mode.
   * @deprecated "You are accessing ActiveEffect#_applyOverride, which has been moved to ActiveEffect._applyChangeOverride" (since v14, until v16)
   */
  protected _applyOverride(
    actor: Actor.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses an UPGRADE or DOWNGRADE application mode.
   * @deprecated "You are accessing ActiveEffect#_applyUpgrade, which has been moved to ActiveEffect._applyChangeUpgrade" (since v14, until v16)
   */
  protected _applyUpgrade(
    actor: Actor.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Apply an ActiveEffect that uses a CUSTOM application mode.
   * @deprecated "You are accessing ActiveEffect#_applyCustom, which has been moved to ActiveEffect._applyChangeCustom" (since v14, until v16)
   */
  protected _applyCustom(
    actor: Actor.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Retrieve the initial duration configuration.
   * @deprecated "You are accessing ActiveEffect.getInitialDuration, which has been moved to ActiveEffect.getEffectStart." (since v14, until v16)
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static getInitialDuration(): ActiveEffect.GetInitialDurationReturn;

  // _preCreate, _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes from BaseActiveEffect.

  /**
   * Display changes to active effects as scrolling Token status text.
   * @param enabled - Is the active effect currently enabled?
   */
  protected _displayScrollingStatus(enabled: boolean): void;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // ClientDocument overrides

  // Descendant Document operations have been left out because ActiveEffect does not have any descendant documents.

  // TODO: update to include 'pack' in v14
  // `context` must contain a `parent`, so is required.
  static override defaultName(context: ActiveEffect.DefaultNameContext): string;

  // TODO: update to include 'pack' in v14
  // `createOptions` must contain a `parent`, so is required.
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends ActiveEffect.CreateDialogOptions | undefined = undefined,
  >(
    data: ActiveEffect.CreateDialogData | undefined,
    createOptions: ActiveEffect.Database.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<ActiveEffect.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode ActiveEffect.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends ActiveEffect.CreateDialogOptions | undefined = undefined,
  >(
    data: ActiveEffect.CreateDialogData | undefined,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: ActiveEffect.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<ActiveEffect.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: ActiveEffect.Database.DeleteOneDocumentOperation,
  ): Promise<ActiveEffect.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: ActiveEffect.Database.DeleteOneDocumentOperation,
  ): Promise<ActiveEffect.DeleteDialogReturn<Options>>;

  static override fromDropData(data: ActiveEffect.DropData): Promise<ActiveEffect.Implementation | undefined>;

  static override fromImport(
    source: ActiveEffect.Source,
    context?: Document.FromImportContext<ActiveEffect.Parent>,
  ): Promise<ActiveEffect.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  #ActiveEffect: true;
}

export default ActiveEffect;
