import type { AnyConstructor, Mixin } from "#utils";
import type { BaseShapeData } from "#client/data/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { PlaceablesLayer } from "../_module.d.mts";

/**
 * A mixin for UX shared between PlaceablesLayer with objects that have shapes.
 * @param Base - The PlaceablesLayer subclass.
 */
declare function ShapeLayerMixin<BaseClass extends ShapeLayerMixin.BaseClass>(
  Base: BaseClass,
): Mixin<typeof ShapeLayerMixin.ShapeLayer, BaseClass>;

declare namespace ShapeLayerMixin {
  type BaseClass = PlaceablesLayer.AnyConstructor;

  interface LayerOptions extends PlaceablesLayer.LayerOptions {
    /** The shape types that are allowed to be empty for the creation of a drawn object. */
    allowedEmptyShapes: string[];

    /**
     * Discard the closing point of a polygon shape?
     * @defaultValue `true`
     */
    discardClosingPoint: boolean;
  }

  interface MouseWheelContext {
    preview: PlaceableObject;
    shape: BaseShapeData;
  }

  abstract class ShapeLayer extends PlaceablesLayer<Document.PlaceableType> {
    static override get layerOptions(): LayerOptions;

    /** The mouse wheel context. */
    _mouseWheelContext: MouseWheelContext | null;

    override getSnappedPoint(point: Canvas.Point): Canvas.Point;

    protected override _deactivate(): void;

    protected override _tearDown(options: object): Promise<void>;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;

    protected override _canDragLeftStart(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    protected override _commitDragLeftDrop(event: PIXI.FederatedEvent): Promise<void>;

    protected override _onDragLeftCancel(event: PIXI.FederatedEvent): void;

    /**
     * Create the shape data from the drag start event.
     * @param event - The pointer event.
     */
    protected _createDragShapeData(event: PIXI.FederatedEvent): object;

    /**
     * Update the drag preview. Called when the shape has changed.
     * @param event - The pointer event.
     */
    protected _updateDragPreview(event: PIXI.FederatedEvent): void;

    protected override _onMouseWheel(event: WheelEvent): void | false;

    /** Cancel mouse wheel rotation. */
    protected _cancelMouseWheel(): void;

    /**
     * Rotate the shape of the preview.
     * @param event - The mouse wheel event.
     */
    _updateMouseWheelShape(event: WheelEvent): void;

    /** Update the mouse wheel rotation preview. */
    protected _updateMouseWheelPreview(): void;

    /** Prepare the database update that should occur as the result of a mouse wheel rotation. */
    protected _prepareMouseWheelUpdate(): object | [data: object, options?: object];
  }

  interface AnyMixed extends InstanceType<typeof ShapeLayer> {}

  type AnyMixedConstructor = AnyConstructor & typeof ShapeLayer;
}

export default ShapeLayerMixin;
