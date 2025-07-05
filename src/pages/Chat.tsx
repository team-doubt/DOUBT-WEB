import Chatbox from "../components/Chatbox";

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
                        height: "100vh",
                        backgroundImage: "url('/bg.svg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                    className="mt-12"
                >
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "32px 16px",
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
                </div>
            </div>
        </>
    );
}