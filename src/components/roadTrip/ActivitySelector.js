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

  useEffect(() => {
    let allActivities = selectedDestinations.flatMap(
      (destination) => destination.activities
    );
    // Shuffle only if no activities were previously selected
    if (!selectedActivitiesProp || selectedActivitiesProp.length === 0) {
      allActivities = [...allActivities].sort(() => Math.random() - 0.5);
    }
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
  const filteredActivities =
    selectedCategory === "All"
      ? allActivities
      : allActivities.filter((activity) => activity.category === selectedCategory);

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
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="activities">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className={`activity-box ${
              selectedActivities.includes(activity) ? "selected" : ""
            }`}
            onClick={() => toggleActivitySelection(activity)}
          >
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
        ))}
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
