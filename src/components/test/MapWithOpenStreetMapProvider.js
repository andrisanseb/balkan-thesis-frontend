import React from 'react';
import { useEffect, useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapWithOpenStreetMapProvider = ({ selectedDestinations, routeData }) => {
  const [routeGeometry, setRouteGeometry] = useState([]);

  useEffect(() => {
    // Initialize the map
    const map = L.map('map').setView([41.7339, 24.4858], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
      language: 'en' // Specify the language option for English
    }).addTo(map);


    // Add markers for selected destinations
    selectedDestinations.forEach(destination => {
      L.marker([destination.latitude, destination.longitude]).addTo(map)
        .bindPopup(destination.name);
    });

    // Cleanup function to remove the map when the component unmounts
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div id="map" style={{ height: '650px', width: '100%' }}>
    </div>
  );
};

export default MapWithOpenStreetMapProvider;