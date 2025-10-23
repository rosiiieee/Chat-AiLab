import alab from '../../draft_alab.gif';
import flamed from '../../flamehead.gif';
import {motion, AnimatePresence} from 'framer-motion';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Intro.css';

export default function Intro() {
  const [particles, setParticles] = useState([]);
  const [showFireworks, setShowFireworks] = useState(true);
  const navigate = useNavigate();

  // create random particles
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 800, // random X direction
      y: (Math.random() - 0.5) * 800, // random Y direction
      color: `hsl(289, ${50 + Math.random() * 20}%, ${55 + Math.random() * 15}%)`,
    }));
    setParticles(newParticles);
    
    const fadeTimer = setTimeout(() => setShowFireworks(false), 3500);

    // 2️⃣ Navigate after fade
    const navTimer = setTimeout(() => navigate("/landing"), 4500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
}, [navigate]);

  return (
    <div className = "background">
      <AnimatePresence mode="wait">
        {showFireworks && (
          <motion.div
            key="fireworks"
            className="fireworks-container"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1,
              transition: { duration: 0.8, ease: "easeInOut" },
            }}
          >
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="particle"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  x: p.x,
                  y: p.y,
                  scale: [1, 2, 0],
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 0,
                  delay: 0.3,
                }}
                style={{
                  backgroundColor: p.color,
                }}
              />
            ))}

            <motion.div
              className="center-logo"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 0.2, opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <img src={flamed} alt="AiLab" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    
  );
}