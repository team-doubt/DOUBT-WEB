import Chatbox from "../components/Chatbox";
import TextInput from "../components/TextInput";

export default function Chat() {
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
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "32px 16px 16px 16px",
                            paddingBottom: 96,
                        }}
                    >
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                        <Chatbox />
                    </div>
                    <div style={{ position: "absolute", left: 0, bottom: 8, width: "100%", padding: "0 16px 16px 16px", background: "transparent" }}>
                        <TextInput />
                    </div>
                </div>
            </div>
        </>
    );
}