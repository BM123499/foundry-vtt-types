import type { PluginKey } from "prosemirror-state";
import type ProseMirrorMenu from "../menu.d.mts";

declare class ChatMenuPlugin extends ProseMirrorMenu {
  static key: PluginKey;

  override render(): this;

  protected override _getMenuItems(): ProseMirrorMenu.Item[];
}

export default ChatMenuPlugin;
