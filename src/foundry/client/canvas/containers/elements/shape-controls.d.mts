import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { PlaceablesLayer } from "#client/canvas/layers/_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import type { BaseShapeData } from "#client/data/_module.d.mts";

/**
 * Controls for a shape.
 */
declare class ShapeControls<
  DocumentClass extends Document.Any = Document.Any,
  ObjectClass extends PlaceableObject = PlaceableObject,
  LayerClass extends PlaceablesLayer<Document.PlaceableType> = PlaceablesLayer<Document.PlaceableType>,
  ShapeClass extends BaseShapeData = BaseShapeData,
>
  extends PIXI.Container
{
  /**
   * @param shape - The shape.
   */
  constructor(shape: ShapeClass);

  /** @defaultValue `"INTERFACE"` */
  static RENDER_FLAG_PRIORITY: string;

  static RENDER_FLAGS: ShapeControls.RENDER_FLAGS;

  renderFlags: RenderFlags<ShapeControls.RENDER_FLAGS>;

  /** The shape. */
  get shape(): ShapeClass;

  /** The Document of this shape. */
  get document(): DocumentClass;

  /** The PlaceableObject of this shape. */
  get object(): ObjectClass;

  /** The PlaceableLayer of this shape. */
  get layer(): LayerClass;

  /** The border of the shape. */
  get border(): PIXI.Graphics;

  /** The handles of the shape. */
  get handles(): PIXI.Container<ShapeControlsHandle>;

  /**
   * The tint applied to these controls.
   * @defaultValue `0xFFFFFF`
   */
  get tint(): number;

  set tint(tint: number);

  /**
   * Are the controls editable?
   * @defaultValue `true`
   */
  editable: boolean;

  /**
   * Is the border dashed?
   * @defaultValue `false`
   */
  get dashed(): boolean;

  set dashed(value: boolean);

  applyRenderFlags(): void;

  /** Refresh the visualization of these controls. */
  protected _refresh(): void;

  /** Refresh the visualization of these controls. */
  refresh(): void;

  /**
   * Draw the shape.
   * @param graphics - The Graphics element.
   */
  protected _drawShape(graphics: PIXI.Graphics): void;

  /** Draw the visualization of these controls. */
  draw(): Promise<this>;

  /** Draw these controls. */
  protected _draw(): Promise<void>;

  /** Clear these controls. */
  protected _clear(): void;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  /**
   * Can the handle be dragged?
   * @param event   - The pointer event.
   * @param options - Options, used internally.
   */
  protected _canDragStart(event: PIXI.FederatedEvent, options?: ShapeControls.CanDragStartOptions): boolean;

  /**
   * Handle the drag start event of a handle.
   * @param event - The pointer event.
   */
  protected _onDragStart(event: PIXI.FederatedEvent): void;

  /**
   * Create and draw the drag preview for a placeable object.
   * @param object - The original placeable object.
   * @internal
   */
  static _createDragPreview<ObjectClass extends PlaceableObject>(object: ObjectClass): ObjectClass;

  /**
   * Handle the drag move event of a handle.
   * @param event - The pointer event.
   */
  protected _onDragMove(event: PIXI.FederatedEvent): void;

  /**
   * Update the drag preview. Called when the shape has changed.
   * @param event - The pointer event.
   */
  protected _updateDragPreview(event: PIXI.FederatedEvent): void;

  protected _onDragDrop(event: PIXI.FederatedEvent): void;

  /**
   * Prepare the database update that should occur as the result of a drop operation.
   * @param event - The pointer event.
   */
  protected _prepareDragDropUpdate(event: PIXI.FederatedEvent): object | [data: object, options?: object];

  /**
   * Handle the drag cancel event of a handle.
   * @param event - The pointer event.
   */
  protected _onDragCancel(event: PIXI.FederatedEvent): void;

  /**
   * Handle the double left-click event of a handle.
   * @param event - The pointer event.
   */
  protected _onClick2(event: PIXI.FederatedEvent): void;

  #ShapeControls: true;
}

declare namespace ShapeControls {
  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{}` */
    refresh: RenderFlag<this, "refresh">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  interface CanDragStartOptions {
    /** Show a notification if the handle cannot be dragged. */
    notify: boolean;
  }
}

/**
 * A handle of a shape controls element.
 */
declare class ShapeControlsHandle extends PIXI.smooth.SmoothGraphics {
  /**
   * @param controls - The controls this handle belongs to.
   * @param name     - The name of this handle.
   */
  constructor(controls: ShapeControls, name: string);

  /** The controls that this handle belongs to. */
  get controls(): ShapeControls;

  /** Is hovered? */
  get hovered(): boolean;

  /**
   * Draw the handle.
   * @param style - The style.
   */
  draw(style: ShapeControlsHandle.DrawStyle): Promise<void>;

  #ShapeControlsHandle: true;
}

declare namespace ShapeControlsHandle {
  interface DrawStyle {
    size: number;
    offset?: number;
    outlineThickness: number;
  }
}

export { ShapeControls, ShapeControlsHandle };
