import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';
import './Sidebar.css';
import alabHead from '../../alab_head.png';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (page) => {
    if (onNavigate) onNavigate(page);
    navigate(`/${page}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="sidebar-hamburger"
        aria-label="Toggle menu"
      >
        <Menu size={28} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <button
          onClick={toggleMenu}
          className="sidebar-close-btn"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
        
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="sidebar-header-left">
            <div className="sidebar-character-icon">
              <img 
               src={alabHead}
               className="sidebar-character-img" 
               alt="Character"
              />
            </div>
            
            <p className="sidebar-title">
              <span className="purple-part">Ai</span>Lab
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
              <button
                onClick={() => handleNavigation('landing')}
                className="sidebar-menu-btn"
              >
                Home
              </button>
            </li>
            <li className="sidebar-menu-item">
              <button
                onClick={() => handleNavigation('chat')}
                className="sidebar-menu-btn"
              >
                Chat and Talk with Alab
              </button>
            </li>
            <li className="sidebar-menu-item">
              <button
                onClick={() => handleNavigation('map')}
                className="sidebar-menu-btn"
              >
                Tour with Alab
              </button>
            </li>
          </ul>
        </nav>

        {/* Exit Button at Bottom */}
        <div className="sidebar-exit-container">
          <button
            onClick={() => handleNavigation('exit')}
            className="sidebar-exit-btn"
          >
            Exit
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

