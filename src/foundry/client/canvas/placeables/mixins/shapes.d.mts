import type { AnyConstructor, Mixin } from "#utils";
import type { BaseShapeData } from "#client/data/_module.d.mts";
import type { ShapeControlsHandle } from "#client/canvas/containers/_module.d.mts";
import type { PlaceableObject } from "../_module.d.mts";

/**
 * A mixin for UX shared between PlaceableObjects that have shapes.
 * @param Base - The PlaceableObject subclass.
 */
declare function ShapeObjectMixin<BaseClass extends ShapeObjectMixin.BaseClass>(
  Base: BaseClass,
): Mixin<typeof ShapeObjectMixin.ShapeObject, BaseClass>;

declare namespace ShapeObjectMixin {
  type BaseClass = PlaceableObject.AnyConstructor;

  abstract class ShapeObject extends PlaceableObject {
    /** The measurement lines. */
    protected _measurementLines: PIXI.Graphics;

    /** The measurement labels. */
    protected _measurementLabels: PIXI.Container;

    /** The solid measurement line style. */
    protected _measurementSolidLineStyle: PIXI.ILineStyleOptions;

    /** The dashed measurement line style. */
    protected _measurementDashLineStyle: PIXI.ILineStyleOptions;

    /** The controls handle that is currently hovered, if any. */
    get hoveredHandle(): ShapeControlsHandle | null;

    /** @internal */
    _hoveredHandle: ShapeControlsHandle | null;

    override get bounds(): PIXI.Rectangle;

    override get center(): PIXI.Point;

    protected override _getTargetAlpha(): number;

    protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

    protected override _onClickLeft(event: PIXI.FederatedEvent): false | void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): false | void;

    protected override _canDragLeftStart(
      user: User.Implementation,
      event: PIXI.FederatedEvent,
      options?: object,
    ): boolean;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    /**
     * Update the drag previews. Called when the shape has changed.
     * @param event - The pointer event.
     */
    protected _updateDragPreviews(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PIXI.FederatedEvent): void;

    protected override _initializeDragLeft(event: PIXI.FederatedEvent): void;

    /**
     * Initialize the shape for dragging.
     * @param event - The pointer event.
     */
    _initializeDragShape(event: PIXI.FederatedEvent): BaseShapeData;

    protected override _prepareDragLeftDropUpdates(event: PIXI.FederatedEvent): PlaceableObject.DragLeftDropUpdate[];

    protected override _finalizeDragLeft(event: PIXI.FederatedEvent): void;

    protected override _draw(options?: object): Promise<void>;

    /** Define a PIXI TextStyle object which is used for the measurement labels. */
    protected _getMeasurementTextStyle(): PIXI.TextStyle;

    /** Get the shape that should be measured. */
    protected _getMeasuredShapes(): BaseShapeData[];

    /**
     * Format a distance that is displayed in a measurement label.
     * @param distance - The distance.
     */
    protected _formatMeasuredDistance(distance: number): string;

    /** Refresh the measurements. */
    protected _refreshMeasurements(): void;

    override _onUpdate(changed: object, options: object, userId: string): void;

    override _onDelete(options: object, userId: string): void;

    /**
     * Has the shape or a shape changed?
     * @param changed - The changes of the update operation.
     * @internal
     */
    _hasShapeChanged(changed: object): boolean;
  }

  interface AnyMixed extends InstanceType<typeof ShapeObject> {}

  type AnyMixedConstructor = AnyConstructor & typeof ShapeObject;
}

export default ShapeObjectMixin;
