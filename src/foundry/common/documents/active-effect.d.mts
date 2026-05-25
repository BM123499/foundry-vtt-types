import type { AnyMutableObject, MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The ActiveEffect Document.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseActiveEffect<
  out SubType extends BaseActiveEffect.SubType = BaseActiveEffect.SubType,
> extends Document<"ActiveEffect", BaseActiveEffect._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseActiveEffect`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseActiveEffect` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode ActiveEffect.implementation | new ActiveEffect.implementation(...)} instead which will give you
   * a system specific implementation of `ActiveEffect`.
   */
  constructor(data: BaseActiveEffect.CreateData, context?: BaseActiveEffect.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "ActiveEffect",
   *   collection: "effects",
   *   hasTypeData: true,
   *   baseTypeAllowed: true,
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"],
   *   label: "DOCUMENT.ActiveEffect",
   *   labelPlural: "DOCUMENT.ActiveEffects",
   *   schemaVersion: "14.353",
   *   permissions: {
   *     create: BaseActiveEffect.#canCreate, // embedded => parent OWNER; otherwise GM
   *     delete: "OWNER"
   *   }
   * });
   * ```
   */
  static override metadata: BaseActiveEffect.Metadata;

  static override defineSchema(): BaseActiveEffect.Schema;

  /** @defaultValue `["DOCUMENT", "EFFECT"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The default icon used for newly created ActiveEffect documents.
   * @defaultValue `"icons/svg/aura.svg"`
   * @remarks Referenced as `this.implementation.DEFAULT_ICON` in the schema's `img` initial.
   */
  static DEFAULT_ICON: string;

  protected override _preCreate(
    data: BaseActiveEffect.CreateData,
    options: BaseActiveEffect.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  /**
   * @remarks
   * Migrations:
   * - `icon` to `img` (since v12, no specified end)
   * - non-UUID-style `origin` strings to `null` with the original copied to `flags.core.originText` (since v14)
   * - root-level `changes` array to `system.changes` (since v14)
   * - numeric `change.mode` to string `change.type` per `BaseActiveEffect.#MODES_TO_TYPES` (since v14)
   * - string `change.value` JSON-decoded via `BaseActiveEffect.#migrateChangeValue` (since v14)
   * - legacy `duration.{startTime, startRound, startTurn, combat}` to top-level `start.*` (since v14)
   * - legacy `duration.{seconds, turns, rounds}` to `duration.{value, units}` (since v14)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `icon` to `img` (since v12, until v14)
   * - root-level `changes` getter aliasing `system.changes` (since v14, until v16)
   * - numeric `change.mode` shim — getter/setter on each change object that warns and maps to v14's
   *   string `change.type` (since v14, until v16)
   * - `duration.{startTime, startRound, startTurn, combat}` getters delegating to `start.*` (since v14, until v16)
   * - `duration.{seconds, rounds, turns}` getters delegating to `duration.value` when `duration.units`
   *   matches (since v14, until v16)
   */
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * Add shims to the changes array. Installs a numeric `mode` getter/setter on each change object
   * that delegates to the string `type` and emits a compatibility warning.
   * @internal
   */
  static _shimChanges(changes: ActiveEffect.ChangeData[]): void;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  type: SubType;

  /* Document overrides */

  override readonly parentCollection: BaseActiveEffect.ParentCollectionName | null;

  static override get implementation(): ActiveEffect.ImplementationClass;

  static override get baseDocument(): typeof BaseActiveEffect;

  static override get collectionName(): BaseActiveEffect.ParentCollectionName;

  static override get documentName(): BaseActiveEffect.Name;

  static override get TYPES(): BaseActiveEffect.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseActiveEffect.Hierarchy;

  override system: BaseActiveEffect.SystemOfType<SubType>;

  override parent: BaseActiveEffect.Parent;

  override " fvtt_types_internal_document_parent": BaseActiveEffect.Parent;

  static override canUserCreate(user: User.Implementation): boolean;

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  override canUserModify<Action extends Document.Database.OperationAction>(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<"ActiveEffect", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseActiveEffect.CreateInput[],
    operation?: BaseActiveEffect.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseActiveEffect.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseActiveEffect.UpdateInput[],
    operation?: BaseActiveEffect.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<ActiveEffect.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseActiveEffect.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<ActiveEffect.Stored>>;

  static override create<
    Data extends MaybeArray<BaseActiveEffect.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseActiveEffect.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseActiveEffect.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseActiveEffect.UpdateInput,
    operation?: BaseActiveEffect.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseActiveEffect.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  // `ActiveEffect`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseActiveEffect.Database.GetDocumentsOperation): null;

  // `ActiveEffect`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseActiveEffect.Flags.Scope, Key extends BaseActiveEffect.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseActiveEffect.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseActiveEffect.Flags.Scope,
    Key extends BaseActiveEffect.Flags.Key<Scope>,
    Value extends BaseActiveEffect.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseActiveEffect.Flags.Scope, Key extends BaseActiveEffect.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _onCreate(
    data: BaseActiveEffect.CreateData,
    options: BaseActiveEffect.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: ActiveEffect.Implementation[],
    operation: BaseActiveEffect.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: ActiveEffect.Stored[],
    operation: BaseActiveEffect.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseActiveEffect.UpdateData,
    options: BaseActiveEffect.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseActiveEffect.UpdateData,
    options: BaseActiveEffect.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: ActiveEffect.Stored[],
    operation: BaseActiveEffect.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: ActiveEffect.Stored[],
    operation: BaseActiveEffect.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseActiveEffect.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseActiveEffect.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: ActiveEffect.Stored[],
    operation: BaseActiveEffect.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: ActiveEffect.Stored[],
    operation: BaseActiveEffect.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `ActiveEffect._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode ActiveEffect._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: ActiveEffect.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseActiveEffect.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `ActiveEffect._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode ActiveEffect._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: ActiveEffect.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseActiveEffect.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `ActiveEffect._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode ActiveEffect._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: ActiveEffect.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseActiveEffect.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseActiveEffect.Schema>;

  static override get schema(): SchemaField<BaseActiveEffect.Schema>;

  static override validateJoint(data: BaseActiveEffect.Source): void;

  static override fromSource(
    source: BaseActiveEffect.CreateData,
    context?: DataModel.FromSourceOptions,
  ): ActiveEffect.Implementation;

  static override fromJSON(json: string): ActiveEffect.Implementation;
}

export default BaseActiveEffect;

declare namespace BaseActiveEffect {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = ActiveEffect.Name;
  export import ConstructionContext = ActiveEffect.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = ActiveEffect.ConstructorArgs;
  export import Hierarchy = ActiveEffect.Hierarchy;
  export import Metadata = ActiveEffect.Metadata;
  export import SubType = ActiveEffect.SubType;
  export import ConfiguredSubType = ActiveEffect.ConfiguredSubType;
  export import Known = ActiveEffect.Known;
  export import OfType = ActiveEffect.OfType;
  export import SystemOfType = ActiveEffect.SystemOfType;
  export import Parent = ActiveEffect.Parent;
  export import Descendant = ActiveEffect.Descendant;
  export import DescendantClass = ActiveEffect.DescendantClass;
  export import Embedded = ActiveEffect.Embedded;
  export import ParentCollectionName = ActiveEffect.ParentCollectionName;
  export import CollectionClass = ActiveEffect.CollectionClass;
  export import Collection = ActiveEffect.Collection;
  export import Invalid = ActiveEffect.Invalid;
  export import Source = ActiveEffect.Source;
  export import CreateData = ActiveEffect.CreateData;
  export import CreateInput = ActiveEffect.CreateInput;
  export import CreateReturn = ActiveEffect.CreateReturn;
  export import InitializedData = ActiveEffect.InitializedData;
  export import UpdateData = ActiveEffect.UpdateData;
  export import UpdateInput = ActiveEffect.UpdateInput;
  export import Schema = ActiveEffect.Schema;
  export import Database = ActiveEffect.Database;
  export import TemporaryIf = ActiveEffect.TemporaryIf;
  export import Flags = ActiveEffect.Flags;
  export import CoreFlags = ActiveEffect.CoreFlags;
  export import DurationData = ActiveEffect.DurationData;
  export import Duration = ActiveEffect.Duration;
  export import ChangeData = ActiveEffect.ChangeData;
  export import StartSchema = ActiveEffect.StartSchema;
  export import StartData = ActiveEffect.StartData;
  export import EffectStartData = ActiveEffect.EffectStartData;
  export import ChangePhaseConfig = ActiveEffect.ChangePhaseConfig;
  export import ChangeTypeConfig = ActiveEffect.ChangeTypeConfig;
  export import ChangeTypeHandler = ActiveEffect.ChangeTypeHandler;
  export import ChangeTypeRenderer = ActiveEffect.ChangeTypeRenderer;
  export import ApplyChangeOptions = ActiveEffect.ApplyChangeOptions;
  export import ApplyChangeFieldOptions = ActiveEffect.ApplyChangeFieldOptions;
  export import UpdateDurationContext = ActiveEffect.UpdateDurationContext;
  export import IsExpiryEventContext = ActiveEffect.IsExpiryEventContext;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `ActiveEffect` a name.
    // The expression `ClientDocumentMixin(BaseActiveEffect)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseActiveEffect> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends ActiveEffect.Schema {
    system: any;
  }
}
