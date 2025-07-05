import { useState, useRef, useEffect } from "react";
import Chatbox from "../components/Chatbox";
import TextInput from "../components/TextInput";
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
    const [fakeChats] = useState(() => Array.from({ length: 5 }, createFakeChat));
    // 내 아바타와 이름을 한 번만 생성해서 고정
    const [myAvatar] = useState(() => faker.image.avatar());
    const myUsername = '나';
    const chatListRef = useRef<HTMLDivElement>(null);

    const handleSend = (msg: string) => {
        if (msg.trim() === "") return;
        setMessages(prev => [...prev, msg]);
    };

    useEffect(() => {
        if (chatListRef.current) {
            chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
    }, [messages, fakeChats]);

    return (
        <>
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
                        <TextInput onSend={handleSend} />
                    </div>
                </div>
            </div>
        </>
    );
}