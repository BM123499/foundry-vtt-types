import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { BaseShapeData } from "#client/data/_module.d.mts";

/**
 * Controls for a Region shape.
 */
declare class RegionShapeControls extends ShapeControls<
  RegionDocument.Implementation,
  foundry.canvas.placeables.Region.Implementation,
  foundry.canvas.layers.RegionLayer.Implementation,
  BaseShapeData
> {
  protected override _updateDragPreview(event: PIXI.FederatedEvent): void;

  protected override _onClick2(event: PIXI.FederatedEvent): void;

  #RegionShapeControls: true;
}

export default RegionShapeControls;
