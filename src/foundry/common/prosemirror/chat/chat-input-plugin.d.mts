import type { Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type ProseMirrorPlugin from "../plugin.d.mts";

declare class ChatInputPlugin extends ProseMirrorPlugin {
  constructor(schema: Schema, chat?: unknown);

  static override build(schema: Schema, options?: ChatInputPlugin.BuildOptions): Plugin;

  sendMessage(view: EditorView): Promise<void>;

  setMessage(view: EditorView, message: string, meta?: unknown): void;
}

declare namespace ChatInputPlugin {
  interface BuildOptions {
    chat?: unknown;
  }
}

export default ChatInputPlugin;
