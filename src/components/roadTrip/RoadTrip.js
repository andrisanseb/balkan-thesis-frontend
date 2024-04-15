import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "../../styles/RoadTrip.css";
import { FaCheck } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
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
  const [error, setError] = useState('');
  const currentUser = AuthService.getCurrentUser();
  const location = useLocation();

  // Route
  const apiKey = "5b3ce3597851110001cf6248f5e662ffc8c848ff8e860b2b731eb023";
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    // Clear states when URL changes
    return () => {
      setSelectedDestinations([]);
      setCurrentView(1);
      setRouteData(null);
      setDaysData(null);
    };
  }, [location.pathname]); // Run this effect whenever the location pathname changes

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

  // API: Calculates Route Between Selected Destinations
  const calculateRoute = async () => {
    try {
      const selectedDestinationsCoordinates = selectedDestinations.map(
        (destination) => [destination.longitude, destination.latitude]
      );
      const startFinishPoint = [
        selectedDestinations[0].longitude,
        selectedDestinations[0].latitude,
      ];

      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`,
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
      setRouteData(data); // Store route data in state
      //   console.log(data);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  const showRouteData = () => {
    if (routeData) {
      return (
        <div>
          <h2>Route Data</h2>
          <p>Distance: {routeData.routes[0].summary.distance} meters</p>
          <p>Duration: {routeData.routes[0].summary.duration} seconds</p>
        </div>
      );
    } else {
      return <p>No route data available</p>;
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
      case 4:
        return <Card4 onNext={nextView} />;
      default:
        return null;
    }
  };

  // const MapComponent = () => {
  //   return (
  //     <div className="map-container">
  //       <MapContainer
  //         center={[51.505, -0.09]}
  //         zoom={13}
  //         style={{ height: "400px", width: "100%" }}
  //         scrollWheelZoom={false}
  //       >
  //         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  //         {/* Add markers for each location */}
  //         {/* {selectedDestinations.map(location => (
  //             <Marker key={location.id} position={[location.latitude, location.longitude]}>
  //               <Popup>{location.name}</Popup>
  //             </Marker>
  //           ))} */}
  //         {/* Display the route */}
  //         {/* <Polyline positions={routeCoordinates} color="blue" /> */}
  //         <Marker position={[51.505, -0.09]}>
  //           <Popup>
  //             A pretty CSS3 popup. <br /> Easily customizable.
  //           </Popup>
  //         </Marker>
  //       </MapContainer>
  //     </div>
  //   );
  // };

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
              let destination_details_path =
                "/explore/destinations/" + destination.id;

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
      <h2>Card 2</h2>
      <p>This is the content of Card 2</p>
      {selectedDestinations && selectedDestinations.length > 0 && (
        <div className="selected-destinations-section">
          <h2 className="title">Selected Destinations</h2>
          <ul>
            {selectedDestinations.map((selectedDestination, index) => (
              <li key={index}>
                <strong>Name:</strong> {selectedDestination.name}
                <br />
                <strong>Description:</strong> {selectedDestination.description}
                <br />
                <strong>Longitude:</strong> {selectedDestination.longitude}
                <br />
                <strong>Latitude:</strong> {selectedDestination.latitude}
                <br />
                <strong>Country:</strong> {selectedDestination.country.name}
                <br />
              </li>
            ))}
          </ul>

          <div>
            <button onClick={calculateRoute}>Calculate Route</button>
            {showRouteData()}
          </div>
        </div>
      )}

      <button onClick={onNext}>Next, (Show Map)</button>
    </div>
  );

  const Card3 = ({ onNext }) => (
    <div>
      <ActivitySelector
        selectedDestinations={selectedDestinations}
        onSelectedActivitiesChange={handleSelectedActivitiesChange}
      />
      <button onClick={onNext}>Submit First, Proceed to Overview</button>
    </div>
  );

  //TODO: debug! (check parameters - make it async (e)? - remove try?)
  // break it! post 1 time only.
  const createRoadTrip = () => {
    try {
      const response = fetch("http://localhost:4000/roadTrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:"name",
          description:"description",
          user_id: currentUser.id,
          route: null,
          days: null,
        }),
      });

      if (response.ok) {
        // navigate("/my-roadtrips");
        console.log("created!");
      } else {
        throw new Error("Road Trip creation failed.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const Card4 = ({ onNext }) => (
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
          // routeData={routeData}
        />
      </div>
      <div className="button-container">
        <button onClick={createRoadTrip()}>Create RoadTrip</button>
      </div>
    </div>
  );

  return <div>{renderCard()}</div>;
};
export default RoadTrip;
