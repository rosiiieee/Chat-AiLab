import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Send, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import plmmap from "./map.png";
import customMonument from "./monument.png"; 
import "./Map.css";
import gazeboIcon from "./gazebo.png"; 
import phFlagIcon from "./ph_flag.png"; 
import fountainIcon from "./fountain.png"; 
import muralIcon from "./mural.png"; 
import { buildings } from "./buildingsData";

export default function Map() {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromDropdownPosition, setFromDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [toDropdownPosition, setToDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const imgRef = useRef(null);
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (imgRef.current) {
        const { width, height } = imgRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    };

    const timer = setTimeout(updateDimensions, 100);
    
    const img = imgRef.current;
    if (img) {
      img.addEventListener('load', updateDimensions);
    }

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 150);
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      if (img) {
        img.removeEventListener('load', updateDimensions);
      }
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        // Check if click is inside the portal dropdown
        const dropdownElement = document.querySelector('[data-dropdown="from"]');
        if (!dropdownElement || !dropdownElement.contains(event.target)) {
          setShowFromDropdown(false);
        }
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        // Check if click is inside the portal dropdown
        const dropdownElement = document.querySelector('[data-dropdown="to"]');
        if (!dropdownElement || !dropdownElement.contains(event.target)) {
          setShowToDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update dropdown positions when they open
  useEffect(() => {
    if (showFromDropdown && fromDropdownRef.current) {
      const rect = fromDropdownRef.current.getBoundingClientRect();
      setFromDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showFromDropdown]);

  useEffect(() => {
    if (showToDropdown && toDropdownRef.current) {
      const rect = toDropdownRef.current.getBoundingClientRect();
      setToDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showToDropdown]);

  const nodes = [
    { id: "Facade", x: 0.17, y: 0.80, type: "hotspot" },
    { id: "1", x: 0.22, y: 0.83 },
    { id: "2", x: 0.425, y: 0.83 },
    { id: "3", x: 0.425, y: 0.9 },
    { id: "UAC", x: 0.30, y: 0.67, type: "monument" },
    { id: "Canteen", x: 0.5, y: 0.79, type: "gazebo" },
    { id: "4", x: 0.565, y: 0.79 },
    { id: "5", x: 0.565, y: 0.74 },
    { id: "6", x: 0.46, y: 0.71 },
    { id: "GCA", x: 0.51, y: 0.92, type: "hotel" },
    { id: "GV", x: 0.69, y: 0.86, type: "hotel" },
    { id: "GK", x: 0.77, y: 0.79, type: "hotel" },
    { id: "7", x: 0.82, y: 0.74 },
    { id: "8", x: 0.85, y: 0.74 },
    { id: "GB", x: 0.90, y: 0.50, type: "hotel" },
    { id: "9", x: 0.85, y: 0.48 },
    { id: "10", x: 0.85, y: 0.255 },
    { id: "Gym", x: 0.84, y: 0.14, type: "gazebo" },
    { id: "11", x: 0.61, y: 0.255 },
    { id: "12", x: 0.79, y: 0.255 },
    { id: "GL", x: 0.63, y: 0.19, type: "hotel" },
    { id: "13", x: 0.45, y: 0.255 },
    { id: "14", x: 0.45, y: 0.16 },
    { id: "JAA", x: 0.48, y: 0.16, type: "hotel" },
    { id: "SSC Office", x: 0.36, y: 0.15, type: "monument" },
    { id: "Entrep BLDG", x: 0.38, y: 0.08, type: "hotel" },
    { id: "15", x: 0.48, y: 0.08 },
    { id: "16", x: 0.29, y: 0.255 },
    { id: "17", x: 0.29, y: 0.1 },
    { id: "18", x: 0.29, y: 0.475 },
    { id: "Executive BLDG", x: 0.61, y: 0.06, type: "hotel" },
    { id: "Chapel", x: 0.12, y: 0.1, type: "chapel" },
    { id: "GA", x: 0.07, y: 0.43, type: "hotel" },
    { id: "GEE", x: 0.15, y: 0.53, type: "hotel" },
    { id: "19", x: 0.19, y: 0.54 },
    { id: "20", x: 0.15, y: 0.44 },
    { id: "Tanghalang Bayan", x: 0.51, y: 0.57, type: "hotel" },
    { id: "Pride Hall", x: 0.46, y: 0.64, type: "hotel" }
  ];

  const graph = {
    Facade: ["19", "1", "UAC"],
    UAC: ["19", "Facade", "1", "2", "6"],
    Canteen: ["2", "4"],
    GV: ["2", "4"],
    GCA: ["3"],
    GK: ["7"],
    GB: ["9"],
    Gym: ["12"],
    GL: ["11"],
    JAA: ["14"],
    "SSC Office": ["13", "14", "16"],
    "Entrep BLDG": ["17"],
    "Executive BLDG": ["15"],
    Chapel: ["17"],
    GA: ["20"],
    GEE: ["19", "20"],
    "Tanghalang Bayan": ["3", "6", "18", "Pride Hall"],
    "Pride Hall": ["Tanghalang Bayan", "3", "18"],
    "1": ["2", "UAC", "Facade"],
    "2": ["Canteen", "1", "3", "GV"],
    "3": ["2", "GCA", "Tanghalang Bayan", "Pride Hall"],
    "4": ["Canteen", "GV", "5"],
    "5": ["4", "6", "7"],
    "6": ["18", "2", "5"],
    "7": ["5", "8", "GK"],
    "8": ["7", "9"],
    "9": ["8", "10", "GB"],
    "10": ["9", "12"],
    "11": ["12", "13", "GL"],
    "12": ["Gym", "11"],
    "13": ["SSC Office", "14", "16"],
    "14": ["15", "JAA", "SSC Office", "13"],
    "15": ["14", "Executive BLDG"],
    "16": ["13", "17", "18"],
    "17": ["Entrep BLDG", "Chapel", "16"],
    "18": ["6", "16", "19", "UAC", "Tanghalang Bayan", "Pride Hall"],
    "19": ["18", "GEE", "Facade", "UAC"],
    "20": ["GEE", "GA"],
  };

  const legends = [
    { component: <img src={phFlagIcon} alt="Philippine Flag" className="legend-icon" />, label: "National Flag" }, 
    { component: <img src={gazeboIcon} alt="Gazebo Icon" className="legend-icon" />, label: "Gazebo" },
    { 
      component: (
        <img 
          src={customMonument} 
          alt="Monument" 
          className="legend-icon"
          style={{ width: '30px', height: '30px'}} 
        />
      ), 
      label: "Monument" 
    },
    { component: <img src={fountainIcon} alt="Fountain Icon" className="legend-icon" />, label: "Fountain" },
    { component: <img src={muralIcon} alt="Mural Icon" className="legend-icon" />, label: "Mural" }, 
  ];

  const getNode = (id) => nodes.find((n) => n.id === id);
  
  const dist = (a, b) => {
    const A = getNode(a);
    const B = getNode(b);
    if (!A || !B) return Infinity;
    return Math.hypot(
      (A.x - B.x) * dimensions.width,
      (A.y - B.y) * dimensions.height
    );
  };

  const findShortestPath = (start, end) => {
    const distances = {};
    const previous = {};
    const queue = new Set(Object.keys(graph));

    for (let node of queue) distances[node] = Infinity;
    distances[start] = 0;

    while (queue.size) {
      let current = [...queue].reduce((a, b) =>
        distances[a] < distances[b] ? a : b
      );
      queue.delete(current);
      if (current === end) break;

      for (let neighbor of graph[current] || []) {
        const alt = distances[current] + dist(current, neighbor);
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
        }
      }
    }

    const path = [];
    let u = end;
    while (u) {
      path.unshift(u);
      u = previous[u];
    }
    return path[0] === start ? path : [];
  };

  function getShortestPathWithFallback(start, end) {
    const path1 = findShortestPath(start, end);
    const path2 = findShortestPath(end, start);

    if (!path1 && !path2) return null;
    if (!path1) return path2.reverse();
    if (!path2) return path1;

    const shorter = path1.length <= path2.length ? path1 : path2.reverse();
    return shorter;
  }

  const handleSearch = () => {
    if (!searchFrom || !searchTo) return;
    const path = getShortestPathWithFallback(searchFrom, searchTo);
    setSelectedPath(path || []);
    setStart(searchFrom);
    setEnd(searchTo);
  };

  const handleBuildingClick = (building) => {
    navigate(`/building/${building.id}`);
  };

  const namedNodes = nodes.filter(n => isNaN(n.id));

  return (
    <div className="tour-ailab-container">
      <div className="tour-header">
        <h1 className="tour-title">Tour AiLab</h1>
      </div>

      <div className="tour-layout">
        <div className="left-panel">
          <div className="panel-card">
            <div className="input-group" style={{ position: 'relative', zIndex: 1001 }}>
              <label className="search-label">WHERE YOU AT?</label>
              <div className="search-wrapper" style={{ position: 'relative', zIndex: 1002 }}>
                <div style={{ position: 'relative', flex: 1 }} ref={fromDropdownRef}>
                  <MapPin size={16} color="#999" style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                  <input
                    type="text"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    onFocus={() => setShowFromDropdown(true)}
                    placeholder="current location"
                    className="search-input search-input-with-icon"
                    style={{ paddingRight: '2rem' }}
                  />
                  <ChevronDown 
                    size={16} 
                    color="#999" 
                    style={{ 
                      position: 'absolute', 
                      right: '0.6rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      cursor: 'pointer',
                      zIndex: 1 
                    }}
                    onClick={() => setShowFromDropdown(!showFromDropdown)}
                  />
                  {showFromDropdown && createPortal(
                    <div 
                      data-dropdown="from"
                      style={{
                      position: 'fixed',
                      top: `${fromDropdownPosition.top}px`,
                      left: `${fromDropdownPosition.left}px`,
                      width: `${fromDropdownPosition.width}px`,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 99999,
                      marginTop: '4px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      {namedNodes.map(n => (
                        <div
                          key={n.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSearchFrom(n.id);
                            setShowFromDropdown(false);
                          }}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            backgroundColor: searchFrom === n.id ? '#f0f0f0' : 'white'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = searchFrom === n.id ? '#f0f0f0' : 'white'}
                        >
                          {n.id}
                        </div>
                      ))}
                    </div>,
                    document.body
                  )}
                </div>
              </div>
            </div>

            <div className="input-group" style={{ position: 'relative', zIndex: 1001 }}>
              <label className="search-label">WHERE TO?</label>
              <div className="search-wrapper" style={{ position: 'relative', zIndex: 1002 }}>
                <div style={{ position: 'relative', flex: 1 }} ref={toDropdownRef}>
                  <Send size={16} color="#999" style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                  <input
                    type="text"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    onFocus={() => setShowToDropdown(true)}
                    placeholder="where to"
                    className="search-input-with-button search-input-with-icon"
                    style={{ paddingRight: '2rem' }}
                  />
                  <ChevronDown 
                    size={16} 
                    color="#999" 
                    style={{ 
                      position: 'absolute', 
                      right: '0.6rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      cursor: 'pointer',
                      zIndex: 1 
                    }}
                    onClick={() => setShowToDropdown(!showToDropdown)}
                  />
                  {showToDropdown && createPortal(
                    <div 
                      data-dropdown="to"
                      style={{
                      position: 'fixed',
                      top: `${toDropdownPosition.top}px`,
                      left: `${toDropdownPosition.left}px`,
                      width: `${toDropdownPosition.width}px`,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 99999,
                      marginTop: '4px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      {namedNodes.map(n => (
                        <div
                          key={n.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSearchTo(n.id);
                            setShowToDropdown(false);
                          }}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            backgroundColor: searchTo === n.id ? '#f0f0f0' : 'white'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = searchTo === n.id ? '#f0f0f0' : 'white'}
                        >
                          {n.id}
                        </div>
                      ))}
                    </div>,
                    document.body
                  )}
                </div>
                <button onClick={handleSearch} className="search-button">
                  <Search size={18} color="white" />
                </button>
              </div>
            </div>
          </div>

          <div className="legends-and-mascot-container">
            <div className="panel-card legends-container">
              <h3 className="legends-title">LEGENDS</h3>
              <div className="legends-divider">
                <div className="legends-list">
                  {legends.map((legend, i) => (
                    <div key={i} className="legend-item">
                      <div className="legend-emoji">
                        {legend.component || legend.emoji}
                      </div>
                      <span className="legend-label">{legend.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <div className="map-container">
            <img ref={imgRef} src={plmmap} alt="Campus Map" className="map-image" />
            {dimensions.width > 0 && dimensions.height > 0 && (
              <svg 
                className="map-overlay"
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {selectedPath.length > 1 &&
                  selectedPath.map((id, i) => {
                    const next = selectedPath[i + 1];
                    if (!next) return null;
                    const A = getNode(id);
                    const B = getNode(next);
                    return (
                      <line
                        key={`${id}-${next}`}
                        className="animated-line"
                        x1={A.x * dimensions.width}
                        y1={A.y * dimensions.height}
                        x2={B.x * dimensions.width}
                        y2={B.y * dimensions.height}
                        stroke="#FF1493"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    );
                  })}
                
                {buildings.map((building) => (
                  <g key={building.id}>
                    <circle
                      cx={building.x * dimensions.width}
                      cy={building.y * dimensions.height}
                      r="20"
                      fill="transparent"
                      stroke="transparent"
                      strokeWidth="3"
                      opacity="0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleBuildingClick(building)}
                    />
                    <text
                      x={building.x * dimensions.width}
                      y={building.y * dimensions.height + 5}
                      fill="transparent"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      style={{ cursor: 'pointer', pointerEvents: 'none' }}
                    >
                      {building.code}
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </div>

          <div className="instruction-box">
            <p className="instruction-title">Choose a building to explore</p>
            <p className="instruction-subtitle">Just click the one you'd like to enter!</p>
          </div>
        </div>
      </div>
    </div>
  );
}