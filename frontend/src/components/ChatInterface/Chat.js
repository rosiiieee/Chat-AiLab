import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 
 * This is a temporary UI
 *
 **/
const Chat = () => {
    const [messages, setMessages] = useState([
      {
        id: 1,
        text: "Hello! I'm your PLM Assistant. How can I help you today?",
        sender: "bot",
      },
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        // Add user message
        const userMessage = {
        id: Date.now(),
        text: inputValue,
        sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);

        // api call
        try {
            const response = await fetch("http://localhost:5000/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ message: inputValue }),
            });


            const data = await response.json();

            const botMessage = {
              id: Date.now() + 1,
              text: data.response,
              sender: "bot",
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error calling backend:", error);

            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting. Please try again.",
                sender: "bot",
            };

            setMessages((prev) => [...prev, errorMessage]);
        }
        


        setInputValue("");
    }

    const handleKeyPress = (e) => {
    if (e.key === "Enter") {
        handleSendMessage();
    }
    };


    const navigate = useNavigate();

    return (
      <div className="background">
        <motion.div className="landing-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
        <div className="chat-container">
            <div className="chat-header">
              <h2>PLM Assistant</h2>
              <p>This is a temporary chat ui for backend testing</p>
            </div>

            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.sender === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  <div className="message-content">{message.text}</div>
                </div>
              ))}
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="chat-input"
              />
              <button className="send-button">Send</button>
            </div>

            <div className = "button-container">
                  <button className="button" id = "wyd"
                  onClick={() => navigate("/landing")}>
                  Exit
              </button>
            </div>
          </div>
        </motion.div>
      </div>  
      
    );
}

export default Chat;