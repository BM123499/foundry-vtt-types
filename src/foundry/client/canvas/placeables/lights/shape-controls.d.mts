import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { CircleShapeData, ConeShapeData } from "#client/data/_module.d.mts";

/**
 * Controls for a AmbientLight shape.
 */
declare class AmbientLightShapeControls extends ShapeControls<
  AmbientLightDocument.Implementation,
  foundry.canvas.placeables.AmbientLight.Implementation,
  foundry.canvas.layers.LightingLayer.Implementation,
  CircleShapeData | ConeShapeData
> {
  protected override _onDragStart(event: PIXI.FederatedEvent): void;

  protected override _updateDragPreview(event: PIXI.FederatedEvent): void;

  protected override _prepareDragDropUpdate(event: PIXI.FederatedEvent): AmbientLightShapeControls.DragDropUpdate;

  protected override _onDragDrop(event: PIXI.FederatedEvent): void;

  #AmbientLightShapeControls: true;
}

declare namespace AmbientLightShapeControls {
  interface DragDropUpdate {
    x: number;
    y: number;
    rotation: number;
    config: {
      dim: number;
      bright: number;
      angle: number;
    };
  }
}

export default AmbientLightShapeControls;
