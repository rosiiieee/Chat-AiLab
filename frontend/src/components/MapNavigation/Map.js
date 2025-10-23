import {motion, AnimatePresence} from 'framer-motion';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Map.css';

const Map = () => {
    const navigate = useNavigate();

    return(
        <div className = "background">
            <motion.div className="landing-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className = "heading">
                wala pa hehe
            </div>
            <div className = "button-container">
                <button className="button" id = "wyd"
                onClick={() => navigate("/landing")}>
                Exit
            </button>
            </div>
          </motion.div>
            
            
        </div>
    );
}

export default Map;