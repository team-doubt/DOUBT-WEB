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
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "none",
        }}
      >
        <div
          className="mt-12 w-[700px] h-[calc(100vh-48px)] flex flex-col overflow-hidden relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              gamePhase === GamePhase.RESULT
                ? "url('/result_bg.svg')"
                : "url('/bg.svg')",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              scrollbarWidth: "none",
              scrollBehavior: "smooth",
              padding: "32px 16px 96px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                minHeight: "min-content",
              }}
            >
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
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 8,
              width: "100%",
              padding: "0 16px 16px 16px",
              background: "transparent",
            }}
          >
            <TextInput onSend={handleSend} disabled={isGameActive} />
          </div>
          {isGameActive && (
            <div className="overlay" style={{ flexDirection: "column" }}>
              <span className="overlay-text">
                {gamePhase === GamePhase.RESULT ? "Result" : "Who's AI?"}
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 24,
                  marginTop: 32,
                }}
              >
                {USERS.map((user, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      cursor:
                        gamePhase === GamePhase.RESULT ? "default" : "pointer",
                    }}
                    onClick={() => handleProfileClick(idx)}
                  >
                    {voteTargets.includes(idx) && (
                      <img
                        src={sign}
                        alt=""
                        style={{
                          position: "absolute",
                          paddingBottom: 60,
                          left: "50%",
                          transform: `translateX(-50%) rotate(${generateDoubtAngle(idx)}deg)`,
                          width: 800,
                          height: 200,
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: 128,
                        height: 128,
                        overflow: "hidden",
                        scrollbarWidth: "none",
                        background:
                          gamePhase === GamePhase.RESULT &&
                          resultRedIdxs.includes(idx)
                            ? "#ff0000"
                            : "#fff",
                        marginBottom: 8,
                      }}
                    >
                      <img
                        src={user.avatar}
                        alt={user.username}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    cursor: "not-allowed",
                    opacity: 0.5,
                  }}
                >
                  <div
                    style={{
                      width: 128,
                      height: 128,
                      overflow: "hidden",
                      scrollbarWidth: "none",
                      background: "#fff",
                      marginBottom: 8,
                    }}
                  >
                    <img
                      src={myAvatar}
                      alt={myUsername}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              </div>
              {gamePhase === GamePhase.VOTING && (
                <div
                  style={{
                    width: 360,
                    height: 12,
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 6,
                    marginTop: 40,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${voteProgress * 100}%`,
                      background: "#ffffff",
                      borderRadius: 6,
                    }}
                  />
                </div>
              )}
              {gamePhase === GamePhase.RESULT && resultRedIdxs.length > 0 && (
                <div
                  style={{ marginTop: 32, color: "white", textAlign: "center" }}
                >
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
