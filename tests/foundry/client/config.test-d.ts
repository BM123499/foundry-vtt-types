import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";
import DataModel = foundry.abstract.DataModel;
import TextEditor = foundry.applications.ux.TextEditor;

class D20Roll<D extends AnyObject> extends Roll<D> {}

declare global {
  namespace CONFIG {
    interface Dice {
      D20Roll: typeof D20Roll;
    }
  }
}

CONFIG.Dice.D20Roll = D20Roll;

const d20roll = new CONFIG.Dice.D20Roll("1d20");

d20roll.evaluate();

expectTypeOf(CONFIG.ActiveEffect.compendiumBanner).toBeString();
expectTypeOf(CONFIG.ActiveEffect.documentClass).toEqualTypeOf<
  foundry.abstract.Document.ImplementationClassFor<"ActiveEffect">
>();
expectTypeOf(CONFIG.ActiveEffect.dataModels).toEqualTypeOf<
  Record<string, typeof DataModel<any, ActiveEffect.Implementation>>
>();
expectTypeOf(CONFIG.ActiveEffect.defaultType).toBeString();
expectTypeOf(CONFIG.ActiveEffect.embedHandlers).toEqualTypeOf<CONFIG.DocumentEmbedHandler[]>();
expectTypeOf(CONFIG.ActiveEffect.sheetClasses).toEqualTypeOf<CONFIG.SheetClasses<"ActiveEffect">>();
expectTypeOf(CONFIG.ActiveEffect.typeLabels).toEqualTypeOf<
  Record<foundry.documents.BaseActiveEffect.SubType, string>
>();
expectTypeOf(CONFIG.ActiveEffect.typeHints).toEqualTypeOf<Record<string, string>>();
expectTypeOf(CONFIG.ActiveEffect.typeIcons).toEqualTypeOf<Record<string, string>>();
expectTypeOf(CONFIG.ActiveEffect.sidebarIcon).toBeString();
expectTypeOf(CONFIG.ActiveEffect.changeTypes).toEqualTypeOf<Record<string, ActiveEffect.ChangeTypeConfig>>();
expectTypeOf(CONFIG.ActiveEffect.expiryEvents).toEqualTypeOf<Record<string, string>>();
expectTypeOf(CONFIG.ActiveEffect.expiryAction).toEqualTypeOf<"update" | "delete" | null>();
expectTypeOf(CONFIG.ActiveEffect.phases).toEqualTypeOf<Record<string, ActiveEffect.ChangePhaseConfig>>();

declare const embedHandler: CONFIG.DocumentEmbedHandler;
declare const anyDoc: foundry.abstract.Document.Any;
declare const embedConfig: TextEditor.DocumentHTMLEmbedConfig;
declare const enrichOptions: TextEditor.EnrichmentOptions;
expectTypeOf(embedHandler(anyDoc, null, embedConfig)).toEqualTypeOf<Promise<HTMLElement | HTMLCollection | null>>();
expectTypeOf(embedHandler(anyDoc, null, embedConfig, enrichOptions)).toEqualTypeOf<
  Promise<HTMLElement | HTMLCollection | null>
>();
