import { useState, useRef, useEffect } from "react";
import Chatbox from "../components/Chatbox";
import TextInput from "../components/TextInput";
import Header from "../components/Header";
import { faker } from '@faker-js/faker';

function createFakeChat() {
    return {
        message: faker.lorem.sentence(),
        username: faker.internet.userName(),
        avatar: faker.image.avatar(),
        time: faker.date.recent().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
}

export default function Chat() {
    const [messages, setMessages] = useState<string[]>([]);
    const [fakeChats] = useState(() => Array.from({ length: 4 }, createFakeChat));
    const [myAvatar] = useState(() => faker.image.avatar());
    const myUsername = '나';
    const chatListRef = useRef<HTMLDivElement>(null);
    const [isTimeEnded, setIsTimeEnded] = useState(false);
    const [endTime] = useState(() => Date.now() + 1 * 60 * 1000);
    const [voteProgress, setVoteProgress] = useState(0);
    const [voteTargets, setVoteTargets] = useState<number[]>([]);
    const [doubtAngles] = useState(() => Array.from({length: 5}, () => (Math.random() * 36 - 18)));

    const handleSend = (msg: string) => {
        if (msg.trim() === "") return;
        setMessages(prev => [...prev, msg]);
    };

    useEffect(() => {
        if (chatListRef.current) {
            chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
    }, [messages, fakeChats]);

    useEffect(() => {
        if (!isTimeEnded) return;
        setVoteProgress(0);
        const start = Date.now();
        const duration = 60000; // 1분
        let raf: number;
        function tick() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            setVoteProgress(progress);
            if (progress < 1) {
                raf = requestAnimationFrame(tick);
            }
        }
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [isTimeEnded]);

    const handleProfileClick = (idx: number) => {
        if (idx === 4) return;
        setVoteTargets(prev =>
            prev.includes(idx)
                ? prev.filter(i => i !== idx)
                : [...prev, idx]
        );
    };

    return (
        <>
            <Header onTimeEnd={() => setIsTimeEnded(true)} endTime={endTime} />
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
                    style={{
                        width: "700px",
                        height: "calc(100vh - 48px)",
                        backgroundImage: "url('/bg.svg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        boxSizing: "border-box",
                        position: "relative",
                    }}
                    className="mt-12"
                >
                    <div
                        ref={chatListRef}
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "32px 16px 16px 16px",
                            paddingBottom: 96,
                        }}
                    >
                        {fakeChats.map((chat, idx) => (
                            <Chatbox
                                key={idx}
                                message={chat.message}
                                username={chat.username}
                                avatar={chat.avatar}
                                time={chat.time}
                            />
                        ))}
                        {messages.map((msg, idx) => (
                            <Chatbox
                                key={`mine-${idx}`}
                                message={msg}
                                username={myUsername}
                                avatar={myAvatar}
                                time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            />
                        ))}
                    </div>
                    <div style={{ position: "absolute", left: 0, bottom: 8, width: "100%", padding: "0 16px 16px 16px", background: "transparent" }}>
                        <TextInput onSend={handleSend} disabled={isTimeEnded} />
                    </div>
                    {isTimeEnded && (
                        <div className="overlay" style={{ flexDirection: 'column' }}>
                            <span className="overlay-text">Who's Human?</span>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: 24, marginTop: 32 }}>
                                {fakeChats.map((chat, idx) => (
                                    <div
                                        key={idx}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'pointer' }}
                                        onClick={() => handleProfileClick(idx)}
                                    >
                                        {voteTargets.includes(idx) && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 12,
                                                left: '50%',
                                                transform: `translateX(-50%) rotate(${doubtAngles[idx]}deg)`,
                                                background: '#b84bb8',
                                                color: '#fff',
                                                fontWeight: 700,
                                                fontSize: 36,
                                                borderRadius: 8,
                                                padding: '8px 32px',
                                                zIndex: 2,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                textAlign: 'center',
                                                fontFamily: 'serif',
                                                pointerEvents: 'none',
                                                whiteSpace: 'nowrap',
                                            }}>Doubt</div>
                                        )}
                                        <div style={{ width: 128, height: 128, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '2px solid #d1d5db', marginBottom: 8 }}>
                                            <img src={chat.avatar} alt={chat.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <span style={{ color: '#fff', fontWeight: 500, fontSize: 18, textAlign: 'center', maxWidth: 128, wordBreak: 'break-all' }}>{chat.username}</span>
                                    </div>
                                ))}
                                <div
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'not-allowed', opacity: 0.5 }}
                                >
                                    {voteTargets.includes(4) && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 12,
                                            left: '50%',
                                            transform: `translateX(-50%) rotate(${doubtAngles[4]}deg)`,
                                            background: '#b84bb8',
                                            color: '#fff',
                                            fontWeight: 700,
                                            fontSize: 36,
                                            borderRadius: 8,
                                            padding: '8px 32px',
                                            zIndex: 2,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            textAlign: 'center',
                                            fontFamily: 'serif',
                                            pointerEvents: 'none',
                                            whiteSpace: 'nowrap',
                                        }}>Doubt</div>
                                    )}
                                    <div style={{ width: 128, height: 128, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '2px solid #d1d5db', marginBottom: 8 }}>
                                        <img src={myAvatar} alt={myUsername} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <span style={{ color: '#fff', fontWeight: 500, fontSize: 18, textAlign: 'center', maxWidth: 128, wordBreak: 'break-all' }}>{myUsername}</span>
                                </div>
                            </div>
                            <div style={{ width: 360, height: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 6, marginTop: 40, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${voteProgress * 100}%`, background: '#4f8cff' }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}