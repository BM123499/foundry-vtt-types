import { expectTypeOf } from "vitest";

import TemplateLayer = foundry.canvas.layers.TemplateLayer;
import Application = foundry.appv1.api.Application;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

// eslint-disable-next-line @typescript-eslint/no-deprecated
const doc = new MeasuredTemplateDocument.implementation();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(doc.layer).toEqualTypeOf<TemplateLayer>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(doc.rotation).toEqualTypeOf<MeasuredTemplateDocument.Implementation["direction"]>();

expectTypeOf(doc.sheet).toEqualTypeOf<Application.Any | DocumentSheetV2.Any | null>();
