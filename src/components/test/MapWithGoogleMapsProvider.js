import React from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

function getMapCenter(destinations) {
  if (destinations && destinations.length > 0) {
    return {
      lat: destinations[0].latitude,
      lng: destinations[0].longitude
    };
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
          <Marker
            key={dest.id}
            position={{ lat: dest.latitude, lng: dest.longitude }}
            title={dest.name}
          />
        ))}
        {routeData && (
          <DirectionsRenderer directions={routeData} />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapWithGoogleMapsProvider;