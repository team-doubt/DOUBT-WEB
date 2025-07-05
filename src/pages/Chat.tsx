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
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '2px solid #d1d5db', marginBottom: 8 }}>
                                            <img src={chat.avatar} alt={chat.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <span style={{ color: '#fff', fontWeight: 500, fontSize: 16, textAlign: 'center', maxWidth: 72, wordBreak: 'break-all' }}>{chat.username}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '2px solid #d1d5db', marginBottom: 8 }}>
                                        <img src={myAvatar} alt={myUsername} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <span style={{ color: '#fff', fontWeight: 500, fontSize: 16, textAlign: 'center', maxWidth: 72, wordBreak: 'break-all' }}>{myUsername}</span>
                                </div>
                            </div>
                            <div style={{ width: 360, height: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 6, marginTop: 40, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${voteProgress * 100}%`,
                                    background: '#ffffff'
                                }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}