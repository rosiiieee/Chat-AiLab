import React, { useState, useRef, useEffect } from "react";
import plmmap from "./map.png";
import "./Map.css";

export default function Map() {
  const [selectedPath, setSelectedPath] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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
    { id: "Facade", x: 0.19, y: 0.78 },
    { id: "1", x: 0.22, y: 0.83 },
    { id: "2", x: 0.425, y: 0.83 },
    { id: "3", x: 0.425, y: 0.9 },
    { id: "UAC", x: 0.29, y: 0.7 },
    // { id: "Tanghalan Bayan", x: 0.52, y: 0.58 },
    { id: "Canteen", x: 0.5, y: 0.79 },
    { id: "4", x: 0.565, y: 0.79 },
    { id: "5", x: 0.565, y: 0.74 },
    { id: "6", x: 0.46, y: 0.71 },
    { id: "GCA", x: 0.51, y: 0.92 },
    { id: "GV", x: 0.565, y: 0.86 },
    { id: "GK", x: 0.82, y: 0.78 },
    { id: "7", x: 0.82, y: 0.74 },
    { id: "8", x: 0.85, y: 0.74 },
    { id: "GB", x: 0.88, y: 0.48 },
    { id: "9", x: 0.85, y: 0.48 },
    { id: "10", x: 0.85, y: 0.255 },
    { id: "Gym", x: 0.79, y: 0.2 },
    { id: "11", x: 0.61, y: 0.255 },
    { id: "12", x: 0.79, y: 0.255 },
    { id: "GL", x: 0.61, y: 0.19 },
    { id: "13", x: 0.45, y: 0.255 },
    { id: "14", x: 0.45, y: 0.16 },
    { id: "JAA", x: 0.48, y: 0.16 },
    { id: "SSC Office", x: 0.36, y: 0.15 },
    { id: "Entrep BLDG", x: 0.37, y: 0.08 },
    { id: "15", x: 0.48, y: 0.08 },
    { id: "16", x: 0.29, y: 0.255 },
    { id: "17", x: 0.29, y: 0.1 },
    { id: "18", x: 0.29, y: 0.475 },
    { id: "Executive BLDG", x: 0.54, y: 0.06 },
    { id: "Chapel", x: 0.22, y: 0.1 },
    { id: "GA", x: 0.08, y: 0.44 },
    { id: "GEE", x: 0.15, y: 0.54 },
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

  function getShortestPathWithFallback(start, end, graph) {
    const path1 = findShortestPath(start, end);
    const path2 = findShortestPath(end, start);

    if (!path1 && !path2) return null;
    if (!path1) return path2.reverse();
    if (!path2) return path1;

    const shorter = path1.length <= path2.length ? path1 : path2.reverse();
    return shorter;
    }

  const handleFindPath = () => {
    if (!start || !end) return;
    const path = getShortestPathWithFallback(start, end);
    setSelectedPath(path);
  };


  return (
    <div className="map-page">
      <div className="map-controls">
        <select value={start} onChange={(e) => setStart(e.target.value)}>
            <option value="">From...</option>
            {nodes
                .filter(n => isNaN(n.id)) // removes "1", "2", etc.
                .map(n => (
                <option key={n.id} value={n.id}>{n.id}</option>
                ))}
            </select>

            <select value={end} onChange={(e) => setEnd(e.target.value)}>
            <option value="">To...</option>
            {nodes
                .filter(n => isNaN(n.id))
                .map(n => (
                <option key={n.id} value={n.id}>{n.id}</option>
                ))}
            </select>
        <button onClick={handleFindPath}>Find Path</button>
      </div>

      <div className="map-wrapper">
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
                    stroke="#ff3366"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
              );
            })}

          {nodes.map((node) => (
            <circle
              key={node.id}
              cx={node.x * dimensions.width}
              cy={node.y * dimensions.height}
              r={6}
              fill="transparent"
              stroke=""
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      {selectedPath.length > 0 && (
        <div className="path-info">Path: {selectedPath.join(" → ")}</div>
      )}
    </div>
  );
}
