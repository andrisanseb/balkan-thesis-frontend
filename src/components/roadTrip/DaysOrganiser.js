import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../../styles/DaysOrganiser.css";
import { FaSpinner, FaClock, FaPen, FaTrash } from "react-icons/fa";

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
    // Prepare empty days array
    const days = Array.from({ length: totalDays }, (_, i) => ({
      activities: [],
      title: `Day ${i + 1}`,
    }));

    selectedActivities.forEach((activity) => {
      for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
        const fromDest = selectedDestinations[dayIndex];
        const toDest =
          selectedDestinations[(dayIndex + 1) % selectedDestinations.length];
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

  const generateEmptyDay = (restArrival = null, title = "") => {
    return { activities: [], restArrival, title };
  };

  const addDayAtIndex = (insertIndex, restArrival) => {
    let title = restArrival ? `Explore ${restArrival}` : `Day ${insertIndex + 1}`;
    const newDay = generateEmptyDay(restArrival, title);
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

    const activityDestId =
      movedActivity.destinationId ||
      (movedActivity.destination && movedActivity.destination.id);

    if (!allowedDestinationIds.includes(activityDestId)) {
      setDropNotAllowedMsg(true);
      setTimeout(() => setDropNotAllowedMsg(false), 2000);
      return;
    }

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

    const newDaysData = daysData.map((day, idx) => {
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
    const newDays = [...daysData];
    newDays.splice(index, 1);
    setDaysData(newDays);
    setDaysData(renumberDefaultDayTitles(newDays));
  };

  const renderDayBoxes = () => {
    const boxes = [];
    let travelSegmentIndex = 0;

    for (let i = 0; i < daysData.length; i++) {
      const day = daysData[i];

      let segment = null;
      const legs =
        routeData &&
        routeData.routes &&
        routeData.routes[0] &&
        routeData.routes[0].legs;
      if (!day.restArrival && legs && legs[travelSegmentIndex]) {
        segment = getGoogleSegmentInfo(routeData, travelSegmentIndex);
      }

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
                className="day-title"
                onClick={() => setEditingDayTitleIdx(i)}
                title="Click to edit day title"
                style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
              >
                {day.title}
                <FaPen style={{ marginLeft: "8px", fontSize: "0.9em", color: "#1976d2" }} />
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
          {/* Explore more day buttons - only for travel days with segment info */}
          {!day.restArrival && segment && (
            <div className="explore-more-container">
              <span>Explore one more day in:</span>
              {(() => {
                const startDest = selectedDestinations.find(
                  d => segment.start_address && segment.start_address.includes(d.name)
                );
                let endDest;
                if (
                  i === daysData.length - 1 &&
                  selectedDestinations.length > 1 &&
                  selectedDestinations[0] &&
                  segment.end_address &&
                  segment.end_address.includes(selectedDestinations[0].name)
                ) {
                  endDest = selectedDestinations[0];
                } else {
                  endDest = selectedDestinations.find(
                    d => segment.end_address && segment.end_address.includes(d.name)
                  );
                }
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

      if (!day.restArrival) {
        travelSegmentIndex++;
      }
    }

    return boxes;
  };

  const getGoogleSegmentInfo = (routeData, index) => {
    const legs =
      routeData &&
      routeData.routes &&
      routeData.routes[0] &&
      routeData.routes[0].legs;
    if (!legs || !legs[index]) return { distance: 0, duration: 0 };
    const leg = legs[index];
    return {
      distance: leg.distance ? leg.distance.value : 0,
      duration: leg.duration ? leg.duration.value : 0,
      start_address: leg.start_address,
      end_address: leg.end_address,
    };
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

  // Add this helper function:
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
