import { useState, useEffect } from "react";
import Chatbox from "../components/Chatbox";
import TextInput from "../components/TextInput";
import Header from "../components/Header";
import GameOverlay from "../components/GameOverlay";
import { useChatStore } from "../stores/chatStore";
import { GamePhase } from "../types/chat";
import { GAME_CONFIG, USERS as GAME_USERS, MY_USER } from "../constants/game";
// 게임 참여자들 (상수에서 바로 사용)
const USERS = GAME_USERS.map((user) => ({
  avatar: user.avatar,
  username: user.name,
}));

// 노이만(노랑)이 me
const myUser = { avatar: MY_USER.avatar, username: MY_USER.name };

export default function Chat() {
  const { messages, gamePhase, addMessage, setGamePhase } = useChatStore();

  const [endTime] = useState(() => Date.now() + GAME_CONFIG.CHAT_DURATION);
  const [voteProgress, setVoteProgress] = useState(0);
  const [voteTargets, setVoteTargets] = useState<number[]>([]);
  const [resultRedIdxs, setResultRedIdxs] = useState<number[]>([]);

  const handleSend = (msg: string) => {
    addMessage(msg);
  };

  // 새 메시지 추가 시 자동 스크롤 및 알림음 재생
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

  // 투표 단계 효과
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
  }, [gamePhase, setGamePhase]);

  const handleProfileClick = (idx: number) => {
    if (gamePhase === GamePhase.RESULT) return;
    if (USERS[idx]?.username === myUser.username) return; // 내 프로필은 클릭 불가
    setVoteTargets((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <>
      <Header
        onTimeEnd={() => setGamePhase(GamePhase.VOTING)}
        endTime={endTime}
      />
      <main className="w-screen h-screen flex justify-center items-center bg-none">
        <section
          className={`mt-12 w-[700px] h-[calc(100vh-48px)] flex flex-col overflow-hidden relative bg-cover bg-center bg-no-repeat ${
            gamePhase === GamePhase.RESULT
              ? "bg-[url('/src/assets/background/result.png')]"
              : "bg-[url('/bg.svg')]"
          }`}
        >
          <article className="flex-1 flex flex-col overflow-y-auto [scrollbar-width:none] [scroll-behavior:smooth] p-8 pb-24">
            <div className="flex flex-col gap-2 min-h-min">
              {messages.map((msg, idx) => (
                <Chatbox
                  key={`mine-${idx}`}
                  message={msg}
                  username={myUser.username}
                  avatar={myUser.avatar}
                  time={new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  isMine={true}
                />
              ))}
              {/* 이 요소가 새 메시지 추가 시 자동 스크롤 타겟 */}
              <div id="chat-bottom" />
            </div>
          </article>
          <footer className="absolute left-0 bottom-2 w-full px-4 pb-4 bg-transparent">
            <TextInput
              onSend={handleSend}
              disabled={gamePhase !== GamePhase.CHATTING}
            />
          </footer>
        </section>
      </main>
      {gamePhase !== GamePhase.CHATTING && (
        <GameOverlay
          gamePhase={gamePhase}
          users={USERS}
          myUser={myUser}
          voteTargets={voteTargets}
          resultRedIdxs={resultRedIdxs}
          voteProgress={voteProgress}
          onProfileClick={handleProfileClick}
        />
      )}
    </>
  );
}
