import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { RectangleShapeData } from "#client/data/_module.d.mts";

/**
 * Controls for a Tile shape.
 */
declare class TileShapeControls extends ShapeControls<
  TileDocument.Implementation,
  foundry.canvas.placeables.Tile.Implementation,
  foundry.canvas.layers.TilesLayer.Implementation,
  RectangleShapeData
> {
  protected override _onDragStart(event: PIXI.FederatedEvent): void;

  protected override _updateDragPreview(event: PIXI.FederatedEvent): void;

  protected override _prepareDragDropUpdate(event: PIXI.FederatedEvent): TileShapeControls.DragDropUpdate;

  protected override _onDragDrop(event: PIXI.FederatedEvent): void;

  protected override _onClick2(event: PIXI.FederatedEvent): void;

  #TileShapeControls: true;
}

declare namespace TileShapeControls {
  interface DragDropUpdate {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }
}

export default TileShapeControls;
