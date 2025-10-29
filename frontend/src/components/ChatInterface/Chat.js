import { useState, useId, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from 'react-text-to-speech';
import './Chat.css';
import flamed from '../../alab_head.png';
import useChatAnimation from './useChatAnimation'

/**
 * 
 * Purpose:
 *  - UI for the PLM Assistant chat: renders conversation messages, suggestion
 *    buttons, and an input to send messages to the backend.
 *
 *  - handleSend(text = null): sends a message. Uses `text` if provided,
 *    otherwise uses `inputValue`. Appends a user message + typing marker,
 *    calls the backend, then replaces the typing marker with bot or error.
 *  - handleKeyPress(e): sends on Enter.
 *  - handleSuggestionClick(suggestion): sends a suggested query.
 *
 **/
// voice options
// - Microsoft David - English (United States)
// - Microsoft Mark - English (United States)
// - Microsoft Zira - English (United States)
// - Google US English
// - Google UK English Female
// - Google UK English Male
const DEFAULT_VOICE = 'Google UK English Female';

const SpeechButton = ({ text }) => {
  const [voiceURI, setVoiceURI] = useState('');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const preferred = availableVoices.find((v) => v.name === DEFAULT_VOICE);
      if (preferred) {
        setVoiceURI(preferred.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const {
    speechStatus,
    start,
    stop,
  } = useSpeech({
    text,
    voiceURI: voiceURI,
  });

  const isSpeaking = speechStatus === 'started';

  return (
    <button
      type="button"
      className={`tts-button ${isSpeaking ? 'playing' : ''}`}
      onClick={isSpeaking ? stop : start}
      title={isSpeaking ? 'Stop reading' : 'Read this message'}
    >
      🔊
    </button>
  );
};

const Chat = () => {
  const threadId = useId();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your PLM Assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // chat animation hook
  const chatEndRef = useChatAnimation(messages);

  const handleSend = async (text = null) => {
    const msgText = (text ?? inputValue).trim();
    if (!msgText) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: text.trim(),
      sender: "user",
    };

    setMessages((prev) => [
      ...prev.filter((m) => m.sender !== "typing"),
      newUserMessage,
      { id: "typing", sender: "typing" },
    ]);
    setInputValue("");

    // clear input only when user typed in the input (not for suggestion clicks)
    if (text === null) setInputValue("");

    // api call
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text, thread_id: threadId }),
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: "bot",
      };

      setMessages((prev) => [...prev.filter((m) => m.sender !== "typing"), botMessage]);
    } catch (error) {
      console.error("Error calling backend:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {

    console.log(e.key);
    if (e.key === "Enter") {
      handleSend(inputValue);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  }

  const navigate = useNavigate();

  return (
    <div className="backgroundch">
      <motion.div
        className="chatting-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="app-container">
          {/* Header */}
          <header className="header">
            {/* <button className="header-button">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button> */}
            <h1 className="header-title">Chat Ailab</h1>
            <button className="logo-button">
              <div className="icon-logo-container">
                {/* <svg src={ flamed } className="icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg> */}

                <img src={flamed} className="icon-md" alt="flame-icon" />
              </div>
            </button>
          </header>

          {/* Chat Area */}
          <main className="chat-area">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`message-container ${msg.sender}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {msg.sender === "typing" ? (
                    <div className="typing-indicator">
                      <span className="typing-text">Thinking</span>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  ) : (
                    <>
                      <div className={`message_bubble ${msg.sender}`}>
                        <p className="chat-p-text">{msg.text}</p>
                      </div>
                      {msg.sender === "bot" && <SpeechButton text={msg.text} />}
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <div ref={chatEndRef} />
          </main>

          {/* Footer with Suggestions and Input */}
          <footer className="footer">
            {/* Suggestion Buttons */}
            <div className="suggestions-container">
              <button
                onClick={() => handleSuggestionClick("What is AiLab?")}
                className="suggestion-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-sm"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                What is AiLab?
              </button>
              <button
                onClick={() => handleSuggestionClick("Uniform")}
                className="suggestion-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-sm"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6"
                  />
                </svg>
                Uniform
              </button>
              <button
                onClick={() => handleSuggestionClick("FAQs")}
                className="suggestion-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-sm"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                FAQs
              </button>
            </div>

            {/* Message Input */}
            <div className="input-container">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                className="message-input"
              />

              <button
                onClick={() => handleSend(inputValue)}
                className="send-button"
                disabled={!inputValue.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </footer>
        </div>

        {/* <div className = "button-container">
                  <button className="button" id = "wyd"
                  onClick={() => navigate("/landing")}>
                  Exit
              </button>
            </div> */}
      </motion.div>
    </div>
  );
}

export default Chat;