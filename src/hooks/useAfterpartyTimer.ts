import { useEffect } from "react";
import { GamePhase } from "../types/chat";
import { GAME_CONFIG } from "../constants/game";
import type { GamePhaseHookProps } from "./gamePhaseUtils";
import { addSystemMessage, isPhase, createPhaseTimer } from "./gamePhaseUtils";

// AFTERPARTY 시간 제한과 게임 종료를 관리하는 훅
export const useAfterpartyTimer = ({
  gamePhase,
  setGamePhase,
}: GamePhaseHookProps) => {
  useEffect(() => {
    if (!isPhase(gamePhase, GamePhase.AFTERPARTY)) return;

    const cleanup = createPhaseTimer(GAME_CONFIG.AFTERPARTY_DURATION, () => {
      addSystemMessage(
        "⏰ 에프터파티가 종료되었습니다. 새로운 게임을 시작하시겠습니까?"
      );

      // 게임 종료 또는 새 게임 시작
      setTimeout(() => {
        alert("뒷풀이가 끝났습니다! 새로운 게임을 시작하시겠습니까?");
        setGamePhase(GamePhase.CHATTING);
        // 메시지 초기화 등 필요한 리셋 로직 추가 가능
      }, 1000); // 시스템 메시지 표시 후 1초 뒤 알림
    });

    return cleanup;
  }, [gamePhase, setGamePhase]);
};
