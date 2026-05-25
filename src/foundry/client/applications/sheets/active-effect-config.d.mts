import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ApplicationV2 from "../api/application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ActiveEffectConfig: ActiveEffectConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single ActiveEffect document within a parent
 * Actor or Item.
 *
 * @remarks The sheet is organized into `header`, `tabs`, `details`, `duration`, `changes`, and
 * `footer` parts. The `changes` part renders one row per `system.changes` entry via the auxiliary
 * `templates/sheets/active-effect/change.hbs` template. Submitted change values are JSON-parsed
 * in {@linkcode _processChangeSubmission}.
 */
declare class ActiveEffectConfig<
  RenderContext extends ActiveEffectConfig.RenderContext = ActiveEffectConfig.RenderContext,
  Configuration extends ActiveEffectConfig.Configuration = ActiveEffectConfig.Configuration,
  RenderOptions extends ActiveEffectConfig.RenderOptions = ActiveEffectConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  ActiveEffect.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  #activeEffectConfig: true;

  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @remarks Parts:
   * - `header` — `templates/sheets/active-effect/header.hbs`
   * - `tabs` — `templates/generic/tab-navigation.hbs`
   * - `details` — `templates/sheets/active-effect/details.hbs`
   * - `duration` — `templates/sheets/active-effect/duration.hbs`
   * - `changes` — `templates/sheets/active-effect/changes.hbs` with auxiliary
   *   `templates/sheets/active-effect/change.hbs` for per-change rendering
   * - `footer` — `templates/generic/form-footer.hbs`
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Tabs: `details` (default), `duration`, `changes`, all under the `sheet` tab group.
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _attachFrameListeners(): void;

  /**
   * Prepare the render context for a specific part.
   *
   * @remarks Per-part dispatch:
   * - `details`: adds `isActorEffect`, `isItemEffect`, `statuses`, `showIconOptions`.
   * - `duration`: adds `start` (via {@linkcode _prepareStartContext}), `hasDuration`,
   *   `durationUnits` (grouped by time vs. combat), `expiryEvents`.
   * - `changes`: renders each entry via {@linkcode _renderChange} and adds `changes` array.
   * - `footer`: adds submit `buttons`.
   * - `tabs`: adds `tabClasses: "top-tabs"`.
   */
  protected override _preparePartContext(
    partId: string,
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<RenderContext>;

  /**
   * Prepare render context for a single change object and render it via the change-type's custom
   * renderer (if any) or the default `templates/sheets/active-effect/change.hbs` template.
   */
  protected _renderChange(context: ActiveEffectConfig.RenderChangeContext): Promise<string>;

  /**
   * Prepare display context for {@linkcode ActiveEffect.EffectStartData | EffectStartData}.
   * Returns `null` if the effect has no `start` data.
   */
  protected _prepareStartContext(): Promise<ActiveEffectConfig.StartContext | null>;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): object;

  /**
   * Post-process a single submitted change object. By default attempts to JSON-parse a string
   * `change.value` and swallows parse errors silently.
   */
  protected _processChangeSubmission(change: ActiveEffect.ChangeData, index: number): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}

declare namespace ActiveEffectConfig {
  interface Any extends AnyActiveEffectConfig {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<ActiveEffect.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<ActiveEffect.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}

  /** Context passed to {@linkcode ActiveEffectConfig._renderChange}. */
  interface RenderChangeContext {
    /** A copy of the change from the Effect's source array. */
    change: ActiveEffect.ChangeData;

    /** The change object's index in the array. */
    index: number;

    /** The defined fields of the change data, taken from `effect.system.schema.fields.changes.element.fields`. */
    fields: foundry.data.fields.DataSchema;

    /** The change type's default priority. */
    defaultPriority: number;

    /** All change types and their localized labels, keyed by type id. */
    changeTypes: Record<string, string>;
  }

  /** Context returned by {@linkcode ActiveEffectConfig._prepareStartContext} (or `null`). */
  interface StartContext extends Omit<ActiveEffect.EffectStartData, "combat" | "combatant" | "time"> {
    /** Localized human-readable "X ago" formatting of the start time. */
    time: string;

    /** Resolved Combat document, or `null`. */
    combat: Combat.Implementation | null;

    /** Resolved Combatant document, or `null`. */
    combatant: Combatant.Implementation | null;

    /** Display name of the starting combatant (or `"???"` if hidden). */
    combatantName: string;

    /** Display value for the starting combatant's initiative. */
    combatantInitiative: number | string;
  }
}

declare abstract class AnyActiveEffectConfig extends ActiveEffectConfig<
  ActiveEffectConfig.RenderContext,
  ActiveEffectConfig.Configuration,
  ActiveEffectConfig.RenderOptions
> {
  constructor(...args: never);
}

export default ActiveEffectConfig;
