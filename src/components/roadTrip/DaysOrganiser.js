import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaClock, FaPen, FaTrash } from "react-icons/fa";
import "../../styles/DaysOrganiser.css";

const DaysOrganiser = ({
  selectedDestinations,
  selectedActivities,
  handleDaysDataChange,
  routeData,
  planTitle,
  setPlanTitle,
  isRoundTrip,
}) => {
  const getInitialTotalDays = () => {
    if (isRoundTrip) {
      return selectedDestinations.length;
    } else {
      return selectedDestinations.length - 1;
    }
  };
  const [daysData, setDaysData] = useState([]);
  const [totalDays, setTotalDays] = useState(getInitialTotalDays());
  const [dropNotAllowedMsg, setDropNotAllowedMsg] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingDayTitleIdx, setEditingDayTitleIdx] = useState(null);

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
    // Prepare empty days array with destination1, destination2, and routeSegment
    const legs =
      routeData &&
      routeData.routes &&
      routeData.routes[0] &&
      routeData.routes[0].legs
        ? routeData.routes[0].legs
        : [];

    const days = Array.from({ length: totalDays }, (_, i) => {
      const isTravelDay = i < selectedDestinations.length - 1;
      let routeSegment = null;
      if (isTravelDay && legs[i]) {
        routeSegment = {
          start_address: legs[i].start_address,
          end_address: legs[i].end_address,
          distance: legs[i].distance.value,
          duration: legs[i].duration.value,
        };
      }
      if (isTravelDay) {
        return {
          activities: [],
          title: `Day ${i + 1}`,
          destination1: selectedDestinations[i]?.id || null,
          destination2: selectedDestinations[i + 1]?.id || null,
          restArrival: null,
          routeSegment,
        };
      } else {
        // Last day or rest/explore day
        return {
          activities: [],
          title: `Day ${i + 1}`,
          destination1: selectedDestinations[i]?.id || null,
          destination2: null,
          restArrival: null,
          routeSegment: null,
        };
      }
    });

    selectedActivities.forEach((activity) => {
      for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
        const fromDest = selectedDestinations[dayIndex];
        const toDest = selectedDestinations[dayIndex + 1];
        const activityDestId =
          activity.destinationId ||
          (activity.destination && activity.destination.id);

        if (
          (fromDest && activityDestId === fromDest.id) ||
          (toDest && activityDestId === toDest.id)
        ) {
          days[dayIndex].activities.push(activity);
          break;
        }
      }
    });

    setDaysData(days);
  };

  // For rest/explore days, only destination1 is set
  const generateEmptyDay = (restArrival = null, title = "", destination1 = null) => {
    return { activities: [], restArrival, title, destination1, destination2: null };
  };

  const addDayAtIndex = (insertIndex, restArrival) => {
    let title = restArrival ? `Explore ${restArrival}` : `Day ${insertIndex + 1}`;
    let destination1 = null;
    let routeSegment = null;
    if (restArrival) {
      const destObj = selectedDestinations.find(d => d.name === restArrival);
      destination1 = destObj ? destObj.id : null;
    } else if (selectedDestinations[insertIndex]) {
      destination1 = selectedDestinations[insertIndex].id;
      // Try to get route segment for this travel day
      const legs =
        routeData &&
        routeData.routes &&
        routeData.routes[0] &&
        routeData.routes[0].legs
          ? routeData.routes[0].legs
          : [];
      if (legs[insertIndex]) {
        routeSegment = {
          start_address: legs[insertIndex].start_address,
          end_address: legs[insertIndex].end_address,
          distance: legs[insertIndex].distance.value,
          duration: legs[insertIndex].duration.value,
        };
      }
    }
    const newDay = {
      ...generateEmptyDay(restArrival, title, destination1),
      routeSegment,
    };
    const newDaysData = [
      ...daysData.slice(0, insertIndex),
      newDay,
      ...daysData.slice(insertIndex),
    ];
    setDaysData(newDaysData);
    setTotalDays(newDaysData.length);
    setDaysData(renumberDefaultDayTitles(newDaysData));
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceDayIndex = parseInt(source.droppableId, 10);
    const destDayIndex = parseInt(destination.droppableId, 10);

    const movedActivity = daysData[sourceDayIndex].activities[source.index];

    let allowedDestinationIds = [];
    const destDay = daysData[destDayIndex];
    if (destDay.restArrival) {
      if (destDay.destination1) allowedDestinationIds = [destDay.destination1];
    } else {
      allowedDestinationIds = [destDay.destination1, destDay.destination2].filter(Boolean);
    }

    const activityDestId =
      movedActivity.destinationId ||
      (movedActivity.destination && movedActivity.destination.id);

    if (!allowedDestinationIds.includes(activityDestId)) {
      setDropNotAllowedMsg(true);
      setTimeout(() => setDropNotAllowedMsg(false), 2000);
      return;
    }

    // Move routeSegment with the card if it's a travel day
    let newDaysData = daysData.map((day, idx) => {
      if (idx === sourceDayIndex) {
        return {
          ...day,
          activities: day.activities.filter((_, i) => i !== source.index),
        };
      }
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
    setDaysData(renumberDefaultDayTitles(newDaysData));
  };

  const handleDayTitleChange = (index, value) => {
    const newDays = [...daysData];
    newDays[index].title = value;
    setDaysData(newDays);
  };

  const handleRemoveDay = (index) => {
    if (daysData.length <= 1) return;
    const dayToRemove = daysData[index];
    const activitiesToMove = dayToRemove.activities;
    let newDays = [...daysData];
    newDays.splice(index, 1);

    // Redistribute activities
    activitiesToMove.forEach(activity => {
      const activityDestId = activity.destinationId || (activity.destination && activity.destination.id);
      // Find the first day with matching destination1 or destination2
      const targetDayIdx = newDays.findIndex(day =>
        (day.destination1 === activityDestId) || (day.destination2 === activityDestId)
      );
      if (targetDayIdx !== -1) {
        newDays[targetDayIdx].activities.push(activity);
      }
      // If no matching day, activity is dropped (optionally, could push to first day)
    });

    setDaysData(newDays);
    setTotalDays(newDays.length);
    setDaysData(renumberDefaultDayTitles(newDays));
  };

  const renderDayBoxes = () => {
    const boxes = [];

    for (let i = 0; i < daysData.length; i++) {
      const day = daysData[i];

      // Find the destinations for this day using destination1 and destination2
      const dayDestination1 = day.destination1
        ? selectedDestinations.find(d => d.id === day.destination1)
        : null;
      const dayDestination2 = day.destination2
        ? selectedDestinations.find(d => d.id === day.destination2)
        : null;

      const segment = day.routeSegment;

      if (!day.restArrival && !segment) {
        continue;
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
          {/* Remove day button: only for rest/non-travel days */}
          {day.restArrival && (
            <button
              className="remove-button"
              title="Remove this day"
              onClick={() => handleRemoveDay(i)}
              disabled={daysData.length <= 1}
            >
              <FaTrash />
            </button>
          )}
          {/* Editable day title */}
          <div className="day-header">
            {editingDayTitleIdx === i ? (
              <input
                type="text"
                className="day-title-input"
                value={day.title}
                onChange={(e) => handleDayTitleChange(i, e.target.value)}
                onBlur={() => setEditingDayTitleIdx(null)}
                autoFocus
              />
            ) : (
              <h3
                onClick={() => setEditingDayTitleIdx(i)}
                title="Click to edit day title"
                style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
              >
                {day.title}
                <FaPen className="fa-pen" />
              </h3>
            )}
          </div>
          {/* Route info for this day */}
          <div className="day-route-info">
            {day.restArrival ? (
              <div>
                <div>
                  <span className="destination-names">
                    Explore: <strong>
                      {day.restArrival}
                      {(() => {
                        const destObj = dayDestination1;
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
                    {dayDestination1?.name}
                    {(() => {
                      const flag = getCountryFlagImg(dayDestination1);
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
                    {dayDestination2?.name}
                    {(() => {
                      const flag = getCountryFlagImg(dayDestination2);
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
          {/* Explore more day buttons - only for travel days with segment info */}
          {!day.restArrival && segment && (
            <div className="explore-more-container">
              <span>Explore one more day in:</span>
              {(() => {
                const startDest = dayDestination1;
                const endDest = dayDestination2;
                return (
                  <>
                    {startDest && (
                      <button
                        className="explore-more-btn"
                        onClick={() => addDayAtIndex(i, startDest.name)}
                        title={`Add day before for ${startDest.name}`}
                      >
                        {startDest.name}
                      </button>
                    )}
                    {endDest && (
                      <button
                        className="explore-more-btn"
                        onClick={() => addDayAtIndex(i + 1, endDest.name)}
                        title={`Add day after for ${endDest.name}`}
                      >
                        {endDest.name}
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      );
    }

    return boxes;
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

  // Add this helper function:
  function convertMetersToKilometers(meters) {
    return (meters / 1000).toFixed(2);
  }
  function renumberDefaultDayTitles(days) {
    return days.map((day, idx) => {
      // If the title matches "Day N", update it to the new position
      if (/^Day \d+$/.test(day.title)) {
        return { ...day, title: `Day ${idx + 1}` };
      }
      return day;
    });
  }

  return (
    <div>
      {dropNotAllowedMsg && (
        <div className="drop-not-allowed-msg">
          This activity cannot be dropped here. It belongs to a different destination.
        </div>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="days-organiser-container content-padding">
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
                style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
              >
                {planTitle}
                <FaPen className="fa-pen" />
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
