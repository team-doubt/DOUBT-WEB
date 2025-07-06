import "./App.css";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Index from "./pages/Index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
