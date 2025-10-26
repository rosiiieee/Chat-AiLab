import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { MessageCircle, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import characterGif from '../../draft_alab_hi.gif';
import characterGifStand from '../../draft_alab.gif';
import glow from '../../glow.png';
import './LandingPage.css';


const LandingPage = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Hi, Haribon!",
    "I'm Alab!",
    "your AI assistant!",
    "and tour guide!"
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (showWelcome) return;

    const fullMessage = messages[messageIndex];
    const letters = fullMessage.split('');
    let letterCount = 0;

    const interval = setInterval(() => {
      if (letterCount < letters.length) {
        setCurrentMessage(letters.slice(0, letterCount + 1).join(''));
        letterCount++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (messageIndex < messages.length - 1) {
            setMessageIndex(messageIndex + 1);
            setCurrentMessage('');
          } else {
              setMessageIndex(0);
              setCurrentMessage('');
          }
        }, 1500);
      }
    }, 100);

  return () => clearInterval(interval);
}, [messageIndex, showWelcome]);

  return (
    <div className="background">
        <motion.div className="landing-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
          <motion.h1 
            key={showWelcome ? "welcome" : "meet"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="heading-light">
            {showWelcome ? "Welcome" : "Meet"}
          </motion.h1>

            <motion.h2
              key={showWelcome ? "toailab" : "chatailab"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                delay: 0.3,
                duration: 0.5, 
                ease: "easeInOut" }}
              className="heading-bold">
              <b>{showWelcome ? "to AiLab!" : "Chat AiLab!"}</b>
            </motion.h2>

          <div className="testd">
            <div className="message-container">
              {!showWelcome && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut"}}
                >

                  <motion.div
                    animate={{
                      x: [-50, -50, -50],
                      y: [0, -8, 0] }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                    className="message-bubble"
                  >
                    {currentMessage || "\u00A0"}
                    <div className="message-pointer"></div>
                  </motion.div>
                </motion.div>
                
              )}

                <div className="character-container">
                  <motion.img
                    src={glow}
                    alt="Glow effect"
                    className="character-glow"
                    animate={
                      showWelcome ? 
                      { y: [-0, -50, -40], scale: 1.1, opacity: [0.8, 1, 0.8]} : 
                      { y: 0, scale: 1, opacity: [0.8, 1, 0.8] }                     
                    }
                    transition={{
                      duration: 1,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.img
                    src={showWelcome ? characterGifStand : characterGif}
                    alt="AiLab Character"
                    className="character-img"
                    animate={showWelcome ? 
                      { y: [-0, -50, -40], scale: 1.1 } : 
                      { y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
            </div>

            <div className="button-container">
            <AnimatePresence mode="wait">
              {showWelcome ? (
                
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="testd"
                  >
                    <button className="button" id = "wyd"
                      onClick={() => navigate("/chat")}>
                      <MessageCircle size={20} />
                      Chat with AiLab
                    </button>
                    <button className="button" id = "wyd"
                      onClick={() => navigate("/map")}>
                      <Map size={20} />
                      Explore with AiLab
                    </button>
                    <button className="button" id = "wyd"
                      onClick={() => {
                        setShowWelcome(false);
                        setMessageIndex(0);
                        setCurrentMessage("");
                      }}
                    >
                      Exit
                    </button>
                  </motion.div>
                
                
              ) : (
                  <motion.div
                    key="meet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="testd"
                  >
                    <button
                      className="button" id="starteded"
                      onClick={() => setShowWelcome(true)}
                    >
                      Get Started
                    </button>
                  </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </motion.div>     
    </div>
  );
}

//   if (showWelcome) {
//     return (
//       <div className="background">
//         <div className="landing-container">
//           <h1 className="heading-light">Welcome,</h1>
//           <h2 className="heading-bold"><b>to AiLab!</b></h2>

//           <img src={characterGif} alt="AiLab Character" className="character-img" />

//           <div className = "testd">
//             <button className="button" onClick={() => navigate("/Chat")}>
//               <MessageCircle size={20} />
//               Chat with AiLab
//             </button>
//             <button className="button">
//               <Map size={20} />
//               Explore with AiLab
//             </button>
//             <button className="button" onClick={() => {
//               setShowWelcome(false);
//               setMessageIndex(0);
//               setCurrentMessage('');
//             }}>
//               Exit
//             </button>
//           </div>
//         </div>
//       </div>

//     );
//   }

//   return (
//     <div className = "background">
//       <div className="landing-container">
//         <h1 className="heading-light">Meet,</h1>
//         <h2 className="heading-bold"><b>Chat AiLab!</b></h2>

//         <div className = "testd">
//           <div className="message-container">
//             <motion.div 
//               initial={{
//                 x: 50
//               }}
//               animate={{
//                 y: [0, -8, 0],
//               }}
//               transition={{
//                 duration: 2,
//                 ease: "easeInOut",
//                 repeat: Infinity
//               }}
            
//             className="message-bubble">
//               {currentMessage || '\u00A0'}
//               <div className="message-pointer"></div>
//             </motion.div>
//             <img src={characterGif} alt="AiLab Character" className="character-img" />
//           </div>

//           <button className="button" onClick={() => setShowWelcome(true)}>
//             Get Started
//           </button>
//         </div>
//       </div>
//     </div>

//   );
// };

export default LandingPage;
