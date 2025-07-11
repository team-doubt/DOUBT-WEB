import { useState } from "react";
import Chatbox from "../components/Chatbox";
import TextInput from "../components/TextInput";
import Header from "../components/Header";
import GameOverlay from "../components/GameOverlay";
import { useChatStore, sendMessage } from "../stores/chatStore";
import { GamePhase } from "../types/chat";
import { GAME_CONFIG, USERS as GAME_USERS, MY_USER } from "../constants/game";
import systemAvatar from "../assets/profile/system/system.png";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { useChatEffects } from "../hooks/useChatEffects";
import { useGamePhases } from "../hooks/useGamePhases";

// 게임 참여자들 (상수에서 바로 사용)
const USERS = GAME_USERS.map((user) => ({
  avatar: user.avatar,
  username: user.name,
}));

// 노이만(노랑)이 me
const myUser = { avatar: MY_USER.avatar, username: MY_USER.name };

// 수학자 이름별 아바타 매핑
const getAvatarByName = (name: string): string => {
  const userMap: { [key: string]: string } = {
    파스칼: GAME_USERS[0].avatar,
    가우스: GAME_USERS[1].avatar,
    오일러: GAME_USERS[2].avatar,
    튜링: GAME_USERS[3].avatar,
    노이만: MY_USER.avatar,
    시스템: systemAvatar, // 서버에서 온 시스템 메시지
  };

  // 만약 사용자 맵에 없는 이름이라면 시스템 아바타 사용 (서버 메시지로 간주)
  return userMap[name] || systemAvatar;
};

// 게임 오버레이를 표시하지 않아야 하는 단계들
const isOverlayHidden = (phase: GamePhase): boolean => {
  return phase === GamePhase.CHATTING || phase === GamePhase.AFTERPARTY;
};

// 채팅 입력이 활성화되어야 하는 단계들
const isChatEnabled = (phase: GamePhase): boolean => {
  return phase === GamePhase.CHATTING || phase === GamePhase.AFTERPARTY;
};

export default function Chat() {
  const { messages, gamePhase, myName, isConnected, setGamePhase } =
    useChatStore();

  const [endTime] = useState(() => Date.now() + GAME_CONFIG.CHAT_DURATION);
  const [voteProgress, setVoteProgress] = useState(0);
  const [voteTargets, setVoteTargets] = useState<number[]>([]);
  const [resultRedIdxs, setResultRedIdxs] = useState<number[]>([]);

  // 커스텀 훅들 사용
  useSocketConnection();
  useChatEffects(messages);
  useGamePhases(gamePhase, setGamePhase, setVoteProgress, setResultRedIdxs);

  const handleSend = (msg: string) => {
    sendMessage(msg);
  };

  const handleProfileClick = (idx: number) => {
    if (gamePhase === GamePhase.RESULT || gamePhase === GamePhase.AFTERPARTY)
      return;
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
      {/* 연결 상태 표시 */}
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isConnected ? "연결됨" : "연결 중..."}
          {myName && isConnected && ` (${myName})`}
        </div>
      </div>
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
                  key={`message-${idx}`}
                  message={msg.message}
                  username={msg.name}
                  avatar={getAvatarByName(msg.name)}
                  time={
                    msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                  }
                  isMine={msg.isMine}
                />
              ))}
              {/* 이 요소가 새 메시지 추가 시 자동 스크롤 타겟 */}
              <div id="chat-bottom" />
            </div>
          </article>
          <footer className="absolute left-0 bottom-2 w-full px-4 pb-4 bg-transparent">
            <TextInput
              onSend={handleSend}
              disabled={!isChatEnabled(gamePhase)}
            />
          </footer>
        </section>
      </main>
      {!isOverlayHidden(gamePhase) && (
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
