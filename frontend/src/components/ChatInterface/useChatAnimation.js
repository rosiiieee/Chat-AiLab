import { useEffect, useRef } from "react";

const useChatAnimation = (messages) => {
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return chatEndRef;
};

export default useChatAnimation;