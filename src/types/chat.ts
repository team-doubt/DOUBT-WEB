export interface ChatMessage {
  message: string;
  name: string; // 백엔드와 맞춤
  timestamp?: string;
  isMine?: boolean;
}

export enum GamePhase {
  CHATTING = "chatting",
  VOTING = "voting",
  RESULT = "result",
  AFTERPARTY = "afterparty", // 뒷풀이 단계
}

export interface ChatStore {
  // 최소한의 전역 상태만
  messages: ChatMessage[];
  gamePhase: GamePhase;
  myName: string | null;
  connectedUsers: string[];
  isConnected: boolean;

  // Actions
  addMessage: (message: ChatMessage) => void;
  setGamePhase: (phase: GamePhase) => void;
  setMyName: (name: string) => void;
  setConnectedUsers: (users: string[]) => void;
  setConnected: (connected: boolean) => void;
}
