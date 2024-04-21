import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import "../../styles/ActivitySelector.css";

const ActivitySelector = ({
  selectedDestinations,
  onSelectedActivitiesChange,
  onNext,
}) => {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);

  useEffect(() => {
    // Use a local variable to track whether shuffling has been done
    let shufflingDone = false;

    // Check if shuffling has already been done
    if (!shufflingDone) {
      // Flatten the selectedDestinations array and shuffle the activities
      const allActivities = selectedDestinations.flatMap(
        (destination) => destination.activities
      );
      const shuffledActivities = allActivities.sort(() => Math.random() - 0.5);
      setAllActivities(shuffledActivities);

      // Set shufflingDone to true to prevent repeated shuffling
      shufflingDone = true;
    }
  }, [selectedDestinations]); // Only re-run if selectedDestinations change

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
    // console.log("Selected activities:", selectedActivities);
    onSelectedActivitiesChange(selectedActivities);
    onNext();
  };

  return (
    <div className="activities">
      <h1>What To Do</h1>
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
      <button onClick={handleSubmit}>Submit Activities to DaysPlanner</button>
    </div>
  );
};

export default ActivitySelector;
