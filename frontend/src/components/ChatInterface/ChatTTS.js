import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import draft_alab_hi from "../../draft_alab_hi.gif";
import flamehead from "../../flamehead.gif";
import useChatAnimation from "./useChatAnimation";
import "./Chat.css";
import { Mic, MicOff, Send } from "lucide-react";

export default function ChatTTS() {
    const navigate = useNavigate();
    const threadId = localStorage.getItem("uuid");
    const recognitionRef = useRef(null);
    const chatEndRef = useChatAnimation();

    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false); 
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [showRobot, setShowRobot] = useState(true); 

    useEffect(() => {
        const supported = 'webkitSpeechRecognition' in window;
        setIsSpeechSupported(supported);
        
        if (!supported) {
            console.warn('Speech recognition not supported in this browser');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            if (historyLoaded) return;
            
            try {
                const response = await fetch("/api/history", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ thread_id: threadId }),
                });

                const data = await response.json();

                if (data.status === "success" && Array.isArray(data.history)) {
                    const mappedMessages = data.history.map((msg, index) => ({
                        id: Date.now() + index, 
                        text: msg.content,
                        sender: msg.role === "assistant" ? "bot" : "user",
                    }));

                    if (mappedMessages.length > 0) {
                        setMessages(mappedMessages);
                        setShowRobot(false); 
                    }
                    setHistoryLoaded(true);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };

        if (threadId) {
            fetchHistory();
        } else {
            setHistoryLoaded(true);
        }
    }, [threadId, historyLoaded]);

    const speakText = (text) => {
        if (!window.speechSynthesis || !text) return;

        window.speechSynthesis.cancel(); 
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.pitch = 1;
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
    };

    const startListening = async () => {
        if (!isSpeechSupported) {
            alert("Speech Recognition not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        try {
            // Request microphone access
            await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
            alert("Microphone access denied. Please allow microphone to use speech recognition.");
            return;
        }

        // Initialize recognition
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            console.log('Speech recognition started');
        };
        
        recognition.onend = () => {
            setIsListening(false);
            console.log('Speech recognition ended');
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            
            setInputValue(transcript); 

            setTimeout(() => {
                handleSend(transcript);
            }, 50); 
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const handleSend = async (text = null) => {
        const msgText = (text ?? inputValue).trim();
        if (!msgText) return;

        if (showRobot) setShowRobot(false);

        const newUserMessage = {
            id: Date.now(),
            text: msgText,
            sender: "user",
        };

        setMessages((prev) => [
            ...prev.filter((m) => m.sender !== "typing"),
            newUserMessage,
            { id: "typing", sender: "typing" },
        ]);
        
        setInputValue("");

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msgText, thread_id: threadId }),
            });

            const data = await response.json();

            const botMessage = {
                id: Date.now() + 1,
                text: data.response,
                sender: "bot",
            };

            setMessages((prev) => [
                ...prev.filter((m) => m.sender !== "typing"),
                botMessage,
            ]);
            
            speakText(data.response);

        } catch (error) {
            console.error("Error calling backend:", error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting. Please try again.",
                sender: "bot",
            };

            setMessages((prev) => [
                ...prev.filter((m) => m.sender !== "typing"),
                errorMessage
            ]);
            speakText(errorMessage.text);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(inputValue);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion);
    };

    return (
        <div className="backgroundch">
            <motion.div
                className="chatting-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="app-container">
                    
                    {/* Header */}
                    <header className="header">
                        <h1 className="header-title">Chat Ailab</h1>
                        <button className="logo-button" onClick={() => navigate("/chat")}>
                            <div className="icon-logo-container">
                                <img src={flamehead} className="icon-md" alt="flamehead" />
                            </div>
                        </button>
                    </header>

                    {/* Alab Intro (Robot Greeting) */}
                    <AnimatePresence>
                        {showRobot && (
                            <motion.div
                                className="alab-container"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 100 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="alab-with-bubble">
                                    <img src={draft_alab_hi} alt="Alab Robot" className="robot-gif" />
                                    <div className="alab-bubble">
                                        Hold the microphone button!
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat Messages */}
                    <main className="chat-area">
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`message-container ${msg.sender}`}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {msg.sender === "typing" ? (
                                        <div className="typing-indicator">
                                            <span className="typing-text">Thinking</span>
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                        </div>
                                    ) : (
                                        <div className={`message_bubble ${msg.sender}`}>
                                            {/* RENDER LOGIC FOR READABILITY (CSS: bot-response-text) */}
                                            {msg.sender === "bot" ? (
                                                <div className="bot-response-text">
                                                    {msg.text}
                                                </div>
                                            ) : (
                                                <p className="chat-p-text">{msg.text}</p>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={chatEndRef} />
                    </main>

                    {/* Footer Input and Suggestions */}
                    <footer className="footer">
                        
                        {/* Suggestion Buttons */}
                        <div className="suggestions-container">
                            <button
                                onClick={() => handleSuggestionClick("What is AiLab?")}
                                className="suggestion-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                What is AiLab?
                            </button>
                            <button
                                onClick={() => handleSuggestionClick("Uniform")}
                                className="suggestion-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
                                </svg>
                                Uniform
                            </button>
                            <button
                                onClick={() => handleSuggestionClick("FAQs")}
                                className="suggestion-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                FAQs
                            </button>
                        </div>

                        {/* Input Wrapper - Contains input container and external mic */}
                        <div className="input-wrapper">
                            <div className="input-container2">
                                <input
                                    type="text"
                                    placeholder="Type your message here..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="message-input"
                                />
                                <button
                                    className="send-button2"
                                    onClick={() => handleSend(inputValue)}
                                    disabled={!inputValue.trim()}
                                    title="Send message"
                                >
                                    <Send size={22} />
                                </button>
                            </div>

                            {/* Mic Button */}
                            <button
                                onClick={() => (isListening ? stopListening() : startListening())}
                                className={`mic-button-external ${isListening ? "listening" : ""}`}
                                style={{ 
                                    display: 'flex',
                                    flexShrink: 0,
                                }}
                                title={
                                    !isSpeechSupported 
                                        ? "Speech recognition not supported" 
                                        : isListening 
                                        ? "Stop listening" 
                                        : "Tap to speak"
                                }
                                disabled={!isSpeechSupported}
                            >
                                {isListening ? (
                                    <MicOff size={22} strokeWidth={2} />
                                ) : (
                                    <Mic size={22} strokeWidth={2} />
                                )}
                            </button>
                        </div>
                    </footer>
                </div>
            </motion.div>
        </div>
    );
}