import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { buildings } from './buildingsData';
import plmmap from './map.png';
import './BuildingDetails.css';
import myMarkerGif from '../../draft_alab.gif';

export default function BuildingDetails() {
  const { buildingId } = useParams();
  const navigate = useNavigate();

  const building = buildings.find(b => b.id === buildingId);

  const buildingsWithoutScroll = [
    'UAC',
    'Pride Hall',
    'Tanghalang Bayan',
    'Executive BLDG',
    'Entrep BLDG',
    'SSC Office',
    'Chapel'
  ];

  const showOnlyName = buildingsWithoutScroll.includes(building?.id);

  if (!building) {
    return (
      <div className="building-details-container">
        <div className="building-not-found">
          <h2>Building not found</h2>
          <button onClick={() => navigate('/map')} className="back-button-simple">
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="building-details-container">
      <div className="building-header">
        <h1 className="header-title">Tour AiLab</h1>
      </div>

      <button onClick={() => navigate('/map')} className="back-button-new">
        <ChevronLeft size={20} />
        <span>BACK</span>
      </button>

      <div className={`map-section ${!building.floorPlanImage ? 'no-3d-layout' : ''}`}>
        {/* 3D Building Image - Only show if exists */}
        {building.floorPlanImage && (
          <div className="building-3d-container">
            <img 
              src={building.floorPlanImage} 
              alt={`${building.name} Floor Plan`}
              className="building-3d-image"
            />
          </div>
        )}

        <div className="campus-map-container">
          <img src={plmmap} alt="Campus Map" className="campus-map-image" />
        </div>
        
        {/* Animated marker at building location */}
        <div 
          className="building-marker-pulse"
          style={{
            left: `calc(${building.x * 100}% + ${building.markerOffsetX || 0}px)`,
            top: `calc(${building.y * 100}% + ${building.markerOffsetY || 0}px)`,
          }}
        >
          <img
            src={myMarkerGif}
            alt="Building marker"
            className="marker-gif"
          />    
        </div>
      </div>

      {showOnlyName ? (
        <div className="building-name-card">
          <h2 className="building-name-simple">{building.name}</h2>
        </div>
      ) : (
        <div className="facilities-scroll-card">
          <h2 className="building-name-title">{building.name}</h2>
          <div className="facilities-divider"></div>
          
          <div className="facilities-scroll-content">
            {building.floors && building.floors.length > 0 ? (
              building.floors.map((floor, index) => (
                <div key={index} className="floor-section">
                  <h3 className="floor-title">{floor.name}</h3>
                  <ul className="floor-facilities-list">
                    {floor.facilities.map((facility, i) => (
                      <li key={i} className="facility-item-scroll">{facility}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="floor-section">
                <h3 className="floor-title">Facilities</h3>
                <ul className="floor-facilities-list">
                  {building.facilities.map((facility, i) => (
                    <li key={i} className="facility-item-scroll">{facility}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}