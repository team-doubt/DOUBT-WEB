import { useEffect } from "react";
import type { ChatMessage } from "../types/chat";

// 채팅 자동 스크롤과 알림음을 관리하는 커스텀 훅
export const useChatEffects = (messages: ChatMessage[]) => {
  useEffect(() => {
    const chatBottom = document.getElementById("chat-bottom");
    if (chatBottom) {
      chatBottom.scrollIntoView({ behavior: "smooth" });
    }

    // 메시지가 있을 때만 알림음 재생 (첫 로드 시 제외)
    if (messages.length > 0) {
      const audio = new Audio(
        "/src/assets/sounds/new-notification-07-210334.mp3"
      );
      audio.volume = 0.4; // 볼륨 조절 (0.0 ~ 1.0)
      audio.play().catch(() => {
        // 오디오 재생 실패 시 무시 (브라우저 정책으로 인한 실패 가능)
      });
    }
  }, [messages]);
};
