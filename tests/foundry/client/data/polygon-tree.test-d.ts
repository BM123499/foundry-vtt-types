import { expectTypeOf } from "vitest";

import { PolygonTree, PolygonTreeNode } from "#client/data/polygon-tree.mjs";

declare const point: foundry.canvas.Canvas.Point;
declare const polygon: PIXI.Polygon;
declare const polyTree: ClipperLib.PolyTree;
declare const graphics: PIXI.Graphics;

const root = new PolygonTree();
const node = new PolygonTreeNode(root);

expectTypeOf(PolygonTree.fromClipperPolyTree(polyTree)).toEqualTypeOf<PolygonTree>();
expectTypeOf(PolygonTreeNode._fromClipperPath([], root)).toEqualTypeOf<PolygonTreeNode>();

expectTypeOf(node.parent).toEqualTypeOf<PolygonTreeNode | null>();
expectTypeOf(node.children).toEqualTypeOf<readonly PolygonTreeNode[]>();
expectTypeOf(node.depth).toBeNumber();
expectTypeOf(node.isHole).toBeBoolean();
expectTypeOf(node.isEmpty).toBeBoolean();
expectTypeOf(node.clipperPath).toEqualTypeOf<readonly PIXI.Polygon.ClipperPoint[] | null>();
expectTypeOf(node.polygon).toEqualTypeOf<PIXI.Polygon | null>();
expectTypeOf(node.points).toEqualTypeOf<readonly number[] | null>();
expectTypeOf(node.path).toEqualTypeOf<readonly foundry.canvas.Canvas.Point[] | null>();
expectTypeOf(node.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(node.area).toBeNumber();
expectTypeOf(node[Symbol.iterator]()).toEqualTypeOf<Generator<PolygonTreeNode>>();
expectTypeOf(node.findContainingNode(point)).toEqualTypeOf<PolygonTreeNode | null>();
expectTypeOf(node.testPoint(point)).toBeBoolean();
expectTypeOf(node.testCircle(point, 5)).toEqualTypeOf<-1 | 0 | 1>();
expectTypeOf(node.findClosestPoint(point)).toEqualTypeOf<foundry.canvas.Canvas.Point>();

expectTypeOf(root.polygons).toEqualTypeOf<readonly PIXI.Polygon[]>();
expectTypeOf(root.clipperPaths).toEqualTypeOf<readonly (readonly PIXI.Polygon.ClipperPoint[])[]>();
expectTypeOf(root.triangulation.vertices).toEqualTypeOf<Float32Array>();
expectTypeOf(root.triangulation.indices).toEqualTypeOf<Uint16Array | Uint32Array>();
expectTypeOf(root.drawShape(graphics)).toBeVoid();
expectTypeOf(root.intersectPolygon(polygon)).toEqualTypeOf<PolygonTree>();
expectTypeOf(root.intersectClipper([])).toEqualTypeOf<PolygonTree>();
expectTypeOf(root.sampleInterior()).toEqualTypeOf<foundry.canvas.Canvas.Point>();
expectTypeOf(root.sampleBoundary(point)).toEqualTypeOf<foundry.canvas.Canvas.Point>();
