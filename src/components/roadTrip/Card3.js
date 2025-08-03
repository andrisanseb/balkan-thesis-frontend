import React, { useState, useEffect } from "react";
import MapWithGoogleMapsProvider from "../test/MapWithGoogleMapsProvider";
import DaysOrganiser from "./DaysOrganiser";

const Card3 = ({
  selectedDestinations,
  selectedActivities,
  handleDaysDataChange,
  createRoadTrip,
  planTitle,
  setPlanTitle,
  routeData,
  setRouteData,
  onBack,
}) => {
  const [daysData, setDaysData] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // This handler will be called by DaysOrganiser
  const handleDaysData = (data) => {
    setDaysData(data);
    if (handleDaysDataChange) handleDaysDataChange(data);
  };

  // Calculate route using Google Maps JS API DirectionsService
  const calculateRoute = () => {
    if (!window.google || !window.google.maps || selectedDestinations.length < 2) return;

    const origin = { lat: selectedDestinations[0].latitude, lng: selectedDestinations[0].longitude };
    const destination = origin;
    const waypoints = selectedDestinations.slice(1).map(d => ({
      location: { lat: d.latitude, lng: d.longitude },
      stopover: true,
    }));

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setRouteData(result);
        } else {
          setRouteData(null);
          console.error("Directions request failed due to " + status);
        }
      }
    );
  };

  // Only calculate route after map is loaded and destinations are set
  useEffect(() => {
    if (mapLoaded && selectedDestinations.length > 1) {
      calculateRoute();
    }
    // eslint-disable-next-line
  }, [mapLoaded, selectedDestinations]);

  // Handler for map load event
  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const handleSubmit = () => {
    createRoadTrip(daysData);
  };

  return (
    <div className="content-wrapper">
      <div>
        <MapWithGoogleMapsProvider
          selectedDestinations={selectedDestinations}
          onMapLoad={handleMapLoad}
          routeData={routeData}
        />
        <DaysOrganiser
          selectedDestinations={selectedDestinations}
          selectedActivities={selectedActivities}
          routeData={routeData}
          handleDaysDataChange={handleDaysData}
          planTitle={planTitle}
          setPlanTitle={setPlanTitle}
        />
      </div>
      <div className="button-row">
        <button onClick={onBack} className="back-btn">Back</button>
        <button onClick={handleSubmit} className="next-btn">Submit</button>
      </div>
    </div>
  );
};

export default Card3;