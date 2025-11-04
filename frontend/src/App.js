import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Chat from "./components/ChatInterface/Chat";
import ChatTTS from "./components/ChatInterface/ChatTTS";
import Intro from "./components/IntroAnimation/Intro";
import Land from "./components/LandingPage/LandingPage";
import Map from "./components/MapNavigation/Map";
import BuildingDetails from "./components/MapNavigation/BuildingDetails";
import Layout from "./components/Sidebar/Layout";
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Intro />} />
        <Route path="/intro" element={<Intro />} />
        

        <Route element={<Layout />}>
          <Route path="/landing" element={<Land />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat-tts" element={<ChatTTS />} />
          <Route path="/map" element={<Map />} />
          <Route path="/building/:buildingId" element={<BuildingDetails />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

/* function App() {
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

export default App; */

/* if ur reading this no u didnt */