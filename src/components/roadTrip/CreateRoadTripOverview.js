import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import "../../styles/CreateRoadTripOverview.css";

const CreateRoadTripOverview = ({ selectedDestinations }) => {
  // State to track the number of activities shown for each destination
  const [activitiesToShow, setActivitiesToShow] = useState({});
  // State to track selected activities
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Function to add more activities for a specific destination
  const addMoreActivities = (destinationId) => {
    setActivitiesToShow((prevActivitiesToShow) => ({
      ...prevActivitiesToShow,
      [destinationId]: (prevActivitiesToShow[destinationId] || 0) + 3,
    }));
  };

  // Function to handle activity selection
  const toggleActivitySelection = (activity) => {
    setSelectedActivities((prevSelectedActivities) => {
      const isSelected = prevSelectedActivities.includes(activity);
      return isSelected
        ? prevSelectedActivities.filter((selectedActivity) => selectedActivity !== activity)
        : [...prevSelectedActivities, activity];
    });
  };

  // Function to render activities for a destination
  const renderActivities = (destination) => {
    // Get the number of activities to show for this destination
    const numToShow = activitiesToShow[destination.id] || 3;
    // Slice the activities array based on the number to show
    const activities = destination.activities.slice(0, numToShow);
    // const activitiesShuffled = activities.sort(() => Math.random() - 0.5);

    return (
      <div key={destination.id}>
        <h3>{destination.name}</h3>
        <div className="activity-list">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`activity-box ${selectedActivities.includes(activity) ? 'selected' : ''}`}
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
              {selectedActivities.includes(activity) && <FaCheck className="checkmark" />}
            </div>
          ))}
        </div>
        {destination.activities.length > numToShow && (
          <button onClick={() => addMoreActivities(destination.id)}>
            Show More Activities
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="activities">
      {selectedDestinations.map((destination) => renderActivities(destination))}
    </div>
  );
};

export default CreateRoadTripOverview;
