export interface ChatMessage {
  message: string;
  username: string;
  avatar: string;
  time: string;
  isMine?: boolean;
}

export enum GamePhase {
  CHATTING = "chatting",
  VOTING = "voting",
  RESULT = "result",
}

export interface ChatStore {
  // 최소한의 전역 상태만
  messages: string[];
  gamePhase: GamePhase;

  // Actions
  addMessage: (message: string) => void;
  setGamePhase: (phase: GamePhase) => void;
}
