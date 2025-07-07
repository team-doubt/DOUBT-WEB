import { GamePhase } from "../types/chat";
import sign from "../assets/sign.svg";
import ai from "../assets/ai.svg";

interface ProfileCardProps {
  avatar: string;
  username: string;
  idx: number;
  gamePhase: GamePhase;
  isSelected: boolean;
  isAI: boolean;
  isMyProfile?: boolean;
  onClick?: () => void;
}

// 투표 대상별 고정된 랜덤 각도를 생성하는 함수
const generateDoubtAngle = (targetIndex: number) => {
  // targetIndex를 시드로 사용하여 일관된 랜덤값 생성
  const seed = targetIndex * 123.456;
  const pseudoRandom = Math.sin(seed) * 10000;
  return (pseudoRandom - Math.floor(pseudoRandom)) * 36 - 18;
};

export default function ProfileCard({
  avatar,
  username,
  idx,
  gamePhase,
  isSelected,
  isAI,
  isMyProfile = false,
  onClick,
}: ProfileCardProps) {
  const isClickable = gamePhase !== GamePhase.RESULT && !isMyProfile;
  const doubtAngle = generateDoubtAngle(idx);

  return (
    <div
      className={`flex flex-col items-center relative ${
        isMyProfile
          ? "cursor-not-allowed opacity-50"
          : gamePhase === GamePhase.RESULT
          ? "cursor-default"
          : "cursor-pointer"
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      {isSelected && (
        <img
          src={sign}
          alt=""
          className="absolute pb-[60px] left-1/2 w-[800px] h-[200px] select-none"
          style={{
            transform: `translateX(-50%) rotate(${doubtAngle}deg)`,
          }}
        />
      )}
      <div className="w-32 h-32 overflow-hidden [scrollbar-width:none] mb-2 bg-white">
        <img
          src={gamePhase === GamePhase.RESULT && isAI ? ai : avatar}
          alt={username}
          className="w-full h-full object-cover select-none"
        />
      </div>
    </div>
  );
}
