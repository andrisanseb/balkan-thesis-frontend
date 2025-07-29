import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import "../../styles/ActivitySelector.css";

const ActivitySelector = ({
  selectedDestinations,
  selectedActivities: selectedActivitiesProp = [],
  onSelectedActivitiesChange,
  onNext,
}) => {
  const [selectedActivities, setSelectedActivities] = useState(
    selectedActivitiesProp
  );
  const [allActivities, setAllActivities] = useState([]);

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

  const handleSubmit = () => {
    onNext();
  };

  return (
    <div className="page-container">
      <h1>Activities</h1>
      <div className="activities">
        {allActivities.map((activity) => (
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
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default ActivitySelector;
