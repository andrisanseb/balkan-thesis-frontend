import React, { useState } from "react";
import MapWithOpenStreetMapProvider from "../test/MapWithOpenStreetMapProvider";
import DaysOrganiser from "./DaysOrganiser";

const Card3 = ({
  selectedDestinations,
  routeData,
  selectedActivities,
  handleDaysDataChange,
  createRoadTrip,
  onBack,
}) => {
  const [daysData, setDaysData] = useState([]);

  // This handler will be called by DaysOrganiser
  const handleDaysData = (data) => {
    setDaysData(data);
    if (handleDaysDataChange) handleDaysDataChange(data);
  };

  const handleSubmit = () => {
    createRoadTrip(daysData);
  };

  return (
    <div className="content-wrapper">
      <div id="create-road-trip-overview-container">
        <MapWithOpenStreetMapProvider
          selectedDestinations={selectedDestinations}
          routeData={routeData}
        />
        <DaysOrganiser
          selectedDestinations={selectedDestinations}
          selectedActivities={selectedActivities}
          routeData={routeData}
          handleDaysDataChange={handleDaysData}
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