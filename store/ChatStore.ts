import { create } from 'zustand';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  socket: WebSocket | null;
  setSocket: (ws: WebSocket | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),
  socket: null,
  setSocket: (ws) => set({ socket: ws }),
}));
