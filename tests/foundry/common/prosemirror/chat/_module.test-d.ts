import { assertType } from "vitest";
import ChatInputPlugin from "../../../../../src/foundry/common/prosemirror/chat/chat-input-plugin.mts";
import ChatMenuPlugin from "../../../../../src/foundry/common/prosemirror/chat/chat-menu-plugin.mts";

assertType<typeof ChatInputPlugin>(foundry.prosemirror.plugins.chat.ChatInputPlugin);
assertType<typeof ChatMenuPlugin>(foundry.prosemirror.plugins.chat.ChatMenuPlugin);
