import { useEffect } from "react";
import { GamePhase } from "../types/chat";
import { GAME_CONFIG } from "../constants/game";
import { useChatStore } from "../stores/chatStore";

// 게임 단계별 모든 로직을 통합 관리하는 커스텀 훅
export const useGamePhases = (
  gamePhase: GamePhase,
  setGamePhase: (phase: GamePhase) => void,
  setVoteProgress: (progress: number) => void,
  setResultRedIdxs: (idxs: number[]) => void
) => {
  // 투표 단계 로직
  useEffect(() => {
    if (gamePhase !== GamePhase.VOTING) return;

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
        const idxs = Array.from({ length: 4 }, (_, i) => i);
        for (let i = idxs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
        }
        setResultRedIdxs(idxs.slice(0, count));
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gamePhase, setGamePhase, setVoteProgress, setResultRedIdxs]);

  // RESULT → AFTERPARTY 전환 로직
  useEffect(() => {
    if (gamePhase !== GamePhase.RESULT) return;

    const timer = setTimeout(() => {
      setGamePhase(GamePhase.AFTERPARTY);
      useChatStore.getState().addMessage({
        name: "시스템",
        message:
          "🎉 에프터파티가 시작되었습니다! 인간 여러분들은 1분간 자유롭게 대화해보세요!",
        timestamp: new Date().toISOString(),
        isMine: false,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [gamePhase, setGamePhase]);

  // AFTERPARTY 타이머 로직
  useEffect(() => {
    if (gamePhase !== GamePhase.AFTERPARTY) return;

    const timer = setTimeout(() => {
      useChatStore.getState().addMessage({
        name: "시스템",
        message:
          "⏰ 에프터파티가 종료되었습니다. 새로운 게임을 시작하시겠습니까?",
        timestamp: new Date().toISOString(),
        isMine: false,
      });

      setTimeout(() => {
        alert("뒷풀이가 끝났습니다! 새로운 게임을 시작하시겠습니까?");
        setGamePhase(GamePhase.CHATTING);
      }, 1000);
    }, GAME_CONFIG.AFTERPARTY_DURATION);

    return () => clearTimeout(timer);
  }, [gamePhase, setGamePhase]);
};
