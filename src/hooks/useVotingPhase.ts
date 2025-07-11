import { useEffect } from "react";
import { GamePhase } from "../types/chat";
import { GAME_CONFIG } from "../constants/game";
import type { GamePhaseHookProps } from "./gamePhaseUtils";
import { isPhase } from "./gamePhaseUtils";

// 투표 단계 확장 인터페이스
interface VotingPhaseProps extends GamePhaseHookProps {
  setVoteProgress: (progress: number) => void;
  setResultRedIdxs: (idxs: number[]) => void;
}

// 투표 단계 진행률과 결과 전환을 관리하는 훅
export const useVotingPhase = ({
  gamePhase,
  setGamePhase,
  setVoteProgress,
  setResultRedIdxs,
}: VotingPhaseProps) => {
  useEffect(() => {
    if (!isPhase(gamePhase, GamePhase.VOTING)) return;

    setVoteProgress(0);
    setResultRedIdxs([]);
    const start = Date.now();
    const duration = GAME_CONFIG.VOTE_DURATION;
    let raf: number;

    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setVoteProgress(progress);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // 결과 단계로 전환
        setGamePhase(GamePhase.RESULT);
        // 1~4개 랜덤 인덱스(중복X)
        const count = Math.floor(Math.random() * 4) + 1;
        const idxs = Array.from({ length: 4 }, (_, i) => i)
          .sort(() => Math.random() - 0.5)
          .slice(0, count);
        setResultRedIdxs(idxs);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gamePhase, setGamePhase, setVoteProgress, setResultRedIdxs]);
};
