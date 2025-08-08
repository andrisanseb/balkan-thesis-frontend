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
  isRoundTrip,
}) => {
  const [daysData, setDaysData] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [orderedDestinations, setOrderedDestinations] = useState(selectedDestinations);

  // This handler will be called by DaysOrganiser
  const handleDaysData = (data) => {
    setDaysData(data);
    if (handleDaysDataChange) handleDaysDataChange(data);
  };

  // Calculate route using Google Maps JS API DirectionsService
  const calculateRoute = () => {
    if (!window.google || !window.google.maps || selectedDestinations.length < 2) return;

    // Use city names or addresses instead of lat/lng
    const origin = selectedDestinations[0].name; // or .address if available
    const destination = isRoundTrip
      ? origin
      : selectedDestinations[selectedDestinations.length - 1].name;

    const waypoints = isRoundTrip
      ? selectedDestinations.slice(1).map(d => ({
          location: d.name, // or d.address
          stopover: true,
        }))
      : selectedDestinations.slice(1, -1).map(d => ({
          location: d.name, // or d.address
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

          // Reorder destinations according to waypoint_order
          const waypointOrder = result.routes[0].waypoint_order || [];
          let newOrder = [];
          newOrder.push(selectedDestinations[0]);
          waypointOrder.forEach(idx => {
            newOrder.push(selectedDestinations[idx + 1]);
          });
          if (!isRoundTrip) {
            newOrder.push(selectedDestinations[selectedDestinations.length - 1]);
          } else {
            newOrder.push(selectedDestinations[0]);
          }
          setOrderedDestinations(newOrder);
        } else {
          setRouteData(null);
          setOrderedDestinations(selectedDestinations);
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
          selectedDestinations={orderedDestinations}
          onMapLoad={handleMapLoad}
          routeData={routeData}
        />
        <DaysOrganiser
          selectedDestinations={orderedDestinations}
          selectedActivities={selectedActivities}
          routeData={routeData}
          handleDaysDataChange={handleDaysData}
          planTitle={planTitle}
          setPlanTitle={setPlanTitle}
        />
      </div>
      <div className="button-row content-padding">
        <button onClick={onBack} className="back-btn">Back</button>
        <button onClick={handleSubmit} className="next-btn">Submit</button>
      </div>
    </div>
  );
};

export default Card3;