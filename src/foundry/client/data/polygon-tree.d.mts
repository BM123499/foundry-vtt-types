import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * The node of a {@link foundry.data.PolygonTree}.
 */
declare class PolygonTreeNode implements Iterable<PolygonTreeNode> {
  /**
   * Create a PolygonTreeNode.
   * @param parent - The parent node.
   * @internal
   */
  constructor(parent: PolygonTreeNode | null);

  /**
   * Create a node from the Clipper path and add it to the children of the parent.
   * @param clipperPath - The clipper path of this node.
   * @param parent      - The parent node or `null` if root.
   * @internal
   */
  static _fromClipperPath(clipperPath: PIXI.Polygon.ClipperPoint[], parent: PolygonTreeNode | null): PolygonTreeNode;

  /** The parent of this node or `null` if this is the root node. */
  get parent(): PolygonTreeNode | null;

  /** The children of this node. */
  get children(): ReadonlyArray<PolygonTreeNode>;

  /** The depth of this node. The depth of the root node is 0. */
  get depth(): number;

  /** Is this a hole? The root node is a hole. */
  get isHole(): boolean;

  /** Is the (sub)tree empty? */
  get isEmpty(): boolean;

  /** The Clipper path of this node. It is empty in case of the root node. */
  get clipperPath(): ReadonlyArray<PIXI.Polygon.ClipperPoint> | null;

  /** The polygon of this node. It is `null` in case of the root node. */
  get polygon(): PIXI.Polygon | null;

  /** The points of the polygon ([x0, y0, x1, y1, ...]). */
  get points(): ReadonlyArray<number> | null;

  /** The path of the polygon as x/y points. */
  get path(): ReadonlyArray<Canvas.Point> | null;

  /** The bounds of the polygon, or the combined bounds of all children in case of the root node. */
  get bounds(): PIXI.Rectangle;

  /** The area of this node. */
  get area(): number;

  /** Iterate recursively over the children in depth-first order. */
  [Symbol.iterator](): Generator<PolygonTreeNode>;

  /**
   * Find the node in this (sub)tree that contains the given point.
   * @param point - The point.
   */
  findContainingNode(point: Canvas.Point): PolygonTreeNode | null;

  /**
   * Test whether given point is contained within this (sub)tree.
   * @param point    - The point.
   * @param distance - The tolerance of the containment test.
   */
  testPoint(point: Canvas.Point, distance?: number): boolean;

  /**
   * Test circle containment/intersection with this (sub)tree.
   * @param center - The center point of the circle.
   * @param radius - The radius of the circle.
   * @returns -1: exterior, 0: intersects boundary, 1: interior.
   */
  testCircle(center: Canvas.Point, radius: number): -1 | 0 | 1;

  /**
   * Find a point inside this polygon tree that is closest to the given reference point.
   * @param point - The reference point.
   */
  findClosestPoint(point: Canvas.Point): Canvas.Point;

  #PolygonTreeNode: true;
}

/**
 * A polygon tree.
 */
declare class PolygonTree extends PolygonTreeNode {
  /** Create a PolygonTree. */
  constructor();

  /**
   * Create the tree from a Clipper polygon tree.
   * @param clipperPolyTree - The Clipper polygon tree.
   */
  static fromClipperPolyTree(clipperPolyTree: ClipperLib.PolyTree): PolygonTree;

  /** The polygons of this polygon tree. */
  get polygons(): ReadonlyArray<PIXI.Polygon>;

  /** The Clipper paths of this polygon tree. */
  get clipperPaths(): ReadonlyArray<ReadonlyArray<PIXI.Polygon.ClipperPoint>>;

  /** The triangulation of this polygon tree. */
  get triangulation(): Readonly<{
    vertices: Float32Array;
    indices: Uint16Array | Uint32Array;
  }>;

  /**
   * Draw the polygon tree into the Graphics element.
   * @param graphics - The Graphics element.
   */
  drawShape(graphics: PIXI.Graphics): void;

  /**
   * Compute the intersection of the polygon tree with the given polygon.
   * @param polygon - The polygon to intersect the polygon tree with.
   * @param options - Additional options.
   */
  intersectPolygon(polygon: PIXI.Polygon, options?: PolygonTree.IntersectionOptions): PolygonTree;

  /**
   * Compute the intersection of the polygon tree with the given Clipper path.
   * @param path    - The Clipper path to intersect the polygon tree with.
   * @param options - Additional options.
   */
  intersectClipper(path: PIXI.Polygon.ClipperPoint[], options?: PolygonTree.IntersectionOptions): PolygonTree;

  /**
   * Sample a point from the polygon tree interior.
   * @param out - A point to write to.
   */
  sampleInterior(out?: Canvas.Point): Canvas.Point;

  /**
   * Sample a point from the polygon tree boundary.
   * @param out - A point to write to.
   */
  sampleBoundary(out?: Canvas.Point): Canvas.Point;

  #PolygonTree: true;
}

declare namespace PolygonTree {
  interface IntersectionOptions {
    /** The Clipper clip type. */
    clipType?: number;

    /** The Clipper fill type used for the polygon. */
    fillType?: number;
  }
}

export { PolygonTree, PolygonTreeNode };
