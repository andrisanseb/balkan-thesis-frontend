import React from "react";
import MapWithOpenStreetMapProvider from "../test/MapWithOpenStreetMapProvider";
import DaysOrganiser from "./DaysOrganiser";

const Card3 = ({
  selectedDestinations,
  routeData,
  selectedActivities,
  handleDaysDataChange,
  createRoadTrip,
}) => (
  <div id="create-road-trip-overview-container" className="page-container">
    <MapWithOpenStreetMapProvider
      selectedDestinations={selectedDestinations}
      routeData={routeData}
    />
    <DaysOrganiser
      selectedDestinations={selectedDestinations}
      selectedActivities={selectedActivities}
      routeData={routeData}
      handleDaysDataChange={handleDaysDataChange}
      createRoadTrip={createRoadTrip}
    />
  </div>
);

export default Card3;