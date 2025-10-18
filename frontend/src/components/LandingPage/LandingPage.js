import React, { useState, useEffect } from 'react';
import { MessageCircle, Map } from 'lucide-react';
import {motion} from 'framer-motion';

import characterGif from '../../draft_alab_hi.gif';
import './LandingPage.css';


const LandingPage = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Hi, Haribon!",
    "I'm AiLab!",
    "your AI assistant!",
    "and tour guide!"
  ];

  useEffect(() => {
  if (showWelcome) return;

  const fullMessage = messages[messageIndex];
  const letters = fullMessage.split(''); // split by character
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
            setMessageIndex(0); // go back to first message
            setCurrentMessage('');
        }
      }, 1500);
    }
  }, 100); // faster interval looks more natural for typing

  return () => clearInterval(interval);
}, [messageIndex, showWelcome]);

  if (showWelcome) {
    return (
      <div className="background">
        <div className="landing-container">
          <h1 className="heading-light">Welcome,</h1>
          <h2 className="heading-bold"><b>to AiLab!</b></h2>

          <img src={characterGif} alt="AiLab Character" className="character-img" />

          <div className = "testd">
            <button className="button">
              <MessageCircle size={20} />
              Chat with AiLab
            </button>
            <button className="button">
              <Map size={20} />
              Explore with AiLab
            </button>
            <button className="button" onClick={() => {
              setShowWelcome(false);
              setMessageIndex(0);
              setCurrentMessage('');
            }}>
              Exit
            </button>
          </div>
        </div>
      </div>

    );
  }

  return (
    <div className = "background">
      <div className="landing-container">
        <h1 className="heading-light">Meet,</h1>
        <h2 className="heading-bold"><b>Chat AiLab!</b></h2>

        <div className = "testd">
          <div className="message-container">
            <motion.div 
              initial={{
                x: 50
              }}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity
              }}
            
            className="message-bubble">
              {currentMessage || '\u00A0'}
              <div className="message-pointer"></div>
            </motion.div>
            <img src={characterGif} alt="AiLab Character" className="character-img" />
          </div>

          <button className="button" onClick={() => setShowWelcome(true)}>
            Get Started
          </button>
        </div>
      </div>
    </div>

  );
};

export default LandingPage;
