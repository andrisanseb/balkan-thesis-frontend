import React from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { FaSpinner } from "react-icons/fa";

const containerStyle = {
  width: '100%',
  height: '400px'
};

function isValidLatLng(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng);
}

function getMapCenter(destinations) {
  if (destinations && destinations.length > 0) {
    const { latitude, longitude } = destinations[0];
    if (isValidLatLng(latitude, longitude)) {
      return { lat: latitude, lng: longitude };
    }
  }
  return { lat: 42.5, lng: 20.9 };
}

const GOOGLE_MAP_LIBRARIES = ['places'];

function MapWithGoogleMapsProvider({ selectedDestinations, onMapLoad, routeData }) {
  const center = getMapCenter(selectedDestinations);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  if (loadError) {
    return <div>Error loading map</div>;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      {!isLoaded && (
        <div className="loading-container" style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.7)",
          zIndex: 2
        }}>
          <FaSpinner className="spinner" />
        </div>
      )}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={6}
          onLoad={onMapLoad}
        >
          {selectedDestinations && selectedDestinations.map(dest => (
            isValidLatLng(dest.latitude, dest.longitude) ? (
              <Marker
                key={dest.id}
                position={{ lat: dest.latitude, lng: dest.longitude }}
                title={dest.name}
              />
            ) : null
          ))}
          {routeData && (
            <DirectionsRenderer directions={routeData} />
          )}
        </GoogleMap>
      )}
    </div>
  );
}

export default MapWithGoogleMapsProvider;