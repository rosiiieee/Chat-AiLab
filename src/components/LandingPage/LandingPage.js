import React, { useState, useEffect } from 'react';
import { MessageCircle, Map } from 'lucide-react';
import characterGif from '../../assets/alab_hi.gif';
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
    const words = fullMessage.split(' ');
    let wordCount = 0;

    const interval = setInterval(() => {
      if (wordCount < words.length) {
        setCurrentMessage(words.slice(0, wordCount + 1).join(' '));
        wordCount++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (messageIndex < messages.length - 1) {
            setMessageIndex(messageIndex + 1);
            setCurrentMessage('');
          }
        }, 1500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [messageIndex, showWelcome]);

  if (showWelcome) {
    return (
      <div className="landing-container">
        <h1 className="heading-light">Welcome,</h1>
        <h2 className="heading-bold">to AiLab!</h2>

        <img src={characterGif} alt="AiLab Character" className="character-img" />

        <div>
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
    );
  }

  return (
    <div className="landing-container">
      <h1 className="heading-light">Meet,</h1>
      <h2 className="heading-bold">Chat AiLab!</h2>

      <div className="message-container">
        <div className="message-bubble">
          {currentMessage || '\u00A0'}
          <div className="message-pointer"></div>
        </div>
        <img src={characterGif} alt="AiLab Character" className="character-img" />
      </div>

      <button className="button" onClick={() => setShowWelcome(true)}>
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
