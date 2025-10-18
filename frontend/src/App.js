import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Chat from "./components/ChatInterface/Chat";
import Intro from "./components/IntroAnimation/Intro";
import Land from "./components/LandingPage/LandingPage";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Intro</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/landing">Landing Page</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/landing" element={<Land/>} />
      </Routes>
    </BrowserRouter>


      
  );
}

export default App;

/* if ur reading this no u didnt */