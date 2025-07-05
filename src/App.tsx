import './App.css'
import Chat from './pages/Chat'
import Header from './components/Header'
import Vote from './pages/Vote'
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/vote" element={<Vote />} />
      </Routes>
    </>
  )
}

export default App
