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
  const calculateRoute = async () => {
    if (!window.google || !window.google.maps || selectedDestinations.length < 2) return;

    const origin = selectedDestinations[0].name;

    if (isRoundTrip) {
      // Round trip: start and finish at the same place
      const destination = origin;
      const waypoints = selectedDestinations.slice(1).map(d => ({
        location: d.name,
        stopover: true,
      }));

      const directionsService = new window.google.maps.DirectionsService();
      const routeRequest = {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      };

      directionsService.route(routeRequest, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setRouteData(result);
          // Reorder destinations according to waypoint_order
          const waypointOrder = result.routes[0].waypoint_order || [];
          let newOrder = [];
          newOrder.push(selectedDestinations[0]);
          waypointOrder.forEach(idx => {
            newOrder.push(selectedDestinations[idx + 1]);
          });
          if (isRoundTrip) {
            newOrder.push(selectedDestinations[0]);
          } else if (result.routes[0].legs.length > 0) {
            // For one-way, set the last leg's end_address as the final destination
            const lastLeg = result.routes[0].legs[result.routes[0].legs.length - 1];
            const endDest = selectedDestinations.find(
              d => d.name === lastLeg.end_address
            );
            if (endDest && !newOrder.includes(endDest)) {
              newOrder.push(endDest);
            }
          }
          setOrderedDestinations(newOrder);
        } else {
          setRouteData(null);
          setOrderedDestinations(selectedDestinations);
          console.error("Directions request failed due to " + status);
        }
      });
    } else {
      // One-way: try each possible finish, pick the best
      const candidates = selectedDestinations.slice(1);
      let bestResult = null;
      let bestDuration = Infinity;
      let bestOrder = [];

      const directionsService = new window.google.maps.DirectionsService();

      for (let i = 0; i < candidates.length; i++) {
        const destination = candidates[i].name;
        const waypoints = selectedDestinations
          .slice(1)
          .filter((d, idx) => idx !== i)
          .map(d => ({
            location: d.name,
            stopover: true,
          }));

        // Wrap in a promise for async/await
        const getRoute = () =>
          new Promise((resolve) => {
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
                  resolve(result);
                } else {
                  resolve(null);
                }
              }
            );
          });

        // eslint-disable-next-line no-await-in-loop
        const result = await getRoute();
        if (result) {
          const duration = result.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0);
          if (duration < bestDuration) {
            bestDuration = duration;
            bestResult = result;
            // Reorder destinations according to waypoint_order
            const waypointOrder = result.routes[0].waypoint_order || [];
            let newOrder = [];
            newOrder.push(selectedDestinations[0]);
            waypointOrder.forEach(idx => {
              // Skip the candidate destination
              const filtered = selectedDestinations.slice(1).filter((d, idx2) => idx2 !== i);
              newOrder.push(filtered[idx]);
            });
            newOrder.push(candidates[i]);
            bestOrder = newOrder;
          }
        }
      }

      if (bestResult) {
        setRouteData(bestResult);
        setOrderedDestinations(bestOrder);
      } else {
        setRouteData(null);
        setOrderedDestinations(selectedDestinations);
        console.error("Directions request failed for all candidates.");
      }
    }
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
          isRoundTrip={isRoundTrip}
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