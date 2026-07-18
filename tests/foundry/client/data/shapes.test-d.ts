import { expectTypeOf } from "vitest";

import { PolygonTree } from "#client/data/polygon-tree.mjs";
import {
  CircleShapeData,
  ConeShapeData,
  EllipseShapeData,
  EmanationShapeData,
  GridShapeData,
  LineShapeData,
  PolygonShapeData,
  RectangleShapeData,
  RingShapeData,
  TokenShapeData,
} from "#client/data/shapes.mjs";

declare const shape: RectangleShapeData;
declare const point: foundry.canvas.Canvas.Point;
declare const graphics: PIXI.Graphics;
declare const event: PIXI.FederatedEvent;

expectTypeOf(RectangleShapeData.TYPE).toEqualTypeOf<"rectangle">();
expectTypeOf(CircleShapeData.TYPE).toEqualTypeOf<"circle">();
expectTypeOf(EllipseShapeData.TYPE).toEqualTypeOf<"ellipse">();
expectTypeOf(ConeShapeData.TYPE).toEqualTypeOf<"cone">();
expectTypeOf(RingShapeData.TYPE).toEqualTypeOf<"ring">();
expectTypeOf(LineShapeData.TYPE).toEqualTypeOf<"line">();
expectTypeOf(EmanationShapeData.TYPE).toEqualTypeOf<"emanation">();
expectTypeOf(PolygonShapeData.TYPE).toEqualTypeOf<"polygon">();
expectTypeOf(TokenShapeData.TYPE).toEqualTypeOf<"token">();
expectTypeOf(GridShapeData.TYPE).toEqualTypeOf<"grid">();

expectTypeOf(ConeShapeData.TYPES.cone.TYPE).toEqualTypeOf<"cone">();
expectTypeOf(GridShapeData.TYPES.grid.TYPE).toEqualTypeOf<"grid">();

expectTypeOf(shape.scene).toEqualTypeOf<Scene.Implementation | null>();
expectTypeOf(shape.isEmpty).toBeBoolean();
expectTypeOf(shape.polygons).toEqualTypeOf<readonly PIXI.Polygon[]>();
expectTypeOf(shape.polygonTree).toEqualTypeOf<PolygonTree>();
expectTypeOf(shape.clipperPaths).toEqualTypeOf<readonly (readonly PIXI.Polygon.ClipperPoint[])[]>();
expectTypeOf(shape.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();
expectTypeOf(shape.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(shape.origin).toEqualTypeOf<Readonly<foundry.canvas.Canvas.Point>>();
expectTypeOf(shape.center).toEqualTypeOf<Readonly<foundry.canvas.Canvas.Point>>();
expectTypeOf(shape.area).toBeNumber();
declare const measuredSegment: (typeof shape.measuredSegments)[number];
declare const translateHandle: NonNullable<(typeof shape.controlHandles)["translate"]>;
expectTypeOf(measuredSegment.ray).toEqualTypeOf<foundry.canvas.geometry.Ray>();
expectTypeOf(translateHandle.position).toEqualTypeOf<foundry.canvas.Canvas.Point>();
expectTypeOf(shape.isAffectedByGrid).toBeBoolean();
expectTypeOf(shape.hasRotationalSymmetry).toBeBoolean();
expectTypeOf(shape._getSnappedPoint(point)).toEqualTypeOf<foundry.canvas.Canvas.Point>();
expectTypeOf(shape._calculateSize(5, 0)).toBeNumber();
expectTypeOf(shape._getSnappedRotation(13)).toBeNumber();
expectTypeOf(shape.testPoint(point)).toBeBoolean();
expectTypeOf(shape.move(point)).toBeVoid();
expectTypeOf(shape.rotate(90)).toBeVoid();
expectTypeOf(shape.drawShape(graphics)).toBeVoid();
expectTypeOf(shape.drawReferenceLines(graphics)).toBeVoid();
expectTypeOf(shape._createMeasuredSegment(0, 0, 0, 5, 0, 1).ray).toEqualTypeOf<foundry.canvas.geometry.Ray>();
expectTypeOf(shape.moveControlHandle("translate", point)).toBeVoid();
expectTypeOf(shape._moveRotationHandle(0, point, true)).toBeVoid();
expectTypeOf(shape._onDragStart(event)).toBeVoid();
expectTypeOf(shape._onDragMove(event)).toBeVoid();
expectTypeOf(shape.sampleInterior()).toEqualTypeOf<foundry.canvas.Canvas.Point>();
expectTypeOf(shape.sampleBoundary(point)).toEqualTypeOf<foundry.canvas.Canvas.Point>();

declare const tokenShape: TokenShapeData;
expectTypeOf(tokenShape._getTokenShape()).toEqualTypeOf<CircleShapeData | EllipseShapeData | PolygonShapeData>();
