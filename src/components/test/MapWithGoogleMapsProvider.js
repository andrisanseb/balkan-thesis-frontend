import React from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

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

function MapWithGoogleMapsProvider({ selectedDestinations, onMapLoad, routeData }) {
  const center = getMapCenter(selectedDestinations);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
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
    </LoadScript>
  );
}

export default MapWithGoogleMapsProvider;