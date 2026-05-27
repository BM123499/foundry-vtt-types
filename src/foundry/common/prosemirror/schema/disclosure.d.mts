import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";

export interface DisclosureNodes {
  details: NodeSpec;
  summary: NodeSpec;
}

declare class DisclosureWidget {
  constructor(node: PMNode, view: EditorView, getPos: () => number);

  contentDOM: HTMLDetailsElement;
  dom: HTMLDetailsElement;
  getPos: () => number;

  update(node: PMNode): boolean;

  static view(node: PMNode, view: EditorView, getPos: () => number): DisclosureWidget;

  static get nodes(): DisclosureNodes;
}

export default DisclosureWidget;
