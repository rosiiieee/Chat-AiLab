import React, { useState, useRef, useEffect } from "react";
import { MapPin, Search, Send } from "lucide-react";
import plmmap from "./map.png";
import customMonument from "./monument.png"; 
import "./Map.css";
import gazeboIcon from "./gazebo.png"; 
import phFlagIcon from "./ph_flag.png"; 
import fountainIcon from "./fountain.png"; 
import chapelIcon from "./chapel.png"; 
import muralIcon from "./mural.png"; 

export default function Map() {
  const [selectedPath, setSelectedPath] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const imgRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (imgRef.current) {
        const { width, height } = imgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nodes = [
    { id: "Facade", x: 0.19, y: 0.78, type: "hotspot" },
    { id: "1", x: 0.22, y: 0.83 },
    { id: "2", x: 0.425, y: 0.83 },
    { id: "3", x: 0.425, y: 0.9 },
    { id: "UAC", x: 0.29, y: 0.7, type: "monument" },
    { id: "Canteen", x: 0.5, y: 0.79, type: "gazebo" },
    { id: "4", x: 0.565, y: 0.79 },
    { id: "5", x: 0.565, y: 0.74 },
    { id: "6", x: 0.46, y: 0.71 },
    { id: "GCA", x: 0.51, y: 0.92, type: "hotel" },
    { id: "GV", x: 0.565, y: 0.86, type: "hotel" },
    { id: "GK", x: 0.82, y: 0.78, type: "hotel" },
    { id: "7", x: 0.82, y: 0.74 },
    { id: "8", x: 0.85, y: 0.74 },
    { id: "GB", x: 0.88, y: 0.48, type: "hotel" },
    { id: "9", x: 0.85, y: 0.48 },
    { id: "10", x: 0.85, y: 0.255 },
    { id: "Gym", x: 0.79, y: 0.2, type: "gazebo" },
    { id: "11", x: 0.61, y: 0.255 },
    { id: "12", x: 0.79, y: 0.255 },
    { id: "GL", x: 0.61, y: 0.19, type: "hotel" },
    { id: "13", x: 0.45, y: 0.255 },
    { id: "14", x: 0.45, y: 0.16 },
    { id: "JAA", x: 0.48, y: 0.16, type: "hotel" },
    { id: "SSC Office", x: 0.36, y: 0.15, type: "monument" },
    { id: "Entrep BLDG", x: 0.37, y: 0.08, type: "hotel" },
    { id: "15", x: 0.48, y: 0.08 },
    { id: "16", x: 0.29, y: 0.255 },
    { id: "17", x: 0.29, y: 0.1 },
    { id: "18", x: 0.29, y: 0.475 },
    { id: "Executive BLDG", x: 0.54, y: 0.06, type: "hotel" },
    { id: "Chapel", x: 0.22, y: 0.1, type: "chapel" }, 
    { id: "GA", x: 0.08, y: 0.44, type: "hotel" },
    { id: "GEE", x: 0.15, y: 0.54, type: "hotel" },
    { id: "19", x: 0.19, y: 0.54 },
    { id: "20", x: 0.15, y: 0.44 },
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
    "1": ["2", "UAC", "Facade"],
    "2": ["Canteen", "1", "3", "GV"],
    "3": ["2", "GCA"],
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
    "18": ["6", "16", "19", "UAC"],
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
    { component: <img src={chapelIcon} alt="Chapel Icon" className="legend-icon" />, label: "Chapel" },
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

  const namedNodes = nodes.filter(n => isNaN(n.id));

  return (
    <div className="tour-ailab-container">
      <div className="tour-header">
        <h1 className="tour-title">Tour AiLab</h1>
      </div>

      <div className="tour-layout">
        <div className="left-panel">
          <div className="panel-card">
            <div className="input-group">
              <label className="search-label">WHERE YOU AT?</label>
              <div className="search-wrapper">
                <div style={{ position: 'relative', flex: 1 }}>
                  <MapPin size={16} color="#999" style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                  <input
                    type="text"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    placeholder="current location"
                    list="from-locations"
                    className="search-input search-input-with-icon"
                  />
                </div>
              </div>
              <datalist id="from-locations">
                {namedNodes.map(n => <option key={n.id} value={n.id} />)}
              </datalist>
            </div>

            <div className="input-group">
              <label className="search-label">WHERE TO?</label>
              <div className="search-wrapper">
                <div style={{ position: 'relative', flex: 1 }}>
                  <Send size={16} color="#999" style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                  <input
                    type="text"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    placeholder="where to"
                    list="to-locations"
                    className="search-input-with-button search-input-with-icon"
                  />
                </div>
                <button onClick={handleSearch} className="search-button">
                  <Search size={18} color="white" />
                </button>
              </div>
              <datalist id="to-locations">
                {namedNodes.map(n => <option key={n.id} value={n.id} />)}
              </datalist>
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

        <div style={{ position: 'relative' }}>
          <div className="map-container">
            <img ref={imgRef} src={plmmap} alt="Campus Map" className="map-image" />
            <svg className="map-overlay">
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
              {nodes.map((node) => {
                if (node.type === "chapel") {
                  const iconSize = 24;
                  return (
                    <image
                      key={node.id}
                      href={chapelIcon}
                      x={node.x * dimensions.width - iconSize / 2}
                      y={node.y * dimensions.height - iconSize / 2}
                      height={iconSize}
                      width={iconSize}
                    />
                  );
                }
                return null;
              })}
            </svg>
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
