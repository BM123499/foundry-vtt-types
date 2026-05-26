import { expectTypeOf } from "vitest";

const doc = new Level.implementation({ name: "Basement" });

// Client-side getters added with the V14 Scene Levels feature
expectTypeOf(doc.isView).toEqualTypeOf<boolean>();
expectTypeOf(doc.isVisible).toEqualTypeOf<boolean>();
expectTypeOf(doc.index).toEqualTypeOf<number>();

// Edges getter returns the lazily-instantiated CanvasEdges
expectTypeOf(doc.edges).toEqualTypeOf<foundry.canvas.geometry.edges.CanvasEdges>();

// clampElevation works with or without an explicit depth
expectTypeOf(doc.clampElevation(5)).toEqualTypeOf<number>();
expectTypeOf(doc.clampElevation(5, 2)).toEqualTypeOf<number>();

// Parent is always the containing Scene
expectTypeOf(doc.parent).toEqualTypeOf<Scene.Implementation | null>();
