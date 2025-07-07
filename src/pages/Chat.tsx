import { useState, useEffect } from "react";
import Chatbox from "../components/Chatbox";
import TextInput from "../components/TextInput";
import Header from "../components/Header";
import { useChatStore } from "../stores/chatStore";
import { GamePhase } from "../types/chat";
import { GAME_CONFIG, USERS as GAME_USERS, MY_USER } from "../constants/game";
import sign from "../assets/sign.svg";

// 게임 참여자들 (상수에서 바로 사용)
const USERS = GAME_USERS.map((user) => ({
  avatar: user.avatar,
  username: user.name,
}));

// 노이만(노랑)이 me
const myUser = { avatar: MY_USER.avatar, username: MY_USER.name };

export default function Chat() {
  const { messages, gamePhase, addMessage, setGamePhase } = useChatStore();

  // 투표 대상별 고정된 랜덤 각도를 생성하는 함수
  const generateDoubtAngle = (targetIndex: number) => {
    // targetIndex를 시드로 사용하여 일관된 랜덤값 생성
    const seed = targetIndex * 123.456;
    const pseudoRandom = Math.sin(seed) * 10000;
    return (pseudoRandom - Math.floor(pseudoRandom)) * 36 - 18;
  };
  const [endTime] = useState(() => Date.now() + GAME_CONFIG.CHAT_DURATION);
  const [voteProgress, setVoteProgress] = useState(0);
  const [voteTargets, setVoteTargets] = useState<number[]>([]);
  const [resultRedIdxs, setResultRedIdxs] = useState<number[]>([]);

  const myUsername = myUser.username;
  const myAvatar = myUser.avatar;

  const handleSend = (msg: string) => {
    addMessage(msg);
  };

  // 새 메시지 추가 시 자동 스크롤
  useEffect(() => {
    const chatBottom = document.getElementById("chat-bottom");
    if (chatBottom) {
      chatBottom.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 게임 페이즈 관리
  const handleTimeEnd = () => {
    setGamePhase(GamePhase.VOTING);
  };

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
    if (idx === 4) return; // 내 프로필은 클릭 불가
    setVoteTargets((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const isGameActive = gamePhase !== GamePhase.CHATTING;

  return (
    <>
      <Header onTimeEnd={handleTimeEnd} endTime={endTime} />
      <div className="w-screen h-screen flex justify-center items-center bg-none">
        <div
          className={`mt-12 w-[700px] h-[calc(100vh-48px)] flex flex-col overflow-hidden relative bg-cover bg-center bg-no-repeat ${
            gamePhase === GamePhase.RESULT
              ? "bg-[url('/result_bg.svg')]"
              : "bg-[url('/bg.svg')]"
          }`}
        >
          <div className="flex-1 flex flex-col overflow-y-auto [scrollbar-width:none] [scroll-behavior:smooth] p-8 pb-24">
            <div className="flex flex-col gap-2 min-h-min">
              {messages.map((msg, idx) => (
                <Chatbox
                  key={`mine-${idx}`}
                  message={msg}
                  username={myUsername}
                  avatar={myAvatar}
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
          </div>
          <div className="absolute left-0 bottom-2 w-full px-4 pb-4 bg-transparent">
            <TextInput onSend={handleSend} disabled={isGameActive} />
          </div>
          {isGameActive && (
            <div className="overlay" style={{ flexDirection: "column" }}>
              <span className="overlay-text">
                {gamePhase === GamePhase.RESULT ? "Result" : "Who's AI?"}
              </span>
              <div className="flex flex-row gap-6 mt-8">
                {USERS.map((user, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center relative ${
                      gamePhase === GamePhase.RESULT
                        ? "cursor-default"
                        : "cursor-pointer"
                    }`}
                    onClick={() => handleProfileClick(idx)}
                  >
                    {voteTargets.includes(idx) && (
                      <img
                        src={sign}
                        alt=""
                        className="absolute pb-[60px] left-1/2 w-[800px] h-[200px]"
                        style={{
                          transform: `translateX(-50%) rotate(${generateDoubtAngle(
                            idx
                          )}deg)`,
                        }}
                      />
                    )}
                    <div
                      className={`w-32 h-32 overflow-hidden [scrollbar-width:none] mb-2 ${
                        gamePhase === GamePhase.RESULT &&
                        resultRedIdxs.includes(idx)
                          ? "bg-red-500"
                          : "bg-white"
                      }`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
                <div className="flex flex-col items-center relative cursor-not-allowed opacity-50">
                  <div className="w-32 h-32 overflow-hidden [scrollbar-width:none] bg-white mb-2">
                    <img
                      src={myAvatar}
                      alt={myUsername}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              {gamePhase === GamePhase.VOTING && (
                <div className="w-[360px] h-3 bg-white/20 rounded-md mt-10 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-md"
                    style={{
                      width: `${voteProgress * 100}%`,
                    }}
                  />
                </div>
              )}
              {gamePhase === GamePhase.RESULT && resultRedIdxs.length > 0 && (
                <div className="mt-8 text-white text-center">
                  AI는{" "}
                  {resultRedIdxs
                    .map((i) => USERS[i]?.username)
                    .filter(Boolean)
                    .join(", ")}{" "}
                  입니다!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
