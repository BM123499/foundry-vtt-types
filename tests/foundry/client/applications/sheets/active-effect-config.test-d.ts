import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

const activeEffectConfig = new foundry.applications.sheets.ActiveEffectConfig({
  document: new ActiveEffect.implementation({ name: "Test Active Effect" }),
});

expectTypeOf(activeEffectConfig).toEqualTypeOf<foundry.applications.sheets.ActiveEffectConfig>();

expectTypeOf(
  foundry.applications.sheets.ActiveEffectConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.ActiveEffectConfig.PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.ActiveEffectConfig.TABS).toEqualTypeOf<
  Record<string, ApplicationV2.TabsConfiguration>
>();

declare const renderChangeContext: foundry.applications.sheets.ActiveEffectConfig.RenderChangeContext;
expectTypeOf(renderChangeContext.change).toEqualTypeOf<ActiveEffect.ChangeData>();
expectTypeOf(renderChangeContext.index).toEqualTypeOf<number>();
expectTypeOf(renderChangeContext.fields).toEqualTypeOf<foundry.data.fields.DataSchema>();
expectTypeOf(renderChangeContext.defaultPriority).toEqualTypeOf<number>();
expectTypeOf(renderChangeContext.changeTypes).toEqualTypeOf<Record<string, string>>();

declare const startContext: foundry.applications.sheets.ActiveEffectConfig.StartContext;
expectTypeOf(startContext.time).toBeString();
expectTypeOf(startContext.combat).toEqualTypeOf<Combat.Implementation | null>();
expectTypeOf(startContext.combatant).toEqualTypeOf<Combatant.Implementation | null>();
expectTypeOf(startContext.combatantName).toBeString();
expectTypeOf(startContext.combatantInitiative).toEqualTypeOf<number | string>();
