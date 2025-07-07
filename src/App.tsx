import "./App.css";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Index from "./pages/Index";
import Noise from "./components/Noise";

function App() {
  return (
    <>
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={4}
        patternAlpha={15}
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
