import { expectTypeOf, assertType, test } from "vitest";
import type { AnyConstructor, AnyFunction, DeepReadonly, NonNullish } from "fvtt-types/utils";
import utils = foundry.utils;

// eslint-disable-next-line @typescript-eslint/no-deprecated
import FormApplication = foundry.appv1.api.FormApplication;
import ForcedDeletion = foundry.data.operators.ForcedDeletion;
import ForcedReplacement = foundry.data.operators.ForcedReplacement;

declare const deletion: ForcedDeletion;
declare const unknownValue: unknown;
declare const anyValue: any;
declare const anyA: { a: any };
declare const anyAWithDeletion: { a: any; b: ForcedDeletion };
declare const anyB: { b: any };

declare class OperatorHolder {
  value: { gone: ForcedDeletion };
  describe(): string;
}
declare const callback: () => void;
declare const maybeApply: boolean;
declare const maybeDeletion: { k1?: ForcedDeletion };
declare const options: utils.MergeObjectOptions;
declare const unionUpdate: { a: 2 } | { b: 3 };
declare const unionDeletion: { a: ForcedDeletion } | { b: 1 };
declare const numberSet: Set<number>;
declare const color: utils.Color;
declare const date: Date;
declare const maybeInsert: boolean;

declare function functionWithoutParameters(): void;
declare function functionWithParameters(a: number, b: string, c?: boolean): void;
declare function functionWithReturnTypeOtherThanVoid(): number;

// equals

declare const someUnknown: unknown;

// isSubclass

declare class ClassWithNoConstructorParameters {}

declare class ClassWithConstructorParameters {
  constructor(a: number, b: string);
}

// parseUuid

declare const someActor: Actor.Stored;

// buildRelativeUUID

declare const someItem: Item.Stored;

test("foundry/common/utils/helpers", () => {
  // applyDataOperators

  const withOperators = {
    gone: deletion,
    kept: ForcedReplacement.create({ a: 1 }),
    plain: 2,
    nested: { inner: deletion, list: [deletion, 3] },
  };
  const applied = utils.applyDataOperators(withOperators);
  expectTypeOf(applied).toEqualTypeOf<{
    kept: { a: number };
    plain: number;
    nested: { list: (undefined | number)[] };
  }>();
  // @ts-expect-error the deletion is applied
  void applied.gone;

  // Legacy keys are migrated and applied
  expectTypeOf(utils.applyDataOperators({ "-=a": null, "==b": { c: 1 }, d: 2 })).toEqualTypeOf<{
    b: { c: number };
    d: number;
  }>();

  // Top-level operators are unwrapped
  expectTypeOf(utils.applyDataOperators(deletion)).toEqualTypeOf<undefined>();
  expectTypeOf(utils.applyDataOperators(ForcedReplacement.create("x"))).toEqualTypeOf<string>();

  // Primitives, class instances, `unknown` and `any` pass through
  expectTypeOf(utils.applyDataOperators(5)).toEqualTypeOf<number>();
  expectTypeOf(utils.applyDataOperators(new OperatorHolder())).toEqualTypeOf<OperatorHolder>();
  expectTypeOf(utils.applyDataOperators(unknownValue)).toBeUnknown();
  expectTypeOf(utils.applyDataOperators(anyValue)).toBeAny();

  // An `any` property is plain data, not a method
  expectTypeOf(utils.applyDataOperators(anyAWithDeletion)).toEqualTypeOf<{ a: any }>();

  // A plain object with a callback is still processed when it holds an operator
  expectTypeOf(utils.applyDataOperators({ cb: callback, b: deletion })).toEqualTypeOf<{ cb: () => void }>();

  // Generic code can name the result
  const applyGeneric = <T extends object>(obj: T): utils.ApplyDataOperators<T> => utils.applyDataOperators(obj);
  expectTypeOf(applyGeneric({ a: deletion, b: 1 })).toEqualTypeOf<{ b: number }>();

  // benchmark

  expectTypeOf(utils.benchmark(functionWithoutParameters, 42)).toEqualTypeOf<Promise<void>>();

  // @ts-expect-error the function takes no arguments
  utils.benchmark(functionWithoutParameters, 42, "unknown argument");

  expectTypeOf(utils.benchmark(functionWithParameters, 42, 1, "", false)).toEqualTypeOf<Promise<void>>();
  expectTypeOf(utils.benchmark(functionWithParameters, 42, 1, "")).toEqualTypeOf<Promise<void>>();

  // @ts-expect-error the function takes a number and a string
  utils.benchmark(functionWithParameters, 42, 1);

  // @ts-expect-error the function takes doesn't take three arguments
  utils.benchmark(functionWithParameters, 42, 1, "", "unknown argument");

  expectTypeOf(utils.benchmark(functionWithReturnTypeOtherThanVoid, 42)).toEqualTypeOf<Promise<void>>();

  // threadLock
  expectTypeOf(utils.threadLock(42)).toEqualTypeOf<Promise<void>>();

  // debounce

  const debounceWithoutParameters = utils.debounce(functionWithoutParameters, 500);
  expectTypeOf(debounceWithoutParameters).toExtend<(() => void) & { cancel: () => void }>();
  expectTypeOf(debounceWithoutParameters.cancel).toEqualTypeOf<() => void>();

  const debounceWithParameters = utils.debounce(functionWithParameters, 500);
  expectTypeOf(debounceWithParameters).toExtend<
    ((a: number, b: string, c?: boolean) => void) & { cancel: () => void }
  >();
  expectTypeOf(debounceWithParameters.cancel).toEqualTypeOf<() => void>();

  // throttle

  expectTypeOf(utils.throttle(functionWithoutParameters, 500)).toEqualTypeOf<() => void>();
  expectTypeOf(utils.throttle(functionWithParameters, 500)).toEqualTypeOf<
    (a: number, b: string, c?: boolean) => void
  >();
  expectTypeOf(utils.throttle(() => {}, 1)).toBeFunction();

  expectTypeOf(
    utils.throttle((a: number) => {
      console.log(a);
    }, 1),
  ).toExtend<(a: number) => void>();

  expectTypeOf(
    utils.throttle((a: number, b: string) => {
      console.log(a, b);
    }, 1),
  ).toExtend<(a: number, b: string) => void>();

  expectTypeOf(
    utils.throttle((a: number, b: string, c: boolean) => {
      console.log(a, b, c);
    }, 1),
  ).toExtend<(a: number, b: string, c: boolean) => void>();

  expectTypeOf(
    utils.throttle((a: number, b: string, c: boolean, d: symbol) => {
      console.log(a, b, c, d);
    }, 1),
  ).toExtend<(a: number, b: string, c: boolean, d: symbol) => void>();

  expectTypeOf(
    utils.throttle((a: number, b: string, c: boolean, d: symbol, e: bigint) => {
      console.log(a, b, c, d, e);
    }, 1),
  ).toExtend<(a: number, b: string, c: boolean, d: symbol, e: bigint) => void>();

  // debouncedReload
  expectTypeOf(utils.debouncedReload).toEqualTypeOf<() => void>();

  // deepFreeze
  const freezable = {
    foo: true,
    bar: 17,
    baz: "fizz",
    arr: [1, 2, 3],
    obj: {
      foo2: false,
      bar2: 71,
    },
  };
  type AfterFreezing = { foo: boolean; bar: number; baz: string; arr: number[]; obj: { foo2: boolean; bar2: number } };
  expectTypeOf(utils.deepFreeze(freezable)).toEqualTypeOf<DeepReadonly<AfterFreezing>>();
  expectTypeOf(utils.deepFreeze(freezable, {})).toEqualTypeOf<DeepReadonly<AfterFreezing>>();
  expectTypeOf(utils.deepFreeze(freezable, { strict: true })).toEqualTypeOf<DeepReadonly<AfterFreezing>>();
  expectTypeOf(utils.deepFreeze(freezable, { strict: undefined })).toEqualTypeOf<DeepReadonly<AfterFreezing>>();

  // deepSeal

  // TS doesn't have anything to indicate sealedness, this function's return type is a passthrough
  expectTypeOf(utils.deepSeal(freezable)).toEqualTypeOf<typeof freezable>();
  expectTypeOf(utils.deepSeal(freezable, {})).toEqualTypeOf<typeof freezable>();
  expectTypeOf(utils.deepSeal(freezable, { strict: true })).toEqualTypeOf<typeof freezable>();
  expectTypeOf(utils.deepSeal(freezable, { strict: undefined })).toEqualTypeOf<typeof freezable>();

  // deepClone

  const complexObject = {
    a: "",
    b: 0,
    toJSON: () => [
      false,
      undefined,
      {
        c: undefined,
        d: ((): boolean | symbol => false)(),
        e: [true],
        f: { g: 0, h: ((): number | undefined => 0)() },
      },
    ],
  };

  const str = "abc";
  const num = 1;
  const bigint = 1n;
  const bool = true;

  expectTypeOf(utils.deepClone(str)).toEqualTypeOf<string>();
  expectTypeOf(utils.deepClone("abc" as const)).toEqualTypeOf<"abc">();
  expectTypeOf(utils.deepClone(num)).toEqualTypeOf<number>();
  expectTypeOf(utils.deepClone(1 as const)).toEqualTypeOf<1>();
  expectTypeOf(utils.deepClone(bigint)).toEqualTypeOf<bigint>();
  expectTypeOf(utils.deepClone(1n as const)).toEqualTypeOf<1n>();
  expectTypeOf(utils.deepClone(true as const)).toEqualTypeOf<true>();
  expectTypeOf(utils.deepClone(bool)).toEqualTypeOf<boolean>();
  expectTypeOf(utils.deepClone(Symbol("customSymbol"))).toEqualTypeOf<symbol>();
  expectTypeOf(utils.deepClone(undefined)).toEqualTypeOf<undefined>();
  expectTypeOf(utils.deepClone(null)).toEqualTypeOf<null>();
  expectTypeOf(utils.deepClone(["a", "b"])).toEqualTypeOf<Array<string>>();
  expectTypeOf(utils.deepClone(["a", "b"])).toEqualTypeOf<Array<string>>();
  expectTypeOf(utils.deepClone({ a: "foo", b: 42 })).toEqualTypeOf<{ a: string; b: number }>();
  expectTypeOf(utils.deepClone(new Date())).toEqualTypeOf<Date>();
  expectTypeOf(utils.deepClone(complexObject)).toEqualTypeOf<typeof complexObject>();

  expectTypeOf(utils.deepClone(str, { strict: false })).toEqualTypeOf<string>();
  expectTypeOf(utils.deepClone(str, { strict: true })).toEqualTypeOf<string>();
  expectTypeOf(utils.deepClone(str, { strict: undefined })).toEqualTypeOf<string>();

  expectTypeOf(utils.deepClone(str, { prune: false })).toEqualTypeOf<string>();
  expectTypeOf(utils.deepClone(str, { prune: true })).toEqualTypeOf<string>();
  expectTypeOf(utils.deepClone(str, { prune: undefined })).toEqualTypeOf<string>();

  // diffObject

  expectTypeOf(utils.diffObject({ a: 1 }, { a: 1 })).toEqualTypeOf<object>();
  expectTypeOf(utils.diffObject({ a: 1 }, { a: 7, b: 2 })).toEqualTypeOf<object>();
  expectTypeOf(utils.diffObject({ a: 1 }, { a: 1 }, {})).toEqualTypeOf<object>();
  expectTypeOf(
    utils.diffObject(
      { a: 1 },
      { a: 1 },
      {
        deletionKeys: true,
        inner: true,
        bidirectional: true,
        _d: 0, // should never really be passed
      },
    ),
  ).toEqualTypeOf<object>();
  expectTypeOf(
    utils.diffObject(
      { a: 1 },
      { a: 1 },
      {
        deletionKeys: undefined,
        inner: undefined,
        bidirectional: undefined,
        _d: undefined,
      },
    ),
  ).toEqualTypeOf<object>();

  // equals

  expectTypeOf(utils.equals("foo", "foo")).toBeBoolean();
  expectTypeOf(utils.equals("foo", "bar")).toBeBoolean();
  expectTypeOf(utils.equals(7, {})).toBeBoolean();
  expectTypeOf(utils.equals(someUnknown, 7)).toBeBoolean();

  // `b` must overlap with `a`, since values of unrelated types can never be equal
  // @ts-expect-error a number is never equal to a string
  utils.equals(7, "x");
  // @ts-expect-error unrelated classes are never equal
  utils.equals(foundry.documents.Actor, foundry.documents.Card);

  // duplicate

  expectTypeOf(utils.duplicate("")).toEqualTypeOf<string>();

  expectTypeOf(utils.duplicate(0)).toEqualTypeOf<number>();

  expectTypeOf(utils.duplicate<0 | 1>(0)).toEqualTypeOf<0 | 1>();

  expectTypeOf(utils.duplicate<"foo" | "bar">("foo")).toEqualTypeOf<"foo" | "bar">();

  expectTypeOf(utils.duplicate<number>(0)).toEqualTypeOf<number>();

  /* `NaN` will actually be converted to `null` but for ease of use, this is ignored. */
  expectTypeOf(utils.duplicate<number>(NaN)).toEqualTypeOf<number>();

  expectTypeOf(utils.duplicate(((): boolean => false)())).toEqualTypeOf<boolean>();

  expectTypeOf(utils.duplicate(null)).toEqualTypeOf<null>();

  expectTypeOf(utils.duplicate(undefined)).toEqualTypeOf<never>();

  expectTypeOf(utils.duplicate(() => 0)).toEqualTypeOf<never>();

  expectTypeOf(utils.duplicate(Symbol(""))).toEqualTypeOf<never>();

  expectTypeOf(utils.duplicate(false as const)).toEqualTypeOf<false>();

  expectTypeOf(utils.duplicate(((): string | boolean => "")())).toEqualTypeOf<string | boolean>();

  expectTypeOf(utils.duplicate(((): string | number => "")())).toEqualTypeOf<string | number>();

  expectTypeOf(utils.duplicate(((): string | null => "")())).toEqualTypeOf<string | null>();

  expectTypeOf(utils.duplicate(((): string | undefined => "")())).toEqualTypeOf<string>();

  expectTypeOf(utils.duplicate(((): string | AnyFunction => "")())).toEqualTypeOf<string>();

  expectTypeOf(utils.duplicate(((): string | symbol => "")())).toEqualTypeOf<string>();

  expectTypeOf(utils.duplicate([""])).toEqualTypeOf<Array<string>>();

  expectTypeOf(utils.duplicate([0])).toEqualTypeOf<Array<number>>();

  expectTypeOf(utils.duplicate([false, true])).toEqualTypeOf<Array<boolean>>();

  expectTypeOf(utils.duplicate([null])).toEqualTypeOf<Array<null>>();

  expectTypeOf(utils.duplicate([undefined])).toEqualTypeOf<Array<null>>();

  expectTypeOf(utils.duplicate([() => 0])).toEqualTypeOf<Array<null>>();

  expectTypeOf(utils.duplicate([Symbol("")])).toEqualTypeOf<Array<null>>();

  expectTypeOf(utils.duplicate([false as const])).toEqualTypeOf<Array<false>>();

  expectTypeOf(utils.duplicate(["", false, true])).toEqualTypeOf<Array<string | boolean>>();

  expectTypeOf(utils.duplicate(["", 0])).toEqualTypeOf<Array<string | number>>();

  expectTypeOf(utils.duplicate(["", null])).toEqualTypeOf<Array<string | null>>();

  expectTypeOf(utils.duplicate(["", undefined])).toEqualTypeOf<Array<string | null>>();

  expectTypeOf(utils.duplicate(["", () => 0])).toEqualTypeOf<Array<string | null>>();

  expectTypeOf(utils.duplicate(["", Symbol("")])).toEqualTypeOf<Array<string | null>>();

  expectTypeOf(utils.duplicate([((): "a" | "b" => "a")()])).toEqualTypeOf<Array<"a" | "b">>();

  expectTypeOf(utils.duplicate([[false, true]])).toEqualTypeOf<Array<Array<boolean>>>();

  expectTypeOf(utils.duplicate([{ a: "" }])).toEqualTypeOf<Array<{ a: string }>>();

  expectTypeOf(utils.duplicate({ a: "" })).toEqualTypeOf<{ a: string }>();

  expectTypeOf(utils.duplicate({ a: 0 })).toEqualTypeOf<{ a: number }>();

  expectTypeOf(utils.duplicate({ a: ((): boolean => false)() })).toEqualTypeOf<{ a: boolean }>();

  expectTypeOf(utils.duplicate({ a: null })).toEqualTypeOf<{ a: null }>();

  expectTypeOf(utils.duplicate({ a: undefined })).toEqualTypeOf<NonNullish>();

  expectTypeOf(utils.duplicate({ a: () => 0 })).toEqualTypeOf<NonNullish>();

  expectTypeOf(utils.duplicate({ a: Symbol("") })).toEqualTypeOf<NonNullish>();

  expectTypeOf(utils.duplicate({ a: ((): string | boolean => "")() })).toEqualTypeOf<{ a: string | boolean }>();

  expectTypeOf(utils.duplicate({ a: ((): string | number => "")() })).toEqualTypeOf<{ a: string | number }>();

  expectTypeOf(utils.duplicate({ a: ((): string | null => "")() })).toEqualTypeOf<{ a: string | null }>();

  expectTypeOf(utils.duplicate({ a: ((): string | undefined => "")() })).toEqualTypeOf<{
    a?: string | undefined;
  }>();

  expectTypeOf(utils.duplicate({ a: ((): string | AnyFunction => "")() })).toEqualTypeOf<{
    a?: string | undefined;
  }>();

  expectTypeOf(utils.duplicate({ a: ((): string | symbol => "")() })).toEqualTypeOf<{ a?: string | undefined }>();

  expectTypeOf(utils.duplicate({ a: [""] })).toEqualTypeOf<{ a: Array<string> }>();

  expectTypeOf(utils.duplicate({ a: { b: "" } })).toEqualTypeOf<{ a: { b: string } }>();

  expectTypeOf(utils.duplicate({ a: false as const })).toEqualTypeOf<{ a: false }>();

  expectTypeOf(utils.duplicate({ a: ((): "a" | "b" => "a")() })).toEqualTypeOf<{ a: "a" | "b" }>();

  expectTypeOf(utils.duplicate({ a: 0, b: "", c: false, toJSON: (): string => "" })).toEqualTypeOf<string>();

  expectTypeOf(
    utils.duplicate({ a: 0, b: "", c: false, toJSON: () => ({ foo: "", bar: ((): boolean => false)() }) }),
  ).toEqualTypeOf<{ foo: string; bar: boolean }>();

  expectTypeOf(
    utils.duplicate({
      a: 0,
      b: "",
      c: false,
      toJSON: () => ({ foo: "", bar: ((): boolean => false)(), toJSON: () => "" }),
    }),
  ).toEqualTypeOf<{ foo: string; bar: boolean }>();

  expectTypeOf(
    utils.duplicate({
      a: 0,
      b: "",
      c: false,
      toJSON: () => ({ foo: "", bar: { baz: "", toJSON: () => false } }),
    }),
  ).toEqualTypeOf<{ foo: string; bar: false }>();

  expectTypeOf(utils.duplicate(complexObject)).toEqualTypeOf<
    Array<
      | boolean
      | null
      | {
          d?: boolean | undefined;
          e: Array<boolean>;
          f: { g: number; h?: number | undefined };
        }
    >
  >();

  expectTypeOf(
    utils.isSubclass(ClassWithNoConstructorParameters, ClassWithConstructorParameters),
  ).toEqualTypeOf<boolean>();
  expectTypeOf(
    utils.isSubclass(ClassWithConstructorParameters, ClassWithNoConstructorParameters),
  ).toEqualTypeOf<boolean>();

  // getDefiningClass

  expectTypeOf(utils.getDefiningClass(foundry.documents.BaseActor, "name")).toEqualTypeOf<AnyConstructor>();

  // encodeURL

  expectTypeOf(utils.encodeURL("")).toEqualTypeOf<string>();

  // expandObject

  expectTypeOf(utils.expandObject({})).toEqualTypeOf<object>();

  // expandObjectInPlace

  expectTypeOf(utils.expandObjectInPlace({})).toEqualTypeOf<boolean>();
  expectTypeOf(utils.expandObjectInPlace({}, {})).toEqualTypeOf<boolean>();
  expectTypeOf(utils.expandObjectInPlace({}, { shallow: true })).toEqualTypeOf<boolean>();
  expectTypeOf(utils.expandObjectInPlace({}, { shallow: undefined })).toEqualTypeOf<boolean>();

  // filterObject

  expectTypeOf(utils.filterObject({}, {})).toEqualTypeOf<object>();
  expectTypeOf(utils.filterObject({}, {}, {})).toEqualTypeOf<object>();
  expectTypeOf(utils.filterObject({}, {}, { templateValues: true })).toEqualTypeOf<object>();
  expectTypeOf(
    utils.filterObject({}, {}, { deletionKeys: undefined, templateValues: undefined }),
  ).toEqualTypeOf<object>();

  // flattenObject

  expectTypeOf(utils.flattenObject({})).toEqualTypeOf<object>();

  // getParentClasses

  expectTypeOf(utils.getParentClasses(foundry.documents.BaseActor)).toEqualTypeOf<AnyConstructor[]>();

  // getRoute

  expectTypeOf(utils.getRoute("")).toEqualTypeOf<string>();
  expectTypeOf(utils.getRoute("", {})).toEqualTypeOf<string>();
  expectTypeOf(utils.getRoute("", { prefix: "foo/" })).toEqualTypeOf<string>();
  expectTypeOf(utils.getRoute("", { prefix: undefined })).toEqualTypeOf<string>();
  expectTypeOf(utils.getRoute("", { prefix: null })).toEqualTypeOf<string>();

  // isElementInstanceOf

  const div = new HTMLDivElement();

  expectTypeOf(utils.isElementInstanceOf(div, "div")).toBeBoolean();
  expectTypeOf(utils.isElementInstanceOf(div, HTMLElement)).toBeBoolean();

  // isPlainObject

  expectTypeOf(utils.isPlainObject({})).toBeBoolean();
  expectTypeOf(utils.isPlainObject(foundry.documents.Actor)).toBeBoolean();

  // getType

  expectTypeOf(utils.getType("")).toEqualTypeOf<
    | "Array"
    | "Error"
    | "HTMLElement"
    | "Map"
    | "Object"
    | "Promise"
    | "Set"
    | "bigint"
    | "boolean"
    | "function"
    | "null"
    | "number"
    | "string"
    | "symbol"
    | "undefined"
    | "Unknown"
  >();

  // hasProperty

  expectTypeOf(utils.hasProperty({}, "foo")).toEqualTypeOf<boolean>();

  // getProperty

  expectTypeOf(utils.getProperty({}, "bar")).toEqualTypeOf<unknown>();

  // setProperty

  expectTypeOf(utils.setProperty({}, "baz", 4)).toEqualTypeOf<boolean>();

  // deleteProperty

  // @ts-expect-error TODO(LukeAbby): `deleteProperty` only allows deleting keys that exist.
  utils.deleteProperty({}, "fizz");

  // invertObject

  expectTypeOf(utils.invertObject({ a: 1, b: "foo" } as const)).toEqualTypeOf<{
    1: "a";
    foo: "b";
  }>();

  // isNewerVersion

  expectTypeOf(utils.isNewerVersion(4, "2.3")).toEqualTypeOf<boolean>();
  expectTypeOf(utils.isNewerVersion(4, "2.3", {})).toEqualTypeOf<boolean>();
  expectTypeOf(utils.isNewerVersion(4, "2.3", { majorOnly: true })).toEqualTypeOf<boolean>();
  expectTypeOf(utils.isNewerVersion(4, "2.3", { majorOnly: undefined })).toEqualTypeOf<boolean>();
  expectTypeOf(utils.isNewerVersion(null, undefined)).toEqualTypeOf<boolean>();

  // isEmpty

  expectTypeOf(utils.isEmpty(4)).toEqualTypeOf<boolean>();

  // objectEntries

  expectTypeOf(utils.objectEntries({})).toEqualTypeOf<Generator<[string, unknown], void, void>>();

  // iterateEntries

  for (const entry of utils.iterateEntries({ x: 7, y: 9 })) {
    expectTypeOf(entry).toEqualTypeOf<[string, unknown]>;
  }

  // objectKeys

  expectTypeOf(utils.objectKeys({})).toEqualTypeOf<Generator<string, void, void>>();

  // iterateKeys

  for (const key of utils.iterateKeys({ x: 1, y: 2, 7: 8 })) {
    expectTypeOf(key).toBeString();
  }

  // objectValues

  expectTypeOf(utils.objectValues({})).toEqualTypeOf<Generator<unknown, void, void>>();

  // iterateValues

  for (const value of utils.iterateValues({ foo: "bar", fizz: "buzz" })) {
    expectTypeOf(value).toBeUnknown();
  }

  // mergeObject: assertType is used here because of https://github.com/SamVerschueren/tsd/issues/67

  // mergeObject (1): tests from the docs
  assertType<{ k1: string }>(utils.mergeObject({ k1: "v1" }, { k2: "v2" }, { insertKeys: false }));
  assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "v1" }, { k2: "v2" }, { insertKeys: true }));
  assertType<{ k1: { i1: string } }>(
    utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { insertValues: false }),
  );
  assertType<{ k1: { i1: string; i2: string } }>(
    utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { insertValues: true }),
  );

  assertType<{ k1: string }>(utils.mergeObject({ k1: "v1" }, { k1: "v2" }, { overwrite: true }));
  assertType<{ k1: string }>(utils.mergeObject({ k1: "v1" }, { k1: "v2" }, { overwrite: false }));

  assertType<{ k1: { i2: string } }>(
    utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { recursive: false }),
  );
  assertType<{ k1: { i1: string; i2: string } }>(
    utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { recursive: true }),
  );

  // mergeObject (2): more simple tests

  assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: "" }));
  assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: "" }, {}));
  assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: "" }, { insertKeys: false }));
  assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: "" }, { insertKeys: true }));

  assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "" }, { k2: "" }));
  assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "" }, { k2: "" }, {}));
  assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k2: "" }, { insertKeys: false }));
  assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "" }, { k2: "" }, { insertKeys: true }));

  assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }));
  assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, {}));
  assertType<{ k1: number }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { insertKeys: false }));
  assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { insertKeys: true }));

  // @ts-expect-error TODO(LukeAbby): `mergeObject` has not yet been fully implemented.
  assertType<never>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true }));
  assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: false }));
  // @ts-expect-error TODO(LukeAbby): `mergeObject` has not yet been fully implemented.
  assertType<never>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true, insertKeys: false }));
  // @ts-expect-error TODO(LukeAbby): `mergeObject` has not yet been fully implemented.
  assertType<never>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true, insertKeys: true }));

  assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false }));
  assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: true }));
  assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, {}));
  assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false, insertKeys: false }));
  assertType<{ k1: string; k2: string }>(
    utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false, insertKeys: true }),
  );

  // mergeObject (3): more complex examples
  assertType<{ k1: { i1: string; i2: string }; k2: number; k3: number }>(
    utils.mergeObject({ k1: { i1: "foo" }, k2: 2 }, { k1: { i2: "bar" }, k3: 3 }),
  );
  assertType<{ k1: { i1: string; i2: string; i3: number }; k2: number; k3: number }>(
    utils.mergeObject({ k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 }, { k1: { i2: "bar", i3: 2 }, k3: 3 }),
  );
  assertType<{ k1: { i2: string; i3: number }; k2: number; k3: number }>(
    utils.mergeObject(
      { k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 },
      { k1: { i2: "bar", i3: 2 }, k3: 3 },
      { recursive: false },
    ),
  );
  expectTypeOf(
    utils.mergeObject(
      { k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 },
      { k1: { i2: "bar", i3: 2 }, k3: 3 },
      { recursive: false },
    ).k1,
    // @ts-expect-error TODO(LukeAbby): `mergeObject` has not yet been fully implemented.
  ).toEqualTypeOf<{ i2: string; i3: number }>();
  assertType<{
    k1: { i1: string; i2: string; i3: { j1: string; j2: number; j3: string } };
    k2: number;
    k3: number;
  }>(
    utils.mergeObject(
      { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
      { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
    ),
  );
  assertType<{ k1: { i1: string; i3: { j1: string; j2: number } }; k2: number; k3: number }>(
    utils.mergeObject(
      { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
      { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
      { insertValues: false },
    ),
  );
  assertType<{ k1: { i2: string; i3: { j1: string; j3: string } }; k2: number; k3: number }>(
    utils.mergeObject(
      { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
      { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
      { recursive: false },
    ),
  );

  // Array merging

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  assertType<FormApplication.Options>(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    utils.mergeObject(FormApplication.defaultOptions, {
      classes: ["my", "custom", "css"],
    }),
  );
  assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }));
  assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertKeys: true }));
  assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertValues: true }));
  assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertKeys: false }));
  assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertValues: false }));
  assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { enforceTypes: true }));
  // @ts-expect-error TODO(LukeAbby): `mergeObject` has not yet been fully implemented.
  assertType<never>(utils.mergeObject({ a: ["foo"] }, { a: { b: "foo" } }, { enforceTypes: true }));
  assertType<{ a: { b: string } }>(utils.mergeObject({ a: ["foo"] }, { a: { b: "foo" } }, { enforceTypes: false }));
  // @ts-expect-error TODO(LukeAbby): `mergeObject` has not yet been fully implemented.
  assertType<never>(utils.mergeObject({ a: { b: "foo" } }, { a: ["foo"] }, { enforceTypes: true }));
  assertType<{ a: string[] }>(utils.mergeObject({ a: { b: "foo" } }, { a: ["foo"] }, { enforceTypes: false }));

  // DataFieldOperators: legacy `-=`/`==` keys are migrated to operators under the bare key
  const replacement = ForcedReplacement.create({ i2: "v2" });

  // Without `applyOperators`, an operator replacing an existing key is retained
  assertType<{ k1: ForcedDeletion; k2: string }>(utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }));
  assertType<{ k1: ForcedDeletion; k2: string }>(utils.mergeObject({ k1: "v1", k2: "v2" }, { k1: deletion }));
  assertType<{ k1: string; k2: string }>(
    // @ts-expect-error the value of `k1` is replaced by the operator
    utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }),
  );
  assertType<{ k1: ForcedDeletion; k2: string; "-=k1": null }>(
    // @ts-expect-error the legacy key itself is never kept
    utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }),
  );

  // A `ForcedDeletion` is never inserted
  assertType<{ k2: string }>(utils.mergeObject({ k2: "v2" }, { "-=k1": null }));
  assertType<{ k1: ForcedDeletion; k2: string }>(
    // @ts-expect-error no `k1` to delete, so nothing is inserted
    utils.mergeObject({ k2: "v2" }, { "-=k1": null }),
  );

  // `applyOperators: true` performs the deletion
  assertType<{ k2: string }>(utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { applyOperators: true }));
  assertType<{ k2: string }>(utils.mergeObject({ k1: "v1", k2: "v2" }, { k1: deletion }, { applyOperators: true }));
  assertType<{ k1: unknown; k2: string }>(
    // @ts-expect-error `k1` is deleted
    utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { applyOperators: true }),
  );

  // The deprecated `performDeletions` never enables `applyOperators`
  assertType<{ k1: ForcedDeletion; k2: string }>(
    utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
  );

  // `overwrite: false` protects existing keys against operators
  assertType<{ k1: string; k2: string }>(
    utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { overwrite: false, applyOperators: true }),
  );

  // Forced replacement
  assertType<{ k1: { i2: string } }>(
    utils.mergeObject({ k1: { i1: "v1" } }, { k1: replacement }, { applyOperators: true }),
  );
  assertType<{ k1: { i1: string; i2: string } }>(
    // @ts-expect-error the inner object is replaced, not merged
    utils.mergeObject({ k1: { i1: "v1" } }, { k1: replacement }, { applyOperators: true }),
  );
  assertType<{ k1: ForcedReplacement<{ i2: string }> }>(utils.mergeObject({ k1: { i1: "v1" } }, { k1: replacement }));
  assertType<{ k1: { i2: string } }>(
    utils.mergeObject({ k1: { i1: "v1" } }, { "==k1": { i2: "v2" } }, { applyOperators: true }),
  );

  // Nested deletion
  const nestedDeletion = utils.mergeObject(
    { wrapper: { k1: "v1", k2: "v2" } },
    { wrapper: { "-=k1": null } },
    { recursive: true, applyOperators: true },
  );
  assertType<{ wrapper: { k2: string } }>(nestedDeletion);
  // @ts-expect-error the nested deletion is applied
  void nestedDeletion.wrapper.k1;
  assertType<{ wrapper: { k1: ForcedDeletion; k2: string } }>(
    utils.mergeObject({ wrapper: { k1: "v1", k2: "v2" } }, { wrapper: { "-=k1": null } }, { recursive: true }),
  );

  // `applyOperators: true` also applies operators nested inside any value that is not merged recursively
  const nestedOperators = { nested: { gone: deletion, keep: ForcedReplacement.create(42) } };
  const inserted = utils.mergeObject({}, nestedOperators, { applyOperators: true });
  assertType<{ nested: { keep: number } }>(inserted);
  // @ts-expect-error the nested deletion is applied
  void inserted.nested.gone;
  const overPrimitive = utils.mergeObject({ nested: 5 }, nestedOperators, { applyOperators: true });
  assertType<{ nested: { keep: number } }>(overPrimitive);
  // @ts-expect-error the nested deletion is applied
  void overPrimitive.nested.gone;
  const nonRecursive = utils.mergeObject({ nested: { x: 1 } }, nestedOperators, {
    applyOperators: true,
    recursive: false,
  });
  assertType<{ nested: { keep: number } }>(nonRecursive);
  // @ts-expect-error the nested deletion is applied
  void nonRecursive.nested.gone;
  const list = utils.mergeObject({}, { list: [{ a: deletion, b: 1 }] }, { applyOperators: true });
  assertType<{ list: Array<{ b: number }> }>(list);
  // @ts-expect-error the deletion inside the array element is applied
  void list.list[0].a;
  const legacyNested = utils.mergeObject({}, { n: { "-=x": null, "==y": { z: 1 }, w: 2 } }, { applyOperators: true });
  assertType<{ n: { y: { z: number }; w: number } }>(legacyNested);
  // @ts-expect-error nested legacy keys are migrated and applied too
  void legacyNested.n["-=x"];

  // Class instances are not plain objects, so their contents are left alone
  const instances = utils.mergeObject({}, { holder: new OperatorHolder() }, { applyOperators: true });
  expectTypeOf(instances.holder).toEqualTypeOf<OperatorHolder>();

  // A key given both a value and a deletion is deleted or kept depending on key order, so it may be absent
  const conflicting = utils.mergeObject({ k: 0 }, { k: 1, "-=k": null }, { applyOperators: true });
  expectTypeOf(conflicting.k).toEqualTypeOf<1 | undefined>();
  // @ts-expect-error `k` may have been deleted
  assertType<{ k: number }>(conflicting);

  // `insertKeys: false` inserts nothing, operators included
  assertType<{ k2: string }>(utils.mergeObject({ k2: "v2" }, { "-=k1": null }, { insertKeys: false }));
  assertType<{ k2: string; k3: number }>(
    // @ts-expect-error new keys won't be inserted
    utils.mergeObject({ k2: "v2" }, { k3: 1 }, { insertKeys: false, applyOperators: true }),
  );

  // When `applyOperators` is only known at runtime, a deletion may be applied or retained
  const maybeApplied = utils.mergeObject({ k1: "v1", k2: "v2" }, { k1: deletion }, { applyOperators: maybeApply });
  expectTypeOf(maybeApplied.k1).toEqualTypeOf<ForcedDeletion | undefined>();
  // @ts-expect-error `k1` may have been deleted
  assertType<{ k1: ForcedDeletion }>(maybeApplied);
  const untypedOptions = utils.mergeObject({ k1: "v1", k2: "v2" }, { k1: deletion }, options);
  expectTypeOf(untypedOptions.k1).toEqualTypeOf<ForcedDeletion | undefined>();
  // @ts-expect-error `k1` may have been deleted
  assertType<{ k1: ForcedDeletion }>(untypedOptions);

  // An optional deletion may be absent, which keeps the original value
  const maybeDeleted = utils.mergeObject({ k1: "v1", k2: "v2" }, maybeDeletion, { applyOperators: true });
  expectTypeOf(maybeDeleted.k1).toEqualTypeOf<"v1" | undefined>();
  // @ts-expect-error `k1` may have been deleted
  assertType<{ k1: string }>(maybeDeleted);

  // An `any` value is not a deletion
  const withAny = utils.mergeObject({ a: 1 }, anyB);
  expectTypeOf(withAny.b).toBeAny();
  expectTypeOf(utils.mergeObject({ a: 1 }, anyA, { applyOperators: true }).a).toBeAny();

  // A union `other` is merged as whichever member it is
  expectTypeOf(utils.mergeObject({ a: 1 }, unionUpdate).a).toEqualTypeOf<1 | 2>();
  const deletedByUnion = utils.mergeObject({ a: 1 }, unionDeletion, { applyOperators: true });
  // @ts-expect-error `a` is deleted by one member
  void deletedByUnion.a;

  // Arrays, functions, `Set`s, `Map`s and `Color`s are written over a value rather than merged with it
  expectTypeOf(utils.mergeObject({ a: { b: 1 } }, { a: [1, 2] }).a).toEqualTypeOf<[1, 2]>();
  expectTypeOf(utils.mergeObject({ a: { b: 1 } }, { a: callback }).a).toEqualTypeOf<() => void>();
  expectTypeOf(utils.mergeObject({ a: { b: 1 } }, { a: numberSet }).a).toEqualTypeOf<Set<number>>();
  expectTypeOf(utils.mergeObject({ a: numberSet }, { a: { b: 1 } }).a).toEqualTypeOf<{ b: 1 }>();
  expectTypeOf(utils.mergeObject({ a: { b: 1 } }, { a: color }).a).toEqualTypeOf<utils.Color>();

  // Other class instances are merged key by key, so a `Date` keeps its methods
  expectTypeOf(utils.mergeObject({ d: date }, { d: date }).d.getTime).toEqualTypeOf<() => number>();

  // When `insertKeys` or `insertValues` is only known at runtime, new keys may be absent
  const maybeInserted = utils.mergeObject({ a: 1 }, { b: 2 }, { insertKeys: maybeInsert });
  expectTypeOf(maybeInserted.b).toEqualTypeOf<2 | undefined>();
  // @ts-expect-error `b` may not have been inserted
  assertType<{ b: number }>(maybeInserted);
  // @ts-expect-error `b` may not have been inserted
  assertType<{ w: { b: number } }>(utils.mergeObject({ w: { a: 1 } }, { w: { b: 2 } }, { insertValues: maybeInsert }));
  // @ts-expect-error `b` may not have been inserted
  assertType<{ b: number }>(utils.mergeObject({ a: 1 }, { b: 2 }, options));

  // Generic wrappers compile
  const mergeGeneric = <T extends object, U extends object>(original: T, other: U) =>
    utils.mergeObject(original, other);
  assertType<{ a: number; b: string }>(mergeGeneric({ a: 1 }, { b: "x" }));

  // bonus round
  assertType<{ a: number; b: number }>(utils.mergeObject({ a: 1 }, { b: 2 }, { enforceTypes: true }));

  // @ts-expect-error these objects should be mergeable and not never
  assertType<never>(utils.mergeObject({ a: 1 }, { b: 2 }, { enforceTypes: true }));

  assertType<{ a: { a: number; b: number } }>(
    utils.mergeObject({ a: { a: 1 } }, { a: { b: 2 } }, { enforceTypes: true }),
  );

  // @ts-expect-error these objects should be mergeable and not never
  assertType<never>(utils.mergeObject({ a: { a: 1 } }, { b: { a: 2 } }, { enforceTypes: true }));

  assertType<{ a: { a: number }; b: { a: number }; c: number }>(
    utils.mergeObject({ a: { a: 1 }, c: 1 }, { b: { a: 2 }, c: 1 }, { enforceTypes: true }),
  );

  assertType<never>(
    // @ts-expect-error these objects should be mergeable and not never
    utils.mergeObject({ a: { a: 1 }, c: 1 }, { b: { a: 2 }, c: 1 }, { enforceTypes: true }),
  );

  // @ts-expect-error A number isn't a valid object to merge.
  utils.mergeObject(1, 2);

  // @ts-expect-error A string isn't a valid object to merge.
  utils.mergeObject("foo", "bar");

  // parseS3URL

  expectTypeOf(utils.parseS3URL("s3://someBucket/key")).toEqualTypeOf<{ bucket: string | null; keyPrefix: string }>();

  // randomID

  expectTypeOf(utils.randomID(16)).toEqualTypeOf<string>();
  expectTypeOf(utils.randomID()).toEqualTypeOf<string>();

  // timeSince

  expectTypeOf(utils.timeSince(new Date())).toEqualTypeOf<string>();
  expectTypeOf(utils.timeSince("")).toEqualTypeOf<string>();

  // formatFileSize

  expectTypeOf(utils.formatFileSize(4)).toEqualTypeOf<string>();
  expectTypeOf(utils.formatFileSize(4, {})).toEqualTypeOf<string>();
  expectTypeOf(utils.formatFileSize(4, { base: 2, decimalPlaces: 7 })).toEqualTypeOf<string>();
  expectTypeOf(utils.formatFileSize(4, { base: undefined, decimalPlaces: undefined }));

  // @ts-expect-error: base must be 2 or 10
  expectTypeOf(utils.formatFileSize(4, { base: 6 })).toEqualTypeOf<string>();
  expectTypeOf(utils.parseUuid("Compendium.Actor.AAAAASomeIDAAAAA")).toEqualTypeOf<utils.ResolvedUUID | null>();
  expectTypeOf(utils.parseUuid("Compendium.Actor.AAAAASomeIDAAAAA", {})).toEqualTypeOf<utils.ResolvedUUID | null>();
  expectTypeOf(
    utils.parseUuid("Compendium.Actor.AAAAASomeIDAAAAA", { relative: undefined }),
  ).toEqualTypeOf<utils.ResolvedUUID | null>();
  expectTypeOf(
    utils.parseUuid(".Item.IIIIISomeIDIIIII", { relative: someActor }),
  ).toEqualTypeOf<utils.ResolvedUUID | null>();
  expectTypeOf(utils.buildRelativeUuid(someItem, someActor)).toBeString();
  expectTypeOf(utils.buildRelativeUuid("Item.SomeID", someActor)).toBeString();
  expectTypeOf(utils.buildRelativeUuid("Item.PONMLKJIHGFEDCBA", "Actor.ABCDEFGHIJKLMNOP")).toBeString();
  expectTypeOf(utils.buildRelativeUuid(someItem, "Actor.ABCDEFGHIJKLMNOP")).toBeString();

  // buildUuid

  expectTypeOf(foundry.utils.buildUuid({ id: "foo" })).toEqualTypeOf<string | null>();
  expectTypeOf(foundry.utils.buildUuid({ id: "foo", documentName: "Item" })).toEqualTypeOf<string | null>();
  expectTypeOf(foundry.utils.buildUuid({ id: "foo", documentName: "Item", parent: null })).toEqualTypeOf<
    string | null
  >();
  expectTypeOf(foundry.utils.buildUuid({ id: "foo", documentName: "Item", parent: someActor })).toEqualTypeOf<
    string | null
  >();
  expectTypeOf(foundry.utils.buildUuid({ id: "foo", documentName: "Item", pack: "world.a" })).toEqualTypeOf<
    string | null
  >();

  // escapeHTML

  expectTypeOf(utils.escapeHTML(`foo < some string > some 'other string' & some "third string"`)).toBeString();

  // unescapeHTML

  expectTypeOf(
    utils.unescapeHTML(`foo &lt; some string &gt; some &#x27;other string&#x27; &amp; some &quot;third string&quot;`),
  ).toBeString();

  // Deprecated:

  // applySpecialKeys

  const hasSpecialKeys = {
    foo: 7,
    "-=foo": null,
    type: "character",
    "==type": "npc",
    system: { bar: 21 },
    "==system": { baz: 42 },
    fizz: true,
  } as const;
  // Keys given both a value and an operator depend on key order, so both outcomes are possible
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  expectTypeOf(utils.applySpecialKeys(hasSpecialKeys)).toEqualTypeOf<{
    foo?: 7;
    type: "character" | "npc";
    system: { bar: 21 } | { baz: 42 };
    fizz: true;
  }>();

  // isDeletionKey - not formally @deprecated, but presumably will be removed in v16

  const deletionKey = "-=foo";
  expectTypeOf(utils.isDeletionKey(deletionKey)).toBeBoolean();

  // objectsEqual

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  expectTypeOf(utils.objectsEqual({ a: 1 }, { a: 1 })).toEqualTypeOf<boolean>();
});
