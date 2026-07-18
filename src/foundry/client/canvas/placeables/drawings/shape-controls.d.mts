import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { RectangleShapeData, EllipseShapeData, PolygonShapeData } from "#client/data/_module.d.mts";

/**
 * Controls for a Drawing shape.
 */
declare class DrawingShapeControls extends ShapeControls<
  DrawingDocument.Implementation,
  foundry.canvas.placeables.Drawing.Implementation,
  foundry.canvas.layers.DrawingsLayer.Implementation,
  RectangleShapeData | EllipseShapeData | PolygonShapeData
> {
  protected override _drawShape(graphics: PIXI.Graphics): void;

  protected override _onDragStart(event: PIXI.FederatedEvent): void;

  protected override _onDragMove(event: PIXI.FederatedEvent): void;

  protected override _updateDragPreview(event: PIXI.FederatedEvent): void;

  protected override _prepareDragDropUpdate(event: PIXI.FederatedEvent): DrawingShapeControls.DragDropUpdate;

  protected override _onDragDrop(event: PIXI.FederatedEvent): void;

  protected override _onClick2(event: PIXI.FederatedEvent): void;

  #DrawingShapeControls: true;
}

declare namespace DrawingShapeControls {
  interface DragDropUpdate {
    x: number;
    y: number;
    shape: {
      width?: number | undefined;
      height?: number | undefined;
      points?: number[] | undefined;
    };
    rotation: number;
  }
}

export default DrawingShapeControls;
