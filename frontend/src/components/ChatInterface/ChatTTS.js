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
    const isInitializedRef = useRef(false);
    const FAQ_prompt = `
    Frequently Asked Questions:\n
    1. What are the requirements to maintain my scholarship?\n
    2. When would I get dismissed or disqualified from my program? \n
    3. How do I apply for a Leave of Absence (LOA)?\n
    4. What are the rules for uniforms, dress code, and IDs?"\n
    5. What offenses will get me suspended or expelled?\n
    `

    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false); 
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [showRobot, setShowRobot] = useState(true);

    // Detect if user is on iOS
    const isIOS = () => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    };

    // Detect if user is on mobile
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    useEffect(() => {
        // Check for speech recognition support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const supported = !!SpeechRecognition;
        setIsSpeechSupported(supported);
        
        if (!supported) {
            console.warn('Speech recognition not supported in this browser');
        } else {
            console.log('Speech recognition is supported');
        }

        // Check if HTTPS (required for mobile)
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            console.warn('HTTPS is required for microphone access on mobile devices');
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch (e) {
                    console.log('Error aborting recognition:', e);
                }
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

    const initializeRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;

        const recognition = new SpeechRecognition();
        
        // Critical settings for mobile
        recognition.continuous = false; // IMPORTANT: false works better on mobile
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
        };
        
        recognition.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
            isInitializedRef.current = false;
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            isInitializedRef.current = false;
            
            let errorMessage = '';
            switch(event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try speaking again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not accessible. Please check your device settings.';
                    break;
                case 'not-allowed':
                    if (isIOS()) {
                        errorMessage = 'Microphone access denied. On iOS, you may need to enable "Dictation" in Settings > General > Keyboards > Enable Dictation.';
                    } else {
                        errorMessage = 'Microphone permission denied. Please allow microphone access in your browser settings.';
                    }
                    break;
                case 'network':
                    errorMessage = 'Network error. Speech recognition requires an internet connection.';
                    break;
                case 'service-not-allowed':
                    if (isIOS()) {
                        errorMessage = 'Speech recognition not enabled. Go to Settings > General > Keyboards and enable "Dictation".';
                    } else {
                        errorMessage = 'Speech recognition service not available.';
                    }
                    break;
                case 'aborted':
                    // User stopped manually, no alert needed
                    return;
                default:
                    errorMessage = `Error: ${event.error}. Please try again.`;
            }
            
            if (errorMessage) {
                alert(errorMessage);
            }
        };

        recognition.onresult = (event) => {
            console.log('Speech result received');
            const transcript = event.results[0][0].transcript;
            console.log('Transcript:', transcript);
            
            setInputValue(transcript);

            // Send immediately after recognition completes
            setTimeout(() => {
                handleSend(transcript);
            }, 100);
        };

        return recognition;
    };

    const startListening = async () => {
        if (!isSpeechSupported) {
            let message = "Speech Recognition is not supported in this browser.";
            if (isIOS()) {
                message += " On iOS, please use Safari browser and ensure 'Dictation' is enabled in Settings > General > Keyboards.";
            } else {
                message += " Please use Chrome, Safari, or Edge.";
            }
            alert(message);
            return;
        }

        // Prevent multiple initializations
        if (isInitializedRef.current || isListening) {
            console.log('Recognition already running');
            return;
        }

        // Request microphone permission FIRST - crucial for mobile
        try {
            console.log('Requesting microphone access...');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Microphone access granted');
            
            // Stop the stream immediately
            stream.getTracks().forEach(track => track.stop());
            
            // Small delay before starting recognition (helps on mobile)
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (err) {
            console.error('Microphone access error:', err);
            
            let errorMessage = "Could not access microphone. ";
            
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                if (isIOS()) {
                    errorMessage += "On iOS:\n1. Go to Settings > Safari > Microphone\n2. Allow microphone access\n3. Also enable Settings > General > Keyboards > Dictation";
                } else {
                    errorMessage += "Please allow microphone access in your browser settings and reload the page.";
                }
            } else if (err.name === 'NotFoundError') {
                errorMessage += "No microphone found on your device.";
            } else if (err.name === 'NotReadableError') {
                errorMessage += "Microphone is already in use by another app. Please close other apps and try again.";
            } else if (err.name === 'SecurityError') {
                errorMessage += "HTTPS connection is required for microphone access.";
            } else {
                errorMessage += err.message || "Please check your settings.";
            }
            
            alert(errorMessage);
            return;
        }

        // Initialize and start recognition
        try {
            const recognition = initializeRecognition();
            if (!recognition) {
                alert('Could not initialize speech recognition');
                return;
            }

            recognitionRef.current = recognition;
            isInitializedRef.current = true;
            
            console.log('Starting recognition...');
            recognition.start();
            
        } catch (error) {
            console.error('Failed to start recognition:', error);
            isInitializedRef.current = false;
            
            if (error.message && error.message.includes('already started')) {
                // Recognition already running, stop and try again
                if (recognitionRef.current) {
                    recognitionRef.current.abort();
                }
                setTimeout(() => startListening(), 300);
            } else {
                alert('Failed to start speech recognition. Please try again.');
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
                console.log('Stopping recognition');
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
        setIsListening(false);
        isInitializedRef.current = false;
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

    const getMicButtonTitle = () => {
        if (!isSpeechSupported) {
            if (isIOS()) {
                return "Speech recognition not supported. Use Safari and enable Dictation in Settings.";
            }
            return "Speech recognition not supported in this browser";
        }
        return isListening ? "Tap to stop listening" : "Tap to speak";
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
                                        {isMobile() ? "Tap the microphone button!" : "Click the microphone button!"}
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
                                onClick={() => handleSuggestionClick(FAQ_prompt)}
                                className="suggestion-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                FAQs
                            </button>
                        </div>

                        {/* Input Wrapper */}
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

                            {/* Mic Button - Direct user action required */}
                            <button
                                onTouchStart={(e) => {
                                    e.preventDefault();
                                    if (isListening) {
                                        stopListening();
                                    } else {
                                        startListening();
                                    }
                                }}
                                onClick={(e) => {
                                    // Fallback for non-touch devices
                                    if (isListening) {
                                        stopListening();
                                    } else {
                                        startListening();
                                    }
                                }}
                                className={`mic-button-external ${isListening ? "listening" : ""}`}
                                style={{ 
                                    display: 'flex',
                                    flexShrink: 0,
                                    WebkitTapHighlightColor: 'transparent',
                                    touchAction: 'manipulation'
                                }}
                                title={getMicButtonTitle()}
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