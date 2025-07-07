import { useEffect } from "react";
import { GamePhase } from "../types/chat";
import ProfileCard from "./ProfileCard";

interface User {
  avatar: string;
  username: string;
}

interface GameOverlayProps {
  gamePhase: GamePhase;
  users: User[];
  myUser: User;
  voteTargets: number[];
  resultRedIdxs: number[];
  voteProgress: number;
  onProfileClick: (idx: number) => void;
}

export default function GameOverlay({
  gamePhase,
  users,
  myUser,
  voteTargets,
  resultRedIdxs,
  voteProgress,
  onProfileClick,
}: GameOverlayProps) {
  // Result 단계로 변경될 때 효과음 재생
  useEffect(() => {
    if (gamePhase === GamePhase.RESULT) {
      const audio = new Audio("/src/assets/sounds/error-83494.mp3");
      audio.volume = 0.5; // 볼륨 조절 (0.0 ~ 1.0)
      audio.play().catch(() => {
        // 오디오 재생 실패 시 무시 (브라우저 정책으로 인한 실패 가능)
      });
    }
  }, [gamePhase]);

  return (
    <>
      {/* 전환 효과 오버레이 */}
      {gamePhase === GamePhase.RESULT && (
        <div className="transition-overlay animate-result-transition" />
      )}

      <aside
        className="overlay"
        style={{
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          transform: "none",
        }}
      >
        {/* 배경 레이어 */}
        {gamePhase === GamePhase.RESULT && (
          <div
            className="absolute inset-0 bg-[url('/src/assets/background/result.png')] bg-cover bg-center bg-no-repeat"
            style={{ zIndex: -1 }}
          />
        )}

        <h2 className="overlay-text">
          {gamePhase === GamePhase.RESULT ? "Result" : "Who's AI?"}
        </h2>
        <h3 className="font-Zodiak text-[2.25rem] font-zodiak underline text-[#8B8A8A] font-bold cursor-pointer select-none">
          {gamePhase === GamePhase.RESULT
            ? resultRedIdxs.length > 0
              ? `AI는 ${resultRedIdxs
                  .map((i) => users[i]?.username)
                  .filter(Boolean)
                  .join(", ")} 입니다!`
              : "Be More Doubtful"
            : "I think everyone is Human."}
        </h3>

        <section
          className="flex flex-row gap-6 mt-8"
          role="group"
          aria-label="플레이어 프로필 목록"
        >
          {/* 다른 플레이어들 */}
          {users.map((user, idx) => (
            <ProfileCard
              key={idx}
              avatar={user.avatar}
              username={user.username}
              gamePhase={gamePhase}
              isSelected={voteTargets.includes(idx)}
              isAI={resultRedIdxs.includes(idx)}
              onClick={() => onProfileClick(idx)}
            />
          ))}

          {/* 내 프로필 */}
          <ProfileCard
            avatar={myUser.avatar}
            username={myUser.username}
            gamePhase={gamePhase}
            isSelected={false}
            isAI={false}
            isMyProfile={true}
          />
        </section>

        {/* 투표 진행률 */}
        {gamePhase === GamePhase.VOTING && (
          <progress
            className="w-[46rem] h-3 mt-6 appearance-none [&::-webkit-progress-bar]:bg-[#8B8A8A]/90 [&::-webkit-progress-bar]:rounded-md [&::-webkit-progress-value]:bg-white [&::-webkit-progress-value]:rounded-md [&::-moz-progress-bar]:bg-white [&::-moz-progress-bar]:rounded-md"
            value={voteProgress}
            max={1}
            aria-label="투표 진행률"
          />
        )}
      </aside>
    </>
  );
}
