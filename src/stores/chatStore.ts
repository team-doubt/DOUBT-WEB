import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import type { ChatStore, ChatMessage } from "../types/chat";
import { GamePhase } from "../types/chat";

let socket: Socket | null = null;

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  gamePhase: GamePhase.CHATTING,
  myName: null,
  connectedUsers: [],
  isConnected: false,

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setGamePhase: (phase: GamePhase) => {
    set({ gamePhase: phase });
  },

  setMyName: (name: string) => {
    set({ myName: name });
  },

  setConnectedUsers: (users: string[]) => {
    set({ connectedUsers: users });
  },

  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },
}));

// Socket.IO 연결 및 이벤트 핸들러
export const connectSocket = () => {
  if (socket?.connected) return;

  socket = io("ws://localhost:8000", {
    transports: ["websocket"],
  });

  const { addMessage, setMyName, setConnectedUsers, setConnected } =
    useChatStore.getState();

  socket.on("connect", () => {
    console.log("Socket 연결됨");
    setConnected(true);
  });

  socket.on("disconnect", () => {
    console.log("Socket 연결 해제됨");
    setConnected(false);
  });

  socket.on("connected", (data) => {
    console.log("서버에서 연결 확인:", data);
    setMyName(data.name);
    addMessage({
      name: "시스템",
      message: data.message,
      timestamp: new Date().toISOString(),
      isMine: false,
    });
  });

  socket.on("user_joined", (data) => {
    addMessage({
      name: "시스템",
      message: data.message,
      timestamp: new Date().toISOString(),
      isMine: false,
    });
  });

  socket.on("user_left", (data) => {
    addMessage({
      name: "시스템",
      message: data.message,
      timestamp: new Date().toISOString(),
      isMine: false,
    });
  });

  socket.on("chat", (data) => {
    addMessage({
      name: data.name,
      message: data.message,
      timestamp: data.timestamp,
      isMine: false,
    });
  });

  socket.on("user_list", (data) => {
    setConnectedUsers(data.users);
  });

  socket.on("error", (data) => {
    console.error("Socket 오류:", data.message);
    alert(data.message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendMessage = (message: string) => {
  if (socket && socket.connected && message.trim()) {
    const { myName } = useChatStore.getState();

    // 내 메시지를 먼저 화면에 표시
    useChatStore.getState().addMessage({
      name: myName!,
      message,
      timestamp: new Date().toISOString(),
      isMine: true,
    });

    // 서버로 메시지 전송
    socket.emit("chat_message", {
      message,
      timestamp: new Date().toISOString(),
    });
  }
};
