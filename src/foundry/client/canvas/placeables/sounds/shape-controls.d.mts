import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { CircleShapeData } from "#client/data/_module.d.mts";

/**
 * Controls for a AmbientSound shape.
 */
declare class AmbientSoundShapeControls extends ShapeControls<
  AmbientSoundDocument.Implementation,
  foundry.canvas.placeables.AmbientSound.Implementation,
  foundry.canvas.layers.SoundsLayer.Implementation,
  CircleShapeData
> {
  protected override _onDragStart(event: PIXI.FederatedEvent): void;

  protected override _updateDragPreview(event: PIXI.FederatedEvent): void;

  protected override _prepareDragDropUpdate(event: PIXI.FederatedEvent): AmbientSoundShapeControls.DragDropUpdate;

  protected override _onDragDrop(event: PIXI.FederatedEvent): void;

  #AmbientSoundShapeControls: true;
}

declare namespace AmbientSoundShapeControls {
  interface DragDropUpdate {
    x: number;
    y: number;
    radius: number;
  }
}

export default AmbientSoundShapeControls;
