import type { Identity } from "#utils";
import type IterableWeakSet from "#common/utils/iterable-weak-set.d.mts";

/**
 * A singleton helper class that tracks the duration and expiry of
 * {@linkcode foundry.documents.ActiveEffect | ActiveEffect}s.
 *
 * @remarks Held as a frozen static reference on {@linkcode ActiveEffect.registry} and lazily
 * populated on first `game._documentsReady`. Effects are added to the set if their
 * {@linkcode ActiveEffect.isExpiryTrackable | isExpiryTrackable} getter returns `true`.
 */
declare class ActiveEffectRegistry extends IterableWeakSet<ActiveEffect.Implementation> {
  #activeEffectRegistry: true;

  /** Has the registry been populated for the first time? */
  get initialized(): boolean;

  /**
   * Populate the registry for the first time.
   *
   * @remarks Skipped if `game._documentsReady` is `false`, or if already initialized. Registers
   * effects on all base actors (synthetic-token actor effects are registered lazily by
   * `TokenDocument#_onDeltaMaterialized`) and runs `effect.updateDuration()` against each.
   * @internal
   */
  _initialize(): void;

  /**
   * Register a single ActiveEffect document. If the document is already registered but no longer
   * eligible for registration (per {@linkcode ActiveEffect.isExpiryTrackable | isExpiryTrackable}),
   * it is deleted instead.
   * @param effect - The ActiveEffect to register.
   * @returns This registry.
   */
  override add(effect: ActiveEffect.Implementation): this;

  /**
   * Register the ActiveEffects embedded on an Actor or Item. For Actors, also descends into
   * embedded Items.
   * @param document - The parent Actor or Item whose effects should be registered.
   * @returns This registry.
   */
  addFromParent(document: Actor.Implementation | Item.Implementation): this;

  /**
   * Unregister the ActiveEffects embedded on an Actor or Item. For Actors, also descends into
   * embedded Items.
   * @param document - The parent Actor or Item whose effects should be unregistered.
   * @returns Whether any deletions occurred.
   */
  deleteFromParent(document: Actor.Implementation | Item.Implementation): boolean;

  /**
   * Refresh the durations of registered ActiveEffects and perform the configured action for
   * expired effects (see {@linkcode CONFIG.ActiveEffect.expiryAction}).
   * @param event   - The expiry or other event that triggered this call.
   * @param context - Additional contextual data relevant to the event.
   */
  refresh(event: string, context?: ActiveEffectRegistry.RefreshContext): Promise<void>;
}

declare namespace ActiveEffectRegistry {
  interface Any extends AnyActiveEffectRegistry {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectRegistry> {}

  /** Optional contextual data for {@linkcode ActiveEffectRegistry.refresh}. */
  interface RefreshContext {
    /** The Combat associated with this event. */
    combat?: Combat.Implementation;

    /** Limit the refresh to effects belonging to the provided list of actors. */
    actors?: Set<Actor.Implementation>;
  }
}

declare abstract class AnyActiveEffectRegistry extends ActiveEffectRegistry {
  constructor(...args: never);
}

export default ActiveEffectRegistry;
