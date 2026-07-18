import { expectTypeOf } from "vitest";

import ShapeControls = foundry.canvas.containers.ShapeControls;
import ShapeControlsHandle = foundry.canvas.containers.ShapeControlsHandle;

declare const shape: foundry.data.RectangleShapeData;
declare const controls: ShapeControls;
declare const handle: ShapeControlsHandle;
declare const graphics: PIXI.Graphics;
declare const event: PIXI.FederatedEvent;
declare const drawing: foundry.canvas.placeables.Drawing.Implementation;

new ShapeControls(shape);
new ShapeControlsHandle(controls, "translate");

expectTypeOf(controls.shape).toEqualTypeOf<foundry.data.BaseShapeData>();
expectTypeOf(controls.document).toEqualTypeOf<foundry.abstract.Document.Any>();
expectTypeOf(controls.object).toEqualTypeOf<foundry.canvas.placeables.PlaceableObject>();
expectTypeOf(controls.layer).toEqualTypeOf<
  foundry.canvas.layers.PlaceablesLayer<foundry.abstract.Document.PlaceableType>
>();
expectTypeOf(controls.border).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(controls.handles).toEqualTypeOf<PIXI.Container<ShapeControlsHandle>>();
expectTypeOf(controls.tint).toBeNumber();
controls.tint = 0xffffff;
expectTypeOf(controls.editable).toBeBoolean();
expectTypeOf(controls.dashed).toBeBoolean();
controls.dashed = true;
expectTypeOf(controls.applyRenderFlags()).toBeVoid();
expectTypeOf(controls.refresh()).toBeVoid();
expectTypeOf(controls["_drawShape"](graphics)).toBeVoid();
expectTypeOf(controls.draw()).toEqualTypeOf<Promise<ShapeControls>>();
expectTypeOf(controls["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(controls["_clear"]()).toBeVoid();
expectTypeOf(controls["_canDragStart"](event)).toBeBoolean();
expectTypeOf(controls["_onDragStart"](event)).toBeVoid();
expectTypeOf(
  ShapeControls._createDragPreview(drawing),
).toEqualTypeOf<foundry.canvas.placeables.Drawing.Implementation>();
expectTypeOf(controls["_onDragMove"](event)).toBeVoid();
expectTypeOf(controls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(controls["_onDragDrop"](event)).toBeVoid();
expectTypeOf(controls["_prepareDragDropUpdate"](event)).toExtend<object | [data: object, options?: object]>();
expectTypeOf(controls["_onDragCancel"](event)).toBeVoid();
expectTypeOf(controls["_onClick2"](event)).toBeVoid();

expectTypeOf(handle.controls).toEqualTypeOf<ShapeControls>();
expectTypeOf(handle.hovered).toBeBoolean();
expectTypeOf(handle.draw({ size: 10, outlineThickness: 1 })).toEqualTypeOf<Promise<void>>();
