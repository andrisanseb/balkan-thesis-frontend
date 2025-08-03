import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../../styles/DaysOrganiser.css";
import { FaSpinner, FaClock } from "react-icons/fa";

const DaysOrganiser = ({
  selectedDestinations,
  selectedActivities,
  handleDaysDataChange,
  routeData,
  planTitle,
  setPlanTitle,
}) => {
  const [daysData, setDaysData] = useState([]);
  const [totalDays, setTotalDays] = useState(selectedDestinations.length);
  const [dropNotAllowedMsg, setDropNotAllowedMsg] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (selectedActivities && selectedActivities.length > 0) {
      distributeActivitiesByDestination();
    }
    // eslint-disable-next-line
  }, [selectedActivities, selectedDestinations]);

  useEffect(() => {
    handleDaysDataChange(daysData);
    // eslint-disable-next-line
  }, [daysData]);

  const distributeActivitiesByDestination = () => {
    // Prepare empty days array
    const days = Array.from({ length: totalDays }, () => ({ activities: [] }));

    selectedActivities.forEach((activity) => {
      // Try to assign activity to the correct day
      for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
        const fromDest = selectedDestinations[dayIndex];
        // For round trip, next destination wraps to 0
        const toDest =
          selectedDestinations[(dayIndex + 1) % selectedDestinations.length];

        // Check if activity belongs to fromDest or toDest
        // Adjust property as needed: activity.destinationId or activity.destination.id
        const activityDestId =
          activity.destinationId ||
          (activity.destination && activity.destination.id);

        if (
          (fromDest && activityDestId === fromDest.id) ||
          (toDest && activityDestId === toDest.id)
        ) {
          days[dayIndex].activities.push(activity);
          break; // Assign to the first matching day only
        }
      }
    });

    setDaysData(days);
  };

  const generateEmptyDay = (restArrival = null) => {
    return { activities: [], restArrival }; // restArrival is null for normal days, or a string for rest days
  };

  const addDayAtIndex = (insertIndex) => {
    // Find the most recent travel day before insertIndex
    let lastTravelSegmentIndex = -1;
    for (let j = insertIndex - 1; j >= 0; j--) {
      if (!daysData[j].restArrival) {
        lastTravelSegmentIndex++;
        break;
      }
      lastTravelSegmentIndex++;
    }
    // If no travel day found before, use the first travel segment
    const travelSegmentIdx = insertIndex - lastTravelSegmentIndex;
    const restArrival =
      selectedDestinations[travelSegmentIdx] &&
      selectedDestinations[travelSegmentIdx].name
        ? selectedDestinations[travelSegmentIdx].name
        : "";

    const newDay = generateEmptyDay(restArrival);
    const newDaysData = [
      ...daysData.slice(0, insertIndex),
      newDay,
      ...daysData.slice(insertIndex),
    ];
    setDaysData(newDaysData);
    setTotalDays(newDaysData.length);
  };

  const removeDay = (indexToRemove) => {
    if (totalDays > 1 && indexToRemove >= 0 && indexToRemove < totalDays) {
      setTotalDays(totalDays - 1);

      if (daysData[indexToRemove].activities.length > 0) {
        const activitiesToMove = daysData[indexToRemove].activities;
        const updatedDaysData = [...daysData];
        updatedDaysData.splice(indexToRemove, 1);

        const randomDayIndex = Math.floor(Math.random() * totalDays);
        updatedDaysData[randomDayIndex].activities.push(...activitiesToMove);

        setDaysData(updatedDaysData);
      } else {
        setDaysData((prevDaysData) =>
          prevDaysData.filter((_, index) => index !== indexToRemove)
        );
      }
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Prevent drag if source and destination are the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceDayIndex = parseInt(source.droppableId, 10);
    const destDayIndex = parseInt(destination.droppableId, 10);

    // Get the activity to move
    const movedActivity = daysData[sourceDayIndex].activities[source.index];

    // Determine allowed destination IDs for the target day
    let allowedDestinationIds = [];
    if (daysData[destDayIndex].restArrival) {
      const restDest = selectedDestinations.find(
        (d) => d.name === daysData[destDayIndex].restArrival
      );
      if (restDest) allowedDestinationIds = [restDest.id];
    } else {
      const fromDest = selectedDestinations[destDayIndex];
      const toDest =
        selectedDestinations[(destDayIndex + 1) % selectedDestinations.length];
      allowedDestinationIds = [fromDest?.id, toDest?.id];
    }

    // Get the activity's destination id
    const activityDestId =
      movedActivity.destinationId ||
      (movedActivity.destination && movedActivity.destination.id);

    // Only allow drop if the activity belongs to the allowed destinations
    if (!allowedDestinationIds.includes(activityDestId)) {
      setDropNotAllowedMsg(true);
      setTimeout(() => setDropNotAllowedMsg(false), 2000);
      return;
    }

    // Move within the same day: reorder activities
    if (sourceDayIndex === destDayIndex) {
      const newActivities = Array.from(daysData[sourceDayIndex].activities);
      const [removed] = newActivities.splice(source.index, 1);
      newActivities.splice(destination.index, 0, removed);

      const newDaysData = daysData.map((day, idx) =>
        idx === sourceDayIndex ? { ...day, activities: newActivities } : day
      );
      setDaysData(newDaysData);
      return;
    }

    // Move between different days
    const newDaysData = daysData.map((day, idx) => {
      // Remove from source
      if (idx === sourceDayIndex) {
        return {
          ...day,
          activities: day.activities.filter((_, i) => i !== source.index),
        };
      }
      // Insert into destination
      if (idx === destDayIndex) {
        const newActivities = [...day.activities];
        newActivities.splice(destination.index, 0, movedActivity);
        return {
          ...day,
          activities: newActivities,
        };
      }
      return day;
    });

    setDaysData(newDaysData);
  };

  // Helper to get distance and duration from Google Maps API routeData
  const getGoogleSegmentInfo = (routeData, index) => {
    const legs =
      routeData &&
      routeData.routes &&
      routeData.routes[0] &&
      routeData.routes[0].legs;
    if (!legs || !legs[index]) return { distance: 0, duration: 0 };
    const leg = legs[index];
    return {
      distance: leg.distance ? leg.distance.value : 0, // meters
      duration: leg.duration ? leg.duration.value : 0, // seconds
      start_address: leg.start_address,
      end_address: leg.end_address,
    };
  };

  const renderDayBoxes = () => {
    const boxes = [];
    let travelSegmentIndex = 0; // Only increment for travel days

    for (let i = 0; i < daysData.length; i++) {
      const day = daysData[i];

      // Only get segment for travel days
      let segment = null;
      const legs =
        routeData &&
        routeData.routes &&
        routeData.routes[0] &&
        routeData.routes[0].legs;
      if (!day.restArrival && legs && legs[travelSegmentIndex]) {
        segment = getGoogleSegmentInfo(routeData, travelSegmentIndex);
      }

      // SKIP travel days with no route segment
      if (!day.restArrival && !segment) {
        continue;
      }

      // Add "+" button before each day except the first
      if (i > 0) {
        // Find the most recent travel day before insertIndex (i)
        let travelSegmentIndexForBtn = 0;
        for (let j = 0; j < i; j++) {
          if (!daysData[j].restArrival) {
            travelSegmentIndexForBtn++;
          }
        }
        const arrivalDestination =
          selectedDestinations[travelSegmentIndexForBtn] &&
          selectedDestinations[travelSegmentIndexForBtn].name
            ? selectedDestinations[travelSegmentIndexForBtn].name
            : "";

        // Hide "+" button if the current day is a rest day
        const currDay = daysData[i];
        if (!currDay.restArrival) {
          boxes.push(
            <div key={`add-day-btn-${i}`} className="add-day-btn-container">
              <button
                className="add-day-btn"
                onClick={() => addDayAtIndex(i)}
                title="Add day here"
              >
                +
              </button>
              <div className="arrival-destination-label">
                {arrivalDestination && (
                  <span>
                    Explore <strong>{arrivalDestination}</strong>
                  </span>
                )}
              </div>
            </div>
          );
        }
      }

      const totalCost = day.activities.reduce(
        (acc, activity) => acc + activity.cost,
        0
      );
      const totalDuration = day.activities.reduce(
        (acc, activity) => acc + activity.duration,
        0
      );

      const formatDuration = (duration) => {
        if (duration >= 60) {
          const hours = Math.floor(duration / 60);
          const minutes = duration % 60;
          if (minutes === 0) {
            return `${hours} hour${hours > 1 ? "s" : ""}`;
          } else {
            return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
              minutes > 1 ? "s" : ""
            }`;
          }
        } else {
          return `${duration} minute${duration !== 1 ? "s" : ""}`;
        }
      };

      boxes.push(
        <div key={i} className="day-box">
          {/* Show remove button for rest/non-travel days OR days with no route */}
          {(day.restArrival || !segment) ? (
            <button className="remove-button" onClick={() => removeDay(i)}>
              -
            </button>
          ) : null}
          <div className="day-header">
            <h3>Day {i + 1}</h3>
          </div>
          {/* Route info for this day */}
          <div className="day-route-info">
            {day.restArrival ? (
              <div>
                <div>
                  <span className="destination-names">
                    Explore: <strong>
                      {day.restArrival}
                      {/* Find the destination object by name */}
                      {(() => {
                        const destObj = selectedDestinations.find(
                          (d) => d.name === day.restArrival
                        );
                        const flag = getCountryFlagImg(destObj);
                        return flag ? (
                          <img
                            src={flag}
                            alt="country_flag"
                            className="destination-flag"
                          />
                        ) : null;
                      })()}
                    </strong>
                  </span>
                </div>
                <div>
                  <em>This is a rest/non-travel day.</em>
                </div>
              </div>
            ) : segment ? (
              <>
                <div>
                  <span className="destination-names">
                    {selectedDestinations[travelSegmentIndex]?.name}
                    {/* Flag for from destination */}
                    {(() => {
                      const fromDest = selectedDestinations[travelSegmentIndex];
                      const flag = getCountryFlagImg(fromDest);
                      return flag ? (
                        <img
                          src={flag}
                          alt="country_flag"
                          className="destination-flag"
                        />
                      ) : null;
                    })()}
                  </span>{" "}
                  ➔{" "}
                  <span className="destination-names">
                    {selectedDestinations[travelSegmentIndex + 1]
                      ? selectedDestinations[travelSegmentIndex + 1].name
                      : selectedDestinations[0]?.name}
                    {/* Flag for to destination */}
                    {(() => {
                      const toDest =
                        selectedDestinations[travelSegmentIndex + 1] ||
                        selectedDestinations[0];
                      const flag = getCountryFlagImg(toDest);
                      return flag ? (
                        <img
                          src={flag}
                          alt="country_flag"
                          className="destination-flag"
                        />
                      ) : null;
                    })()}
                  </span>
                </div>
                <div>
                  Distance: {convertMetersToKilometers(segment.distance)} km
                </div>
                <div>
                  Estimated Duration: {convertSecondsToHoursMinutes(segment.duration)}
                </div>
              </>
            ) : (
              <div>No route for this day</div>
            )}
          </div>
          <Droppable droppableId={`${i}`}>
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps}>
                {day.activities &&
                  day.activities.map((activity, activityIndex) => (
                    <Draggable
                      key={activity.id}
                      draggableId={`${activity.id}`}
                      index={activityIndex}
                    >
                      {(provided) => (
                        <li
                          key={activity.id}
                          className="activity"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span className="activity-name">{activity.name}</span>
                          <div className="activity-details">
                            <p className="duration">
                              <FaClock /> {formatDuration(activity.duration)}
                            </p>
                            <p className="cost">
                              {activity.cost === 0
                                ? "free"
                                : `${activity.cost} €`}
                            </p>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <div className="activity-summary">
            <p>Total:</p>
            <div className="summary-details">
              <p className="duration">
                <FaClock /> {formatDuration(totalDuration)}
              </p>
              <p className="cost">
                {totalCost === 0 ? "free" : `${totalCost} €`}
              </p>
            </div>
          </div>
        </div>
      );

      // Only increment travelSegmentIndex for travel days
      if (!day.restArrival) {
        travelSegmentIndex++;
      }
    }

    return boxes;
  };

  const convertMetersToKilometers = (meters) => {
    return (meters / 1000).toFixed(2);
  };

  const convertSecondsToHoursMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getCountryFlagImg = (destination) => {
    if (!destination || !destination.country || !destination.country.name) return null;
    return (
      process.env.PUBLIC_URL +
      "/images/country/flags/" +
      destination.country.name.slice(0, 3).toLowerCase() +
      ".png"
    );
  };

  return (
    <div>
      {dropNotAllowedMsg && (
        <div className="drop-not-allowed-msg">
          This activity cannot be dropped here. It belongs to a different destination.
        </div>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="days-organiser-container">
          <div className="plan-title-container">
            {isEditingTitle ? (
              <input
                type="text"
                className="plan-title-input"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
              />
            ) : (
              <h1
                className="plan-title"
                onClick={() => setIsEditingTitle(true)}
                title="Click to edit plan name"
              >
                {planTitle}
              </h1>
            )}
          </div>
          <div className="days-wrapper">{renderDayBoxes()}</div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default DaysOrganiser;
