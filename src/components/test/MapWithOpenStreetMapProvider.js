import React from 'react';
import { useEffect, useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
const MapWithOpenStreetMapProvider = ({ selectedDestinations, routeData }) => {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map').setView([41.7339, 24.4858], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
      language: 'en' // Specify the language option for English
    }).addTo(map);

    // Define custom marker icon
    const customIcon = L.icon({
      iconUrl: process.env.PUBLIC_URL + "/map-pin.png", // Customize with your marker icon URL
      iconSize: [32, 32], // Size of the icon
      iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
    });

    // Add markers for selected destinations
    selectedDestinations.forEach(destination => {
      L.marker([destination.latitude, destination.longitude], { icon: customIcon }).addTo(map)
        .bindPopup(destination.name);
    });

    // Cleanup function to remove the map when the component unmounts
    return () => {
      map.remove();
    };
  }, [selectedDestinations]);

  return (
    <div id="map" style={{ height: '650px', width: '100%' }}></div>
  );
};

export default MapWithOpenStreetMapProvider;