import { GamePhase } from "../types/chat";
import { useChatStore } from "../stores/chatStore";

// 게임 단계 훅의 공통 인터페이스
export interface GamePhaseHookProps {
  gamePhase: GamePhase;
  setGamePhase: (phase: GamePhase) => void;
}

// 시스템 메시지 추가 유틸리티
export const addSystemMessage = (message: string) => {
  useChatStore.getState().addMessage({
    name: "시스템",
    message,
    timestamp: new Date().toISOString(),
    isMine: false,
  });
};

// 게임 단계 체크 유틸리티
export const isPhase = (
  currentPhase: GamePhase,
  targetPhase: GamePhase
): boolean => {
  return currentPhase === targetPhase;
};

// 타이머 생성 유틸리티
export const createPhaseTimer = (
  duration: number,
  callback: () => void
): (() => void) => {
  const timer = setTimeout(callback, duration);
  return () => clearTimeout(timer);
};
