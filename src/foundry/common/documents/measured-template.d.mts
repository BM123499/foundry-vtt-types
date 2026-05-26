import type { AnyMutableObject, MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The Document definition for a MeasuredTemplate.
 * Defines the DataSchema and common behaviors for a MeasuredTemplate which are shared between both client and server.
 *
 * @deprecated MeasuredTemplate functionality is absorbed into {@linkcode foundry.documents.Region}; use Region
 * documents with appropriate Region behaviors instead. (since v14, until v16)
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
// eslint-disable-next-line @typescript-eslint/no-deprecated
declare abstract class BaseMeasuredTemplate extends Document<"MeasuredTemplate", BaseMeasuredTemplate.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseMeasuredTemplate`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseMeasuredTemplate` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode MeasuredTemplateDocument.implementation | new MeasuredTemplateDocument.implementation(...)} instead which will give you
   * a system specific implementation of `MeasuredTemplateDocument`.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  constructor(data?: BaseMeasuredTemplate.CreateData, context?: BaseMeasuredTemplate.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "MeasuredTemplate",
   *   collection: "templates",
   *   label: "DOCUMENT.MeasuredTemplate",
   *   labelPlural: "DOCUMENT.MeasuredTemplates",
   *   isEmbedded: true,
   *   permissions: {
   *     create: this.#canCreate,
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override metadata: BaseMeasuredTemplate.Metadata;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override defineSchema(): BaseMeasuredTemplate.Schema;

  /** @defaultValue `["DOCUMENT", "TEMPLATE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * @remarks
   * Migrations:
   * - `user` to `author` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `user` to `author` (since v12, until v14)
   */
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, until 14
   * @remarks "You are accessing `user` which has been migrated to `author`"
   */
  get user(): this["author"];

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override readonly parentCollection: BaseMeasuredTemplate.ParentCollectionName | null;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override get implementation(): MeasuredTemplateDocument.ImplementationClass;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override get baseDocument(): typeof BaseMeasuredTemplate;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override get collectionName(): BaseMeasuredTemplate.ParentCollectionName;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override get documentName(): BaseMeasuredTemplate.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override readonly hierarchy: BaseMeasuredTemplate.Hierarchy;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override parent: BaseMeasuredTemplate.Parent;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override " fvtt_types_internal_document_parent": BaseMeasuredTemplate.Parent;

  static override canUserCreate(user: User.Implementation): boolean;

  // `getUserLevel` omitted from template due to actual override above.

  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  override canUserModify<Action extends Document.Database.OperationAction>(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<"MeasuredTemplate", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    data: BaseMeasuredTemplate.CreateInput[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation?: BaseMeasuredTemplate.Database.CreateDocumentsOperation<Temporary>, // eslint-disable-next-line @typescript-eslint/no-deprecated
  ): Promise<Array<BaseMeasuredTemplate.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    updates: BaseMeasuredTemplate.UpdateInput[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation?: BaseMeasuredTemplate.Database.UpdateManyDocumentsOperation, // eslint-disable-next-line @typescript-eslint/no-deprecated
  ): Promise<Array<MeasuredTemplateDocument.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation?: BaseMeasuredTemplate.Database.DeleteManyDocumentsOperation, // eslint-disable-next-line @typescript-eslint/no-deprecated
  ): Promise<Array<MeasuredTemplateDocument.Stored>>;

  static override create<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    Data extends MaybeArray<BaseMeasuredTemplate.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation?: BaseMeasuredTemplate.Database.CreateDocumentsOperation<Temporary>, // eslint-disable-next-line @typescript-eslint/no-deprecated
  ): Promise<BaseMeasuredTemplate.CreateReturn<Data, Temporary>>;

  override update(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    data: BaseMeasuredTemplate.UpdateInput,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation?: BaseMeasuredTemplate.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override delete(operation?: BaseMeasuredTemplate.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  // `MeasuredTemplateDocument`s are neither world documents nor compendium documents, so this always returns `null`.
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override get(documentId: string, operation?: BaseMeasuredTemplate.Database.GetDocumentsOperation): null;

  // `MeasuredTemplateDocument`s have no embedded collections, so this always returns `null`
  static override getCollectionName(name: string): null;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override getFlag<Scope extends BaseMeasuredTemplate.Flags.Scope, Key extends BaseMeasuredTemplate.Flags.Key<Scope>>(
    scope: Scope,
    key: Key, // eslint-disable-next-line @typescript-eslint/no-deprecated
  ): BaseMeasuredTemplate.Flags.Get<Scope, Key>;

  override setFlag<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    Scope extends BaseMeasuredTemplate.Flags.Scope,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    Key extends BaseMeasuredTemplate.Flags.Key<Scope>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    Value extends BaseMeasuredTemplate.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override unsetFlag<Scope extends BaseMeasuredTemplate.Flags.Scope, Key extends BaseMeasuredTemplate.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    data: BaseMeasuredTemplate.CreateData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    options: BaseMeasuredTemplate.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    data: BaseMeasuredTemplate.CreateData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    options: BaseMeasuredTemplate.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    documents: MeasuredTemplateDocument.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation: BaseMeasuredTemplate.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    documents: MeasuredTemplateDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation: BaseMeasuredTemplate.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    changed: BaseMeasuredTemplate.UpdateData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    options: BaseMeasuredTemplate.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    changed: BaseMeasuredTemplate.UpdateData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    options: BaseMeasuredTemplate.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    documents: MeasuredTemplateDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation: BaseMeasuredTemplate.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    documents: MeasuredTemplateDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation: BaseMeasuredTemplate.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    options: BaseMeasuredTemplate.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  protected override _onDelete(options: BaseMeasuredTemplate.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    documents: MeasuredTemplateDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation: BaseMeasuredTemplate.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    documents: MeasuredTemplateDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    operation: BaseMeasuredTemplate.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `MeasuredTemplateDocument._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode MeasuredTemplateDocument._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    documents: MeasuredTemplateDocument.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseMeasuredTemplate.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `MeasuredTemplateDocument._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode MeasuredTemplateDocument._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    documents: MeasuredTemplateDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseMeasuredTemplate.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `MeasuredTemplateDocument._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode MeasuredTemplateDocument._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    documents: MeasuredTemplateDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseMeasuredTemplate.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  protected static override _schema: SchemaField<BaseMeasuredTemplate.Schema>;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override get schema(): SchemaField<BaseMeasuredTemplate.Schema>;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override validateJoint(data: BaseMeasuredTemplate.Source): void;

  static override fromSource(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    source: BaseMeasuredTemplate.CreateData,
    context?: DataModel.FromSourceOptions, // eslint-disable-next-line @typescript-eslint/no-deprecated
  ): MeasuredTemplateDocument.Implementation;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static override fromJSON(json: string): MeasuredTemplateDocument.Implementation;

  static #BaseMeasuredTemplate: true;
}

// eslint-disable-next-line @typescript-eslint/no-deprecated
export default BaseMeasuredTemplate;

declare namespace BaseMeasuredTemplate {
  // All types really live in the full document and are mirrored here for convenience
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Name = MeasuredTemplateDocument.Name;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructionContext = MeasuredTemplateDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = MeasuredTemplateDocument.ConstructorArgs;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Hierarchy = MeasuredTemplateDocument.Hierarchy;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Metadata = MeasuredTemplateDocument.Metadata;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Parent = MeasuredTemplateDocument.Parent;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Descendant = MeasuredTemplateDocument.Descendant;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import DescendantClass = MeasuredTemplateDocument.DescendantClass;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Embedded = MeasuredTemplateDocument.Embedded;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ParentCollectionName = MeasuredTemplateDocument.ParentCollectionName;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import CollectionClass = MeasuredTemplateDocument.CollectionClass;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Collection = MeasuredTemplateDocument.Collection;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Invalid = MeasuredTemplateDocument.Invalid;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Source = MeasuredTemplateDocument.Source;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import CreateData = MeasuredTemplateDocument.CreateData;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import CreateInput = MeasuredTemplateDocument.CreateInput;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import CreateReturn = MeasuredTemplateDocument.CreateReturn;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import InitializedData = MeasuredTemplateDocument.InitializedData;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import UpdateData = MeasuredTemplateDocument.UpdateData;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import UpdateInput = MeasuredTemplateDocument.UpdateInput;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Schema = MeasuredTemplateDocument.Schema;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Database = MeasuredTemplateDocument.Database;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import TemporaryIf = MeasuredTemplateDocument.TemporaryIf;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Flags = MeasuredTemplateDocument.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `MeasuredTemplateDocument` a name.
    // The expression `CanvasDocumentMixin(BaseMeasuredTemplate)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseMeasuredTemplate> {}
    const CanvasDocument: CanvasDocument;
  }
}
