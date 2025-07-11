import type { GamePhase } from "../types/chat";
import { useVotingPhase } from "./useVotingPhase";
import { useResultToAfterparty } from "./useResultToAfterparty";
import { useAfterpartyTimer } from "./useAfterpartyTimer";

// 게임 단계 전환을 통합 관리하는 커스텀 훅
export const useGamePhaseTransition = (
  gamePhase: GamePhase,
  setGamePhase: (phase: GamePhase) => void,
  setVoteProgress: (progress: number) => void,
  setResultRedIdxs: (idxs: number[]) => void
) => {
  // 공통 props 객체
  const baseProps = { gamePhase, setGamePhase };

  // 각 단계별 훅들을 조합
  useVotingPhase({ ...baseProps, setVoteProgress, setResultRedIdxs });
  useResultToAfterparty(baseProps);
  useAfterpartyTimer(baseProps);
};
