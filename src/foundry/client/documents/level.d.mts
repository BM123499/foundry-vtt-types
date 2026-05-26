import type { MaybeArray, Merge } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DatabaseBackend, Document } from "#common/abstract/_module.d.mts";
import type { BaseLevel } from "#common/documents/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";
import type CanvasEdges from "#client/canvas/geometry/edges/edges.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDatabaseBackend from "#client/data/client-backend.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDocumentMixin from "#client/documents/abstract/client-document.d.mts";

declare namespace Level {
  /**
   * The document's name.
   */
  type Name = "Level";

  /**
   * The context used to create a `Level`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Level`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Level` document instance configured through
   * {@linkcode CONFIG.Level.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Level` document configured through
   * {@linkcode CONFIG.Level.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Level";
      collection: "levels";
      label: "DOCUMENT.Level";
      labelPlural: "DOCUMENT.Levels";
      isEmbedded: true;
      schemaVersion: "14.359";
    }>
  > {}

  /**
   * A document's parent is something that can contain it.
   * `Level` documents are always embedded in a {@linkcode Scene}.
   */
  type Parent = Scene.Implementation | null;

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
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = never;

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For `Level` this is always `"levels"` (the embedded collection on `Scene`).
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
   * An instance of `Level` that comes from the database but failed validation meaning that
   * its `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Level.Implementation>;

  /**
   * An instance of `Level` that comes from the database.
   */
  type Stored = Document.Internal.Stored<Level.Implementation>;

  /**
   * The data put in {@linkcode Level._source | Level#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Level.create}
   * and {@linkcode Level | new Level(...)}.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode Level.create} and {@linkcode Level.createDocuments} signatures, and
   * {@linkcode Level.Database.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Level.create}, returning (a single | an array of)
   * (temporary | stored) `Level`s.
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput> ? Array<Level.TemporaryIf<Temporary>> : Level.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Level.name | Level#name}.
   *
   * This is data transformed from {@linkcode Level.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Level.update | Level#update}.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Level.update | Level#update} and {@linkcode Level.updateDocuments}
   * signatures, and {@linkcode Level.Database.UpdateOperation} and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Level}. This is the source of truth for how a Level document
   * must be structured.
   */
  interface Schema extends fields.DataSchema {
    /**
     * The _id which uniquely identifies this Level embedded document.
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this Level.
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The elevation range covered by this Level. `bottom`/`top` may be `null` and are then
     * treated as `-Infinity`/`+Infinity` respectively. Validation requires
     * `(bottom ?? -Infinity) <= (top ?? Infinity)`.
     */
    elevation: fields.SchemaField<{
      /** @defaultValue `0` */
      bottom: fields.NumberField<{ required: true; nullable: true; initial: 0 }>;

      /** @defaultValue `20` */
      top: fields.NumberField<{ required: true; nullable: true; initial: 20 }>;
    }>;

    /**
     * Background imagery and color for this Level.
     */
    background: fields.SchemaField<{
      /** @defaultValue `"#999999"` */
      color: fields.ColorField<{ nullable: false; initial: "#999999" }>;

      /** @defaultValue `null` */
      src: fields.FilePathField<{ required: true; categories: ["TEXTURE"]; initial: null; virtual: true }>;

      /** @defaultValue `"#ffffff"` */
      tint: fields.ColorField<{ required: true; nullable: false; initial: "#ffffff" }>;

      /** @defaultValue `0.75` */
      alphaThreshold: fields.AlphaField<{ nullable: false; initial: 0.75 }>;
    }>;

    /**
     * Foreground imagery for this Level.
     */
    foreground: fields.SchemaField<{
      /** @defaultValue `null` */
      src: fields.FilePathField<{ required: true; categories: ["TEXTURE"]; initial: null; virtual: true }>;

      /** @defaultValue `"#ffffff"` */
      tint: fields.ColorField<{ required: true; nullable: false; initial: "#ffffff" }>;

      /** @defaultValue `0.75` */
      alphaThreshold: fields.AlphaField<{ nullable: false; initial: 0.75 }>;
    }>;

    /**
     * Fog of war imagery for this Level.
     */
    fog: fields.SchemaField<{
      /** @defaultValue `null` */
      src: fields.FilePathField<{ required: true; categories: ["TEXTURE"]; initial: null; virtual: true }>;

      /** @defaultValue `"#ffffff"` */
      tint: fields.ColorField<{ required: true; nullable: false; initial: "#ffffff" }>;
    }>;

    /**
     * Texture transform parameters applied to background / foreground / fog imagery.
     */
    textures: fields.SchemaField<{
      /** @defaultValue `0.5` */
      anchorX: fields.NumberField<{ required: true; nullable: false; initial: 0.5 }>;

      /** @defaultValue `0.5` */
      anchorY: fields.NumberField<{ required: true; nullable: false; initial: 0.5 }>;

      /** @defaultValue `0` */
      offsetX: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

      /** @defaultValue `0` */
      offsetY: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

      /**
       * A value in {@linkcode CONST.TEXTURE_DATA_FIT_MODES}.
       * @defaultValue `"fill"`
       */
      fit: fields.StringField<{ required: true; initial: "fill"; choices: CONST.TEXTURE_DATA_FIT_MODES[] }>;

      /** @defaultValue `1` */
      scaleX: fields.NumberField<{ required: true; nullable: false; initial: 1 }>;

      /** @defaultValue `1` */
      scaleY: fields.NumberField<{ required: true; nullable: false; initial: 1 }>;

      /** @defaultValue `0` */
      rotation: fields.AngleField<{ initial: 0 }>;
    }>;

    /**
     * Visibility configuration for this Level. `visibility.levels` references the ids of other
     * Levels which are visible while this Level is the viewed level.
     */
    visibility: fields.SchemaField<{
      /** @defaultValue `[]` */
      levels: fields.SceneLevelsSetField;
    }>;

    /**
     * The numeric sort value which orders this Level relative to other Levels of the same Scene.
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags.
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;
  }

  namespace Database {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation}
     * interface for `Level` documents.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Level.Parent> {}

    /**
     * The interface for passing to {@linkcode Level.get}.
     * @see {@linkcode Document.Database.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Level` documents.
     * @see {@linkcode Document.Database.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<Level.CreateInput, Level.Parent, Temporary> {}

    interface CreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    interface CreateEmbeddedOperation extends Document.Database.CreateEmbeddedOperation<CreateOperation> {}

    interface BackendCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database.BackendCreateOperation<CreateOperation<Temporary>> {}

    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database
      .PreCreateOptions<CreateOperation<Temporary>> {}

    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database
      .PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode Level._onCreateDocuments}. It will be removed in v14 along with
     * the method it is for.
     */
    interface OnCreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    interface OnCreateOptions extends Document.Database.OnCreateOptions<CreateOperation> {}

    interface OnCreateOperation extends Document.Database.OnCreateOperation<CreateOperation> {}

    /* ***********************************************
     *              UPDATE OPERATIONS                *
     *************************************************/

    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Level.UpdateInput, Level.Parent> {}

    interface UpdateOneDocumentOperation extends Document.Database.UpdateOneDocumentOperation<UpdateOperation> {}

    interface UpdateEmbeddedOperation extends UpdateOneDocumentOperation {}

    interface UpdateManyDocumentsOperation extends Document.Database.UpdateManyDocumentsOperation<UpdateOperation> {}

    interface BackendUpdateOperation extends Document.Database.BackendUpdateOperation<UpdateOperation> {}

    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<UpdateOperation> {}

    interface PreUpdateOperation extends Document.Database.PreUpdateOperation<UpdateOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode Level._onUpdateDocuments}. It will be removed in v14 along with
     * the method it is for.
     */
    interface OnUpdateDocumentsOperation extends Document.Database.OnUpdateDocumentsOperation<UpdateOperation> {}

    interface OnUpdateOptions extends Document.Database.OnUpdateOptions<UpdateOperation> {}

    interface OnUpdateOperation extends Document.Database.OnUpdateOperation<UpdateOperation> {}

    /* ***********************************************
     *              DELETE OPERATIONS                *
     *************************************************/

    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Level.Parent> {}

    interface DeleteOneDocumentOperation extends Document.Database.DeleteOneDocumentOperation<DeleteOperation> {}

    interface DeleteEmbeddedOperation extends DeleteOneDocumentOperation {}

    interface DeleteManyDocumentsOperation extends Document.Database.DeleteManyDocumentsOperation<DeleteOperation> {}

    interface BackendDeleteOperation extends Document.Database.BackendDeleteOperation<DeleteOperation> {}

    interface PreDeleteOptions extends Document.Database.PreDeleteOptions<DeleteOperation> {}

    interface PreDeleteOperation extends Document.Database.PreDeleteOperation<DeleteOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode Level._onDeleteDocuments}. It will be removed in v14 along with
     * the method it is for.
     */
    interface OnDeleteDocumentsOperation extends Document.Database.OnDeleteDocumentsOperation<DeleteOperation> {}

    interface OnDeleteOptions extends Document.Database.OnDeleteOptions<DeleteOperation> {}

    interface OnDeleteOperation extends Document.Database.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap<Temporary extends boolean | undefined = boolean | undefined> {
        GetDocumentsOperation: Level.Database.GetDocumentsOperation;
        BackendGetOperation: Level.Database.BackendGetOperation;
        GetOperation: Level.Database.GetOperation;

        CreateDocumentsOperation: Level.Database.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: Level.Database.CreateEmbeddedOperation;
        BackendCreateOperation: Level.Database.BackendCreateOperation<Temporary>;
        CreateOperation: Level.Database.CreateOperation<Temporary>;
        PreCreateOptions: Level.Database.PreCreateOptions<Temporary>;
        PreCreateOperation: Level.Database.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Level.Database.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Level.Database.OnCreateOptions;
        OnCreateOperation: Level.Database.OnCreateOperation;

        UpdateOneDocumentOperation: Level.Database.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: Level.Database.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Level.Database.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Level.Database.BackendUpdateOperation;
        UpdateOperation: Level.Database.UpdateOperation;
        PreUpdateOptions: Level.Database.PreUpdateOptions;
        PreUpdateOperation: Level.Database.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Level.Database.OnUpdateDocumentsOperation;
        OnUpdateOptions: Level.Database.OnUpdateOptions;
        OnUpdateOperation: Level.Database.OnUpdateOperation;

        DeleteOneDocumentOperation: Level.Database.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: Level.Database.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Level.Database.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Level.Database.BackendDeleteOperation;
        DeleteOperation: Level.Database.DeleteOperation;
        PreDeleteOptions: Level.Database.PreDeleteOptions;
        PreDeleteOperation: Level.Database.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Level.Database.OnDeleteDocumentsOperation;
        OnDeleteOptions: Level.Database.OnDeleteOptions;
        OnDeleteOperation: Level.Database.OnDeleteOperation;
      }
    }

    /* ***********************************************
     *             DocsV2 DEPRECATIONS               *
     *************************************************/

    /** @deprecated Use {@linkcode GetOperation} instead. This type will be removed in v14. */
    type Get = GetOperation;

    /** @deprecated Use {@linkcode GetDocumentsOperation} instead. This type will be removed in v14. */
    type GetOptions = GetDocumentsOperation;

    /** @deprecated Use {@linkcode CreateOperation} instead. This type will be removed in v14. */
    type Create<Temporary extends boolean | undefined> = CreateOperation<Temporary>;

    /** @deprecated Use {@linkcode UpdateOperation} instead. This type will be removed in v14. */
    type Update = UpdateOperation;

    /** @deprecated Use {@linkcode DeleteOperation} instead. This type will be removed in v14. */
    type Delete = DeleteOperation;

    /** @deprecated Use {@linkcode UpdateManyDocumentsOperation} instead. This type will be removed in v14. */
    type UpdateDocumentsOperation = UpdateManyDocumentsOperation;

    /** @deprecated Use {@linkcode DeleteManyDocumentsOperation} instead. This type will be removed in v14. */
    type DeleteDocumentsOperation = DeleteManyDocumentsOperation;

    /** @deprecated Use {@linkcode OnCreateDocumentsOperation} instead. This type will be removed in v14. */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnCreateDocumentsContext = OnCreateDocumentsOperation;

    /** @deprecated Use {@linkcode OnUpdateDocumentsOperation} instead. This type will be removed in v14. */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnUpdateDocumentsContext = OnUpdateDocumentsOperation;

    /** @deprecated Use {@linkcode OnDeleteDocumentsOperation} instead. This type will be removed in v14. */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type DeleteDocumentsContext = OnDeleteDocumentsOperation;

    /** @deprecated Use {@linkcode OnDeleteOptions} instead. This type will be removed in v14. */
    type DeleteOptions = OnDeleteOptions;

    /** @deprecated Use {@linkcode OnCreateOptions} instead. This type will be removed in v14. */
    type CreateOptions = OnCreateOptions;

    /** @deprecated Use {@linkcode OnUpdateOptions} instead. This type will be removed in v14. */
    type UpdateOptions = OnUpdateOptions;

    /** @deprecated use {@linkcode CreateDocumentsOperation} instead. This type will be removed in v14. */
    type DialogCreateOptions = CreateDocumentsOperation;
  }

  /**
   * If `Temporary` is true then {@linkcode Level.Implementation}, otherwise {@linkcode Level.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Level.Implementation : Level.Stored;

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode Level.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Level.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Level.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Level.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Level.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Level.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    Config extends Level.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Level.TemporaryIf<Temporary>, Config>;

  /**
   * The return type for {@linkcode Level.deleteDialog | Level#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<Config extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Level.Stored,
    Config
  >;

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended. This type will be removed in v14.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side Level document which extends the common BaseLevel model.
 *
 * Levels are embedded in a {@linkcode Scene} and describe vertically stacked playable regions
 * (e.g. basement / ground floor / upstairs), each with its own background / foreground / fog
 * imagery and an elevation band.
 */
declare class Level extends BaseLevel.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `Level`
   * @param context - Construction context options
   */
  constructor(data: Level.CreateData, context?: Level.ConstructionContext);

  /**
   * The integer index of the Level within its parent Scene, assigned during Scene data preparation.
   */
  index: number;

  /**
   * Is this Level the currently-viewed level of its parent Scene?
   */
  get isView(): boolean;

  /**
   * Is this Level currently visible? A Level is visible when it is the viewed level, or when
   * the viewed level's `visibility.levels` set includes this Level's id.
   */
  get isVisible(): boolean;

  /**
   * The {@linkcode CanvasEdges} computed for this Level (lazy-instantiated on first access).
   */
  get edges(): CanvasEdges;

  /**
   * Clamp the given elevation (of a token with a depth) to the elevation range of this Level.
   * The elevation is clamped such that the head of the token is in the range if possible, but
   * the feet are never outside of the range.
   * @param elevation - The elevation (of the token)
   * @param depth     - The depth of the token
   * @returns The clamped elevation
   */
  clampElevation(elevation: number, depth?: number): number;

  override prepareBaseData(): void;

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

  // Descendant Document operations have been left out because Level does not have any descendant documents.

  protected override _preCreate(
    data: Level.CreateData,
    options: Level.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Level.Stored[],
    operation: Level.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected static override _onDeleteOperation(
    documents: Level.Stored[],
    operation: Level.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  // `context` must contain a `parent`, so is required.
  static override defaultName(context: Level.DefaultNameContext): string;

  // `createOptions` must contain a `parent`, so is required.
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Level.CreateDialogOptions | undefined = undefined,
  >(
    data: Level.CreateDialogData | undefined,
    createOptions: Level.Database.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Level.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Level.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Level.CreateDialogOptions | undefined = undefined,
  >(
    data: Level.CreateDialogData | undefined,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Level.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Level.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Level.Database.DeleteOneDocumentOperation,
  ): Promise<Level.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Level.Database.DeleteOneDocumentOperation,
  ): Promise<Level.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Level.DropData): Promise<Level.Implementation | undefined>;

  static override fromImport(
    source: Level.Source,
    context?: Document.FromImportContext<Level.Parent>,
  ): Promise<Level.Implementation>;
}

export default Level;
