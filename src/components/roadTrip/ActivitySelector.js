import React, { useState, useEffect } from "react";
import ActivityList from "../activities/ActivityList";
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
    setSelectedActivities((prev) =>
      prev.filter((activity) =>
        allActivities.some((a) => a.id === activity.id)
      )
    );
  }, [selectedDestinations]);

  useEffect(() => {
    onSelectedActivitiesChange(selectedActivities);
  }, [selectedActivities]);

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

  // Sort by best reviewed
  const bestReviewedActivities = [...filteredActivities]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  // Remove best reviewed from the rest to avoid duplicates
  const bestReviewedIds = new Set(bestReviewedActivities.map(a => a.id));
  const restActivities = filteredActivities.filter(a => !bestReviewedIds.has(a.id));

  return (
    <div className="content-wrapper content-padding">
      <h1 className="big-green-title">Activities</h1>
      <p className="activity-description-info">
        Select the activities you want to include in your trip. Click on an
        activity to add or remove it from your selection.
      </p>
      <div className="activity-filter-row">
        <label
          htmlFor="activity-category-filter"
          style={{ marginRight: "8px" }}
        >
          Category:
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
          Destination:
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
      <div>
        <h2 style={{ color: "#1976d2", marginBottom: "8px" }}>Best Reviewed</h2>
        <ActivityList
          activities={bestReviewedActivities}
          destinations={selectedDestinations}
          showFavorite={false}
          showYoutube={false}
          showRatingRow={false}
          showCreatedBy={false}
          onActivityClick={toggleActivitySelection}
          selectedActivities={selectedActivities}
        />
      </div>
      <div>
        <h2 style={{ color: "#1976d2", margin: "24px 0 8px 0" }}>All Activities</h2>
        <ActivityList
          activities={restActivities}
          destinations={selectedDestinations}
          showFavorite={false}
          showYoutube={false}
          showRatingRow={false}
          showCreatedBy={false}
          onActivityClick={toggleActivitySelection}
          selectedActivities={selectedActivities}
        />
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
