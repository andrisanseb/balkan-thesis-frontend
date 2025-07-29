import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "../../styles/RoadTrip.css";
import { useLocation } from "react-router-dom";
import MapWithOpenStreetMapProvider from "../test/MapWithOpenStreetMapProvider";
import ActivitySelector from "./ActivitySelector";
import DestinationsSelector from "./DestinationsSelector";
import Card3 from "./Card3";

const RoadTrip = ({ destinations }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [currentView, setCurrentView] = useState(1);
  const [daysData, setDaysData] = useState(null);

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const location = useLocation();

  // Route
  const openRouteServiceApiKey = process.env.REACT_APP_OPEN_ROUTE_SERVICE_API_KEY;
  
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    return () => {
      setSelectedDestinations([]);
      setCurrentView(1);
      setRouteData(null);
      setDaysData(null);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (currentView === 2 && routeData == null) {
      calculateRoute();
    }
  }, [currentView]);

  if (!destinations) {  //TODO: create and use loading spinner
    return <div>Loading...</div>;
  }

  const handleSelectedActivitiesChange = (activities) => {
    setSelectedActivities(activities);
  };

  const handleDaysDataChange = (days) => {
    setDaysData(days);
  };

  const addSelectedDestination = (destination) => {
    setSelectedDestinations((prevSelectedDestinations) => [
      ...prevSelectedDestinations,
      destination,
    ]);
  };

  const removeSelectedDestination = (destination) => {
    const updatedSelectedDestinations = selectedDestinations.filter(
      (selectedDestination) => selectedDestination !== destination
    );
    setSelectedDestinations(updatedSelectedDestinations);
  };

  const nextView = () => {
    setCurrentView((prev) => prev + 1);
  };

  const prevView = () => {
    setCurrentView((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // optimal order of destinations
  //const turf = require("@turf/turf");
  // TODO: turf + tsp algorithm on coordinates before calling api

  // API: Calculates Route Between Selected Destinations
  const calculateRoute = async () => {
    try {
      const selectedDestinationsCoordinates = selectedDestinations.map(
        (destination) => [destination.longitude, destination.latitude]
      );

      selectedDestinationsCoordinates.push(selectedDestinationsCoordinates[0]); // places first destination in last place => round trip

      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${openRouteServiceApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: selectedDestinationsCoordinates,
          }),
        }
      );

      const data = await response.json();
      setRouteData(data.routes[0]);
      console.log(data.routes[0]);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  const renderCard = () => {
    switch (currentView) {
      case 1:
        return (
          <DestinationsSelector
            destinations={destinations}
            selectedDestinations={selectedDestinations}
            addSelectedDestination={addSelectedDestination}
            removeSelectedDestination={removeSelectedDestination}
            onNext={nextView}
          />
        );
      case 2:
        return (
          <div>
            <ActivitySelector
              selectedDestinations={selectedDestinations}
              onSelectedActivitiesChange={handleSelectedActivitiesChange}
              selectedActivities={selectedActivities}
              onNext={nextView}
              calculateRoute={calculateRoute}
            />
            <div style={{ marginTop: "1rem" }}>
              <button onClick={prevView}>Back</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <Card3
              selectedDestinations={selectedDestinations}
              routeData={routeData}
              selectedActivities={selectedActivities}
              handleDaysDataChange={handleDaysDataChange}
              createRoadTrip={createRoadTrip}
            />
            <div style={{ marginTop: "1rem" }}>
              <button onClick={prevView}>Back</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const createRoadTrip = async (days) => {

    //TODO: beautified version
    // var routeDataCopy = routeData;
    // delete routeDataCopy.way_points;
    // delete routeDataCopy.warnings;
    // delete routeDataCopy.extras;
    // delete routeDataCopy.bbox;

    const simplifiedDays = JSON.parse(JSON.stringify(days)).map(day => ({
      activityIds: day.activities.map(activity => activity.id)
    }));

    try {
      const response = await fetch(API_URL+"/roadTrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "TODO ask for name input",
          userId: currentUser.id,
          route: JSON.stringify(routeData),
          days: JSON.stringify(simplifiedDays),
        }),
      });

      if (response.ok) {
        //TODO: my roadtrip(s) overview
        // navigate("/my-roadtrips");
        navigate("/");
      } else {
        throw new Error("Road Trip creation failed.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return <div>{renderCard()}</div>;
};
export default RoadTrip;
