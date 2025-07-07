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
  return (
    <aside className="overlay" style={{ flexDirection: "column" }}>
      <h2 className="overlay-text">
        {gamePhase === GamePhase.RESULT ? "Result" : "Who's AI?"}
      </h2>

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
            idx={idx}
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
          idx={users.length}
          gamePhase={gamePhase}
          isSelected={false}
          isAI={false}
          isMyProfile={true}
        />
      </section>

      {/* 투표 진행률 */}
      {gamePhase === GamePhase.VOTING && (
        <progress
          className="w-[46rem] h-3 mt-10 appearance-none [&::-webkit-progress-bar]:bg-[#8B8A8A]/90 [&::-webkit-progress-bar]:rounded-md [&::-webkit-progress-value]:bg-white [&::-webkit-progress-value]:rounded-md [&::-moz-progress-bar]:bg-white [&::-moz-progress-bar]:rounded-md"
          value={voteProgress}
          max={1}
          aria-label="투표 진행률"
        />
      )}

      {/* 결과 텍스트 */}
      {gamePhase === GamePhase.RESULT && resultRedIdxs.length > 0 && (
        <output className="mt-8 text-white text-center">
          AI는{" "}
          {resultRedIdxs
            .map((i) => users[i]?.username)
            .filter(Boolean)
            .join(", ")}{" "}
          입니다!
        </output>
      )}
    </aside>
  );
}
