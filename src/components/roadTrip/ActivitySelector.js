import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import "../../styles/ActivitySelector.css";

const categories = [
  "All",
  "Culture",
  "Gastronomy",
  "Nature",
  "Leisure",
  "Religion",
];

const ActivitySelector = ({
  selectedDestinations,
  selectedActivities: selectedActivitiesProp = [],
  onSelectedActivitiesChange,
  onNext,
  onBack,
}) => {
  const [selectedActivities, setSelectedActivities] = useState(
    selectedActivitiesProp
  );
  const [allActivities, setAllActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState(
    "All"
  );

  useEffect(() => {
    let allActivities = selectedDestinations.flatMap(
      (destination) => destination.activities
    );
    // Always shuffle activities randomly
    allActivities = [...allActivities].sort(() => Math.random() - 0.5);
    setAllActivities(allActivities);
    // Only reset selectedActivities if destinations change and selection is now invalid
    setSelectedActivities((prev) =>
      prev.filter((activity) =>
        allActivities.some((a) => a.id === activity.id)
      )
    );
  }, [selectedDestinations]);

  // Keep parent in sync if selection changes
  useEffect(() => {
    onSelectedActivitiesChange(selectedActivities);
    // eslint-disable-next-line
  }, [selectedActivities]);

  // Function to handle activity selection
  const toggleActivitySelection = (activity) => {
    setSelectedActivities((prevSelectedActivities) => {
      const isSelected = prevSelectedActivities.includes(activity);
      return isSelected
        ? prevSelectedActivities.filter(
            (selectedActivity) => selectedActivity !== activity
          )
        : [...prevSelectedActivities, activity];
    });
  };

  // Filter activities by selected category
  const filteredActivities = allActivities
    .filter((activity) =>
      selectedCategory === "All"
        ? true
        : activity.category === selectedCategory
    )
    .filter((activity) =>
      selectedDestinationFilter === "All"
        ? true
        : String(activity.destinationId || (activity.destination && activity.destination.id)) === String(selectedDestinationFilter)
    );

  const getDestinationInfo = (activity, selectedDestinations) => {
    if (!activity.destinationId && !activity.destination) return null;
    const destId =
      activity.destinationId ||
      (activity.destination && activity.destination.id);
    const destination = selectedDestinations.find((d) => d.id === destId);
    if (!destination) return null;
    const countryFlagImg =
      process.env.PUBLIC_URL +
      "/images/country/flags/" +
      (destination.country && destination.country.name
        ? destination.country.name.slice(0, 3).toLowerCase()
        : "default") +
      ".png";
    return {
      name: destination.name,
      flag: countryFlagImg,
    };
  };

  return (
    <div className="content-wrapper">
      <h1 className="activity-title">Activities</h1>
      <p className="activity-description-info">
        Select the activities you want to include in your trip. Click on an
        activity to add or remove it from your selection.
      </p>
      <div className="activity-filter-row">
        <label
          htmlFor="activity-category-filter"
          style={{ marginRight: "8px" }}
        >
          Filter by category:
        </label>
        <select
          id="activity-category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ marginRight: "18px" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label htmlFor="activity-destination-filter" style={{ marginRight: "8px" }}>
          Filter by destination:
        </label>
        <select
          id="activity-destination-filter"
          value={selectedDestinationFilter}
          onChange={(e) => setSelectedDestinationFilter(e.target.value)}
        >
          <option value="All">All</option>
          {selectedDestinations.map((dest) => (
            <option key={dest.id} value={dest.id}>
              {dest.name}
            </option>
          ))}
        </select>
      </div>
      <div className="activities">
        {filteredActivities.map((activity) => {
          const destInfo = getDestinationInfo(activity, selectedDestinations);
          return (
            <div
              key={activity.id}
              className={`activity-box ${
                selectedActivities.includes(activity) ? "selected" : ""
              }`}
              onClick={() => toggleActivitySelection(activity)}
            >
              <div className="activity-dest-info">
                {destInfo && (
                  <>
                    <img
                      src={destInfo.flag}
                      alt="country_flag"
                      className="activity-country-flag"
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        marginRight: 6,
                        verticalAlign: "middle",
                      }}
                    />
                    <span className="activity-dest-name">{destInfo.name}</span>
                  </>
                )}
              </div>
              <p className="activity-name">{activity.name}</p>
              <p className="activity-description">{activity.description}</p>
              <p className="activity-cost">
                Cost: {activity.cost === 0 ? "Free" : `${activity.cost} €`}
              </p>
              {activity.duration >= 60 ? (
                <p className="activity-duration">
                  Duration:{" "}
                  {activity.duration >= 120
                    ? `${Math.floor(activity.duration / 60)} hours`
                    : "1 hour"}
                  {activity.duration % 60 !== 0 &&
                    ` ${activity.duration % 60} minutes`}
                </p>
              ) : (
                <p className="activity-duration">
                  Duration: {activity.duration} minute
                  {activity.duration !== 1 ? "s" : ""}
                </p>
              )}
              {selectedActivities.includes(activity) && (
                <FaCheck className="checkmark" />
              )}
            </div>
          );
        })}
      </div>
      <div className="button-row">
        <button onClick={onBack} className="back-btn">
          Back
        </button>
        <button
          onClick={onNext}
          className="next-btn"
          disabled={selectedActivities.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivitySelector;
