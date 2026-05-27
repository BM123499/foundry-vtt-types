import { expectTypeOf } from "vitest";
import type { NodeSpec } from "prosemirror-model";
import DisclosureWidget, {
  type DisclosureNodes,
} from "../../../../../src/foundry/common/prosemirror/schema/disclosure.mts";

expectTypeOf(DisclosureWidget.nodes).toEqualTypeOf<DisclosureNodes>();
expectTypeOf(DisclosureWidget.nodes.details).toEqualTypeOf<NodeSpec>();
