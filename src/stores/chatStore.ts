import { create } from "zustand";
import type { ChatStore } from "../types/chat";
import { GamePhase } from "../types/chat";

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  gamePhase: GamePhase.CHATTING,

  addMessage: (message: string) => {
    if (message.trim() === "") return;
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setGamePhase: (phase: GamePhase) => {
    set({ gamePhase: phase });
  },
}));
