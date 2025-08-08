import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "../../styles/RoadTrip.css";
import { useLocation } from "react-router-dom";
import ActivitySelector from "./ActivitySelector";
import DestinationsSelector from "./DestinationsSelector";
import Card3 from "./Card3";

const RoadTrip = ({ destinations }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [currentView, setCurrentView] = useState(1);
  const [daysData, setDaysData] = useState(null);
  const [planTitle, setPlanTitle] = useState("Road Trip Plan");

  // Add round trip state
  const [isRoundTrip, setIsRoundTrip] = useState(true);

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const currentUser = AuthService.getCurrentUser();
  const location = useLocation();

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
    // Reset routeData if destinations change
    setRouteData(null);
  }, [selectedDestinations]);

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
            isRoundTrip={isRoundTrip}
            setIsRoundTrip={setIsRoundTrip}
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
              onBack={prevView}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <Card3
              selectedDestinations={selectedDestinations}
              routeData={routeData}
              setRouteData={setRouteData}
              selectedActivities={selectedActivities}
              handleDaysDataChange={handleDaysDataChange}
              createRoadTrip={createRoadTrip}
              planTitle={planTitle}
              setPlanTitle={setPlanTitle}
              onBack={prevView}
              isRoundTrip={isRoundTrip}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const createRoadTrip = async (days, dayTitles) => {
    // Get day titles from DaysOrganiser (pass as argument or via state)
    // Assume you pass dayTitles as a second argument: createRoadTrip(days, dayTitles)
    const simplifiedDays = JSON.parse(JSON.stringify(days)).map((day, i) => ({
      name: day.title ? day.title : `Day ${i + 1}`,
      activityIds: day.activities.map(activity => activity.id)
    }));

    const simplifiedRoute = simplifyRouteData(routeData);

    try {
      const response = await fetch(API_URL+"/roadTrips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: planTitle,
          userId: currentUser.id,
          route: JSON.stringify(simplifiedRoute),
          days: JSON.stringify(simplifiedDays),
        }),
      });

      if (response.ok) {
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

function simplifyRouteData(routeData) {
  if (
    !routeData ||
    !routeData.routes ||
    !routeData.routes[0] ||
    !routeData.routes[0].legs
  ) return null;

  const legs = routeData.routes[0].legs;
  return legs.map((leg) => ({
    start_location: leg.start_location,
    end_location: leg.end_location,
    start_address: leg.start_address,
    end_address: leg.end_address,
    distance: leg.distance.value, // meters
    duration: leg.duration.value, // seconds
  }));
}

export default RoadTrip;
