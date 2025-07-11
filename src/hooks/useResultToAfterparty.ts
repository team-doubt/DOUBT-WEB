import { useEffect } from "react";
import { GamePhase } from "../types/chat";
import type { GamePhaseHookProps } from "./gamePhaseUtils";
import { addSystemMessage, isPhase, createPhaseTimer } from "./gamePhaseUtils";

// RESULT에서 AFTERPARTY로 전환을 관리하는 훅
export const useResultToAfterparty = ({
  gamePhase,
  setGamePhase,
}: GamePhaseHookProps) => {
  useEffect(() => {
    if (!isPhase(gamePhase, GamePhase.RESULT)) return;

    const cleanup = createPhaseTimer(3000, () => {
      setGamePhase(GamePhase.AFTERPARTY);
      addSystemMessage(
        "🎉 에프터파티가 시작되었습니다! 인간 여러분들은 1분간 자유롭게 대화해보세요!"
      );
    });

    return cleanup;
  }, [gamePhase, setGamePhase]);
};
