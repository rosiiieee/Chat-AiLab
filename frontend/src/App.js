import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Chat from "./components/ChatInterface/Chat";
import Intro from "./components/IntroAnimation/Intro";
import Land from "./components/LandingPage/LandingPage";
import Sidebar from "./components/Sidebar/Sidebar";
import characterGif from "./draft_alab.gif";
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const handleNavigation = (page) => {
    switch(page) {
      case 'home':
        navigate('/landing');
        break;
      case 'chat':
        navigate('/chat');
        break;
      case 'tour':
        navigate('/map'); 
        break;
      case 'exit':
        navigate('/landing');
        break;
      default:
        navigate('/');
    }
  };
  return (
    <>
      <Sidebar 
        characterIcon={characterGif}
        onNavigate={handleNavigation}
      />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/landing" element={<Land />} />
        {/* Add MapNavigation route when ready */}
        {/* <Route path="/map" element={<MapNavigation />} /> */}
      </Routes>
    </>
  );
}
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
export default App;
/* if ur reading this no u didnt */ 