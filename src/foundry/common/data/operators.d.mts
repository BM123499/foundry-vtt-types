/**
 * Operator wrappers used by Active Effect change application and DataModel update plumbing to
 * request behaviors that are otherwise impossible to express via plain values — most notably
 * "delete this field" and "replace this field without recursing into it".
 */

/**
 * A symbol used to reference the operator value which ensures it does not collide with a proxied
 * key of that value.
 */
export const OPERATOR_VALUE: unique symbol;

/**
 * A unique string used in serialization to identify that an object should be deserialized to a
 * {@linkcode DataFieldOperator}.
 *
 * @defaultValue `"__$OPERATOR$__"`
 */
export const OPERATOR_IDENTIFIER: "__$OPERATOR$__";

/**
 * A base class used for all special database operations.
 *
 * Instances carry their payload under {@linkcode OPERATOR_VALUE} (a `symbol` keyed property so it
 * cannot collide with a wrapped object's own keys). Serialization writes
 * `{[OPERATOR_IDENTIFIER]: <subclass-name>, value}`.
 */
export class DataFieldOperator<Value = unknown> {
  constructor(value?: Value);

  /**
   * The value that a field should be assigned to.
   */
  readonly [OPERATOR_VALUE]: Value;

  toJSON(): {
    [OPERATOR_IDENTIFIER]: string;
    value: unknown;
  };

  /**
   * Create a DataFieldOperator using a provided value.
   */
  static create<V>(value: V): DataFieldOperator<V>;

  /**
   * Retrieve the inner value of the DataFieldOperator, or return the value passed if not a
   * DataFieldOperator instance.
   */
  static get<V>(value: DataFieldOperator<V> | V): V;

  /**
   * Assign the inner value of the DataFieldOperator.
   */
  static set<V>(operator: DataFieldOperator<V>, value: V): V;

  /**
   * A comparison helper that asserts whether two values are equal when one or both values may be
   * DataFieldOperator instances.
   */
  static equals(a: unknown, b: unknown): boolean;
}

/**
 * Force the deletion of a certain DataModel field, resetting its value back to `undefined`.
 *
 * @remarks Constructed without a value: the wrapped `[OPERATOR_VALUE]` is always `undefined`. The
 * constructor signature accepts (and ignores) a value parameter for consistency with the parent
 * class. Use {@linkcode DataFieldOperator.create | ForcedDeletion.create} to instantiate.
 */
export class ForcedDeletion extends DataFieldOperator<undefined> {
  constructor(value?: unknown);
}

/**
 * Force the replacement of a certain DataModel field, assigning it to some explicit value without
 * inner recursion. The `create` static returns a `Proxy` wrapping the instance so the inner value
 * remains property-inspectable.
 */
export class ForcedReplacement<Value = unknown> extends DataFieldOperator<Value> {
  constructor(value: Value);

  /**
   * Create a ForcedReplacement instance wrapped in a Proxy so the underlying value remains
   * directly inspectable through the wrapper.
   */
  static create<V>(value: V): ForcedReplacement<V>;
}

/**
 * Reconstruct a {@linkcode DataFieldOperator} instance from its serialized form.
 *
 * @throws When the `operator` discriminator is not one of `"ForcedDeletion"` or `"ForcedReplacement"`.
 */
export function reconstructOperator(obj: { [OPERATOR_IDENTIFIER]: string; value?: unknown }): DataFieldOperator;
