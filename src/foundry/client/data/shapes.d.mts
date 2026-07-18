import type { BaseGrid } from "#common/grid/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { PolygonTree } from "./polygon-tree.d.mts";
import type * as data from "#common/data/_module.mjs";

declare namespace ClientShapeData {
  interface MeasuredSegment {
    ray: Ray;
    winding: -1 | 0 | 1;
    distance: number;
    angle?: number;
  }

  interface ControlHandle {
    position: Canvas.Point;
    rotation: number;
    visible: boolean;
  }

  interface MoveOptions {
    /** Snap the origin? */
    snap?: boolean;
  }

  interface RotateOptions {
    /** The pivot of rotation. Default: origin. */
    pivot?: Canvas.Point;
  }

  interface CalculateSizeOptions {
    /** Snap the size to with defined grid snapping precision? */
    snap?: boolean;

    /** Round the size to integer? */
    round?: boolean;

    /** Allow the size to be zero? */
    allowZero?: boolean;
  }

  interface MoveControlHandleOptions {
    /** Snap the control handle movement? */
    snap?: boolean;

    /** Move linked control handles independently? */
    unlinked?: boolean;
  }
}

declare abstract class ClientShapeData<
  ShapeSchema extends data.BaseShapeData.Schema = data.BaseShapeData.Schema,
> extends data.BaseShapeData<ShapeSchema> {
  /**
   * Convert a path to a clipper path.
   * @param path - A path.
   * @internal
   */
  static _toClipperPath(path: PIXI.Polygon.ClipperPoint[] | Canvas.Point[] | number[]): PIXI.Polygon.ClipperPoint[];

  /** The scene that this shape is placed in, if any. */
  get scene(): Scene.Implementation | null;

  /** The grid that this shape is placed in. */
  get grid(): BaseGrid;

  /** The gridless version of the grid that this shape is placed in. */
  get gridlessGrid(): BaseGrid;

  /** Is this shape empty? */
  get isEmpty(): boolean;

  /** The polygons of this shape. */
  get polygons(): ReadonlyArray<PIXI.Polygon>;

  /** The polygon tree of this shape. */
  get polygonTree(): PolygonTree;

  /** The Clipper paths of this shape. */
  get clipperPaths(): ReadonlyArray<ReadonlyArray<PIXI.Polygon.ClipperPoint>>;

  /** The Clipper polygon tree of this shape. */
  get clipperPolyTree(): ClipperLib.PolyTree;

  /** The triangulation of this shape. */
  get triangulation(): Readonly<{
    vertices: Float32Array;
    indices: Uint16Array | Uint32Array;
  }>;

  /** The bounds of this Region. */
  get bounds(): PIXI.Rectangle;

  /** The origin of this shape. */
  get origin(): Readonly<Canvas.Point>;

  /** The center point of this shape. */
  get center(): Readonly<Canvas.Point>;

  /** The area of this shape. */
  get area(): number;

  /** The measured segments of this shape. */
  get measuredSegments(): ReadonlyArray<Readonly<ClientShapeData.MeasuredSegment>>;

  /** The control handles of this shape. */
  get controlHandles(): Readonly<Record<string, Readonly<ClientShapeData.ControlHandle>>>;

  /** Called when the shape was changed. */
  protected _onShapeChange(): void;

  /**
   * Called when the grid this shape is placed in changes.
   * @param changed - The changes to the grid.
   */
  protected _onGridChange(changed: object): void;

  /** Is this shape currently affected by the grid? */
  get isAffectedByGrid(): boolean;

  /** Whether the shape is identical to itself after a rotation around its origin. */
  get hasRotationalSymmetry(): boolean;

  /**
   * Create a ray.
   * @param x         - The x-coordinate of the origin of the ray.
   * @param y         - The y-coordinate of the origin of the ray.
   * @param direction - The direction of the ray in degrees.
   * @param length    - The length of the ray in pixels.
   * @param alignment - The alignment to ray.
   * @internal
   */
  _createRay(x: number, y: number, direction: number, length: number, alignment?: number): Ray;

  /**
   * Snap the given point.
   * @param point - The point that is to be snapped.
   * @internal
   */
  _getSnappedPoint(point: Canvas.Point): Canvas.Point;

  /**
   * Get the size for the given ray defined by a length and direction.
   * @param length    - The length of the ray in pixels.
   * @param direction - The direction of the ray in radians.
   * @param options   - Additional options.
   * @internal
   */
  _calculateSize(length: number, direction: number, options?: ClientShapeData.CalculateSizeOptions): number;

  /**
   * Snap the given rotation.
   * @param rotation - The rotation to be snapped in degrees.
   * @internal
   */
  _getSnappedRotation(rotation: number): number;

  /**
   * Test whether given point is contained within this shape.
   * @param point - The point.
   */
  testPoint(point: Canvas.Point): boolean;

  /** Create the Clipper polygon tree of this shape. */
  protected _createClipperPolyTree(): ClipperLib.PolyTree | PIXI.Polygon.ClipperPoint[] | Canvas.Point[] | number[];

  /** Create the origin point of this shape. */
  protected _createOrigin(): Canvas.Point;

  /** Create the center point of this shape. */
  protected _createCenter(): Canvas.Point;

  /** Calculate the area of this shape. */
  protected _calculateArea(): number;

  /**
   * Move the shape to the given origin.
   * @param origin  - The origin.
   * @param options - Additional options.
   */
  move(origin: Canvas.Point, options?: ClientShapeData.MoveOptions): void;

  /**
   * Rotate the shape by the given angle in degrees around the origin or pivot.
   * @param angle   - The angle in degrees.
   * @param options - Additional options.
   */
  rotate(angle: number, options?: ClientShapeData.RotateOptions): void;

  /** Rotate the shape by the given angle in degrees around the origin. */
  protected _rotate(angle: number): void;

  /**
   * Draw the shape into the Graphics element.
   * @param graphics - The Graphics element.
   */
  drawShape(graphics: PIXI.Graphics): void;

  /**
   * Draw reference lines of the shape into the Graphics element, if it has any.
   * @param graphics - The Graphics element.
   */
  drawReferenceLines(graphics: PIXI.Graphics): void;

  /**
   * Create a measured segment.
   * @internal
   */
  _createMeasuredSegment(
    x: number,
    y: number,
    direction: number,
    length: number,
    alignment: number,
    winding: -1 | 0 | 1,
    angle?: number,
  ): ClientShapeData.MeasuredSegment;

  /** Create the measured segments of this shape. */
  protected _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  /** Create control handles of this shape. */
  protected _createControlHandles(): Record<string, ClientShapeData.ControlHandle>;

  /**
   * Move the control handle.
   * @param name        - The name of the control handle.
   * @param destination - The new position of the control handle.
   * @param options     - Additional options.
   */
  moveControlHandle(name: string, destination: Canvas.Point, options?: ClientShapeData.MoveControlHandleOptions): void;

  /**
   * Move the rotation control handle.
   * @internal
   */
  _moveRotationHandle(rotation: number, destination: Canvas.Point, snap: boolean): void;

  /**
   * Called when the drag workflow starts.
   * @param event - The pointer event.
   * @internal
   */
  _onDragStart(event: PIXI.FederatedEvent): void;

  /**
   * Called when the drag workflow moves.
   * @param event - The pointer event.
   * @internal
   */
  _onDragMove(event: PIXI.FederatedEvent): void;

  /**
   * Sample a point from the shape interior.
   * @param out - A point to write to.
   */
  sampleInterior(out?: Canvas.Point): Canvas.Point;

  /**
   * Sample a point from the shape boundary.
   * @param out - A point to write to.
   */
  sampleBoundary(out?: Canvas.Point): Canvas.Point;
}

/** The data model for a rectangular shape. */
declare class RectangleShapeData extends ClientShapeData<data.RectangleShapeData.Schema> {
  static override readonly TYPE: "rectangle";
}

/** The data model for a circle shape. */
declare class CircleShapeData extends ClientShapeData<data.CircleShapeData.Schema> {
  static override readonly TYPE: "circle";
}

/** The data model for an ellipse shape. */
declare class EllipseShapeData extends ClientShapeData<data.EllipseShapeData.Schema> {
  static override readonly TYPE: "ellipse";
}

/** The data model for a cone shape. */
declare class ConeShapeData extends ClientShapeData<data.ConeShapeData.Schema> {
  static override readonly TYPE: "cone";
}

/** The data model for a ring shape. */
declare class RingShapeData extends ClientShapeData<data.RingShapeData.Schema> {
  static override readonly TYPE: "ring";
}

/** The data model for a line shape. */
declare class LineShapeData extends ClientShapeData<data.LineShapeData.Schema> {
  static override readonly TYPE: "line";
}

/** The data model for an emanation shape. */
declare class EmanationShapeData extends ClientShapeData<data.EmanationShapeData.Schema> {
  static override readonly TYPE: "emanation";
}

/** The data model for a polygon shape. */
declare class PolygonShapeData extends ClientShapeData<data.PolygonShapeData.Schema> {
  static override readonly TYPE: "polygon";
}

/** The data model for a token shape. */
declare class TokenShapeData extends ClientShapeData<data.TokenShapeData.Schema> {
  static override readonly TYPE: "token";

  /** Get the token shape. */
  _getTokenShape(): CircleShapeData | EllipseShapeData | PolygonShapeData;
}

/** The data model for a shape that is the union of grid spaces. */
declare class GridShapeData extends ClientShapeData<data.GridShapeData.Schema> {
  static override readonly TYPE: "grid";
}

export {
  RectangleShapeData,
  CircleShapeData,
  EllipseShapeData,
  ConeShapeData,
  RingShapeData,
  LineShapeData,
  EmanationShapeData,
  PolygonShapeData,
  TokenShapeData,
  GridShapeData,
};
