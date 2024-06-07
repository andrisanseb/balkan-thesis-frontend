import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "../../styles/RoadTrip.css";
import { FaCheck } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import MapWithOpenStreetMapProvider from "../test/MapWithOpenStreetMapProvider";
import CreateRoadTripOverview from "./CreateRoadTripOverview";
import ActivitySelector from "./ActivitySelector";
import DaysOrganiser from "./DaysOrganiser";

const RoadTrip = ({ destinations }) => {
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [currentView, setCurrentView] = useState(1);
  const [daysData, setDaysData] = useState(null);

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const location = useLocation();

  // Route
  const openRouteServiceApiKey =
    "5b3ce3597851110001cf6248f5e662ffc8c848ff8e860b2b731eb023";
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

  if (!destinations) {
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
    setCurrentView(currentView + 1);
  };

  // optimal order of destinations
  const turf = require("@turf/turf");
  // TODO: turf + tsp algorithm on coordinates before calling api

  // API: Calculates Route Between Selected Destinations
  const calculateRoute = async () => {
    try {
      const selectedDestinationsCoordinates = selectedDestinations.map(
        (destination) => [destination.longitude, destination.latitude]
      );

      selectedDestinationsCoordinates.push(selectedDestinationsCoordinates[0]); // places first destination in last place => round trip

      // POST
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
        return <Card1 onNext={nextView} />;
      case 2:
        return <Card2 onNext={nextView} />;
      case 3:
        return <Card3 onNext={nextView} />;
      default:
        return null;
    }
  };

  const Card1 = ({ onNext }) => (
    <div>
      <div className="destinations-section">
        <div className="content-section">
          <h2 className="title">Destinations</h2>
          <div className="cards">
            {destinations.map((destination) => {
              const isSelected = selectedDestinations.includes(destination);
              let destination_img =
                process.env.PUBLIC_URL +
                "/images/destination/" +
                destination.img_path;
              let country_flag_img =
                process.env.PUBLIC_URL +
                "/images/country/flags/" +
                destination.country.name.slice(0, 3).toLowerCase() +
                ".png";
              return (
                <div
                  key={destination.id}
                  className={`card ${isSelected ? "selected" : ""}`}
                  style={{ backgroundImage: "url(" + destination_img + ")" }}
                  onClick={() =>
                    isSelected
                      ? removeSelectedDestination(destination)
                      : addSelectedDestination(destination)
                  }
                >
                  <div className="card-content">
                    <p className="dest-name">{destination.name}</p>
                    <img src={country_flag_img} alt="country_flag" />
                    {isSelected && <FaCheck className="checkmark" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <button onClick={onNext}>Continue</button>
    </div>
  );

  const Card2 = ({ onNext }) => (
    <div>
      <ActivitySelector
        selectedDestinations={selectedDestinations}
        onSelectedActivitiesChange={handleSelectedActivitiesChange}
        onNext={onNext}
        calculateRoute={calculateRoute}
      />
    </div>
  );

  const createRoadTrip = async () => {
    console.log("post roadtrip attempt");

    //TODO: beautified version
    // var routeDataCopy = routeData;
    // delete routeDataCopy.way_points;
    // delete routeDataCopy.warnings;
    // delete routeDataCopy.extras;
    // delete routeDataCopy.bbox;

    try {
      const response = await fetch("http://localhost:4000/roadTrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "name",
          description: "description", //remove description maybe
          userId: currentUser.id,
          route: JSON.stringify(routeData),
          days: JSON.stringify(daysData),   //post beautified version
        }),
      });

      if (response.ok) {
        console.log("created!");
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

  const Card3 = ({ onNext }) => (
    <div className="create-road-trip-overview-container">
      <div className="map-container">
        <MapWithOpenStreetMapProvider
          selectedDestinations={selectedDestinations}
          routeData={routeData}
        />
      </div>
      <div className="planner-container">
        <DaysOrganiser
          selectedDestinations={selectedDestinations}
          selectedActivities={selectedActivities}
          handleDaysDataChange={handleDaysDataChange}
          routeData={routeData}
          createRoadTrip={createRoadTrip}
        />
      </div>
    </div>
  );

  return <div>{renderCard()}</div>;
};
export default RoadTrip;
