import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import BaseLevel = foundry.documents.BaseLevel;
import Document = foundry.abstract.Document;

class TestBaseLevel extends BaseLevel {
  get compendium() {
    return this.inCompendium
      ? (game.packs!.get(this.pack!) as foundry.documents.collections.CompendiumCollection.ForDocument<"Level">)
      : null;
  }
}

// `name` is required and `blank: false`; everything else has defaults.
const myLevel = new TestBaseLevel({ name: "Basement" });
new TestBaseLevel({
  _id: "XXXXXSomeIDXXXXX",
  name: "Basement",
  elevation: { bottom: -10, top: 0 },
  background: {
    color: "#999999",
    src: "worlds/test/Basement.webp",
    tint: "#ffffff",
    alphaThreshold: 0.75,
  },
  foreground: {
    src: "worlds/test/BasementFG.webp",
    tint: "#ffffff",
    alphaThreshold: 0.75,
  },
  fog: {
    src: "worlds/test/BasementFog.webp",
    tint: "#ffffff",
  },
  textures: {
    anchorX: 0.5,
    anchorY: 0.5,
    offsetX: 0,
    offsetY: 0,
    fit: "fill",
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  },
  visibility: { levels: [] },
  sort: 0,
  flags: { core: { sheetLock: false } },
});

// `elevation.bottom` / `elevation.top` accept null (V14 treats as -Infinity / +Infinity).
new TestBaseLevel({
  name: "TopFloor",
  elevation: { bottom: null, top: null },
});

// `visibility.levels` is the new SceneLevelsSetField — accepts iterables and persists as string[].
new TestBaseLevel({
  name: "Ground",
  visibility: { levels: ["levelId001234567"] },
});
new TestBaseLevel({
  name: "Ground",
  visibility: { levels: new Set(["levelId001234567"]) },
});

expectTypeOf(myLevel).toEqualTypeOf<TestBaseLevel>();

expectTypeOf(myLevel._id).toEqualTypeOf<string | null>();
expectTypeOf(myLevel.name).toBeString();

// Elevation bounds are nullable per V14
expectTypeOf(myLevel.elevation.bottom).toEqualTypeOf<number | null>();
expectTypeOf(myLevel.elevation.top).toEqualTypeOf<number | null>();

// Background sub-schema
expectTypeOf(myLevel.background.color).toEqualTypeOf<Color>();
expectTypeOf(myLevel.background.src).toEqualTypeOf<string | null>();
expectTypeOf(myLevel.background.tint).toEqualTypeOf<Color>();
expectTypeOf(myLevel.background.alphaThreshold).toBeNumber();

// Foreground sub-schema
expectTypeOf(myLevel.foreground.src).toEqualTypeOf<string | null>();
expectTypeOf(myLevel.foreground.tint).toEqualTypeOf<Color>();
expectTypeOf(myLevel.foreground.alphaThreshold).toBeNumber();

// Fog sub-schema
expectTypeOf(myLevel.fog.src).toEqualTypeOf<string | null>();
expectTypeOf(myLevel.fog.tint).toEqualTypeOf<Color>();

// Textures sub-schema (AngleField initialized type is `number`; not nullable when `initial: 0`)
expectTypeOf(myLevel.textures.anchorX).toBeNumber();
expectTypeOf(myLevel.textures.anchorY).toBeNumber();
expectTypeOf(myLevel.textures.offsetX).toBeNumber();
expectTypeOf(myLevel.textures.offsetY).toBeNumber();
expectTypeOf(myLevel.textures.scaleX).toBeNumber();
expectTypeOf(myLevel.textures.scaleY).toBeNumber();
expectTypeOf(myLevel.textures.rotation).toBeNumber();

// SceneLevelsSetField initialized as a Set of Level ids (strings)
expectTypeOf(myLevel.visibility.levels).toEqualTypeOf<Set<string>>();

expectTypeOf(myLevel.sort).toBeNumber();
expectTypeOf(myLevel.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
