import { useState } from "react";
import { GamePhase } from "../types/chat";
import sign from "../assets/sign.svg";
import ai from "../assets/ai.svg";

interface ProfileCardProps {
  avatar: string;
  username: string;
  gamePhase: GamePhase;
  isSelected: boolean;
  isAI: boolean;
  isMyProfile?: boolean;
  onClick?: () => void;
}

export default function ProfileCard({
  avatar,
  username,
  gamePhase,
  isSelected,
  isAI,
  isMyProfile = false,
  onClick,
}: ProfileCardProps) {
  const isClickable = gamePhase !== GamePhase.RESULT && !isMyProfile;

  // 랜덤 각도를 한 번만 생성하고 고정 (-20도 ~ 20도)
  const [doubtAngle] = useState(() => Math.floor(Math.random() * 41) - 8);

  const handleClick = () => {
    if (isClickable && onClick) {
      // 클릭 효과음 재생
      const audio = new Audio(
        "/src/assets/sounds/old-radio-button-click-97549.mp3"
      );
      audio.volume = 0.3; // 볼륨 조절 (0.0 ~ 1.0)
      audio.play().catch(() => {
        // 오디오 재생 실패 시 무시 (브라우저 정책으로 인한 실패 가능)
      });
      onClick();
    }
  };

  return (
    <div
      className={`flex flex-col items-center relative ${
        isMyProfile
          ? "cursor-not-allowed opacity-50"
          : gamePhase === GamePhase.RESULT
          ? "cursor-default"
          : "cursor-pointer"
      }`}
      onClick={handleClick}
    >
      {isSelected && (
        <img
          src={sign}
          alt=""
          className="absolute pb-[60px] left-1/2 w-[1200px] h-[200px] select-none"
          style={{
            transform: `translateX(-50%) scale(1.3) rotate(${doubtAngle}deg)`,
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
