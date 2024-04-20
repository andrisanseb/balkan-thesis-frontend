import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../../styles/DaysOrganiser.css";
import { FaClock } from "react-icons/fa";

const DaysOrganiser = ({ selectedActivities, handleDaysDataChange, routeData }) => {
  const [daysData, setDaysData] = useState([]);
  const [totalDays, setTotalDays] = useState(selectedActivities.length);

  useEffect(() => {
    distributeActivitiesRandomly();
    // console.log(selectedActivities);
  }, []);

  useEffect(() => {
    updateTotal();
  }, [daysData]);

  const distributeActivitiesRandomly = () => {
    const days = Array.from({ length: totalDays }, () => ({ activities: [] }));

    selectedActivities.forEach((activity) => {
      const randomDayIndex = Math.floor(Math.random() * totalDays);
      days[randomDayIndex].activities.push(activity);
    });

    setDaysData(days);
  };

  const generateEmptyDay = () => {
    return { activities: [] };
  };

  const addDay = () => {
    setTotalDays(totalDays + 1);
    setDaysData([...daysData, generateEmptyDay()]);
  };

  const removeDay = (indexToRemove) => {
    if (totalDays > 1) {
      setTotalDays(totalDays - 1);
      setDaysData((prevDaysData) =>
        prevDaysData.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    const updatedDaysData = [...daysData];
    const movedActivity =
      updatedDaysData[source.droppableId].activities[source.index];
    updatedDaysData[source.droppableId].activities.splice(source.index, 1);
    updatedDaysData[destination.droppableId].activities.splice(
      destination.index,
      0,
      movedActivity
    );

    setDaysData(updatedDaysData);
  };

  const renderDayBoxes = () => {
    return daysData.map((day, index) => {
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

      return (
        <div key={index} className="day-box">
          <button className="remove-button" onClick={() => removeDay(index)}>
            -
          </button>
          <div className="day-header">
            <h3>Day {index + 1}</h3>
          </div>
          <Droppable droppableId={`${index}`}>
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
    });
  };

  const handleSubmit = () => {
    handleDaysDataChange(JSON.stringify(daysData));
    console.log(daysData);
  };

  const updateTotal = () => {
    // Update the total cost and total duration when activities are moved
    // No need to store them in state
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="days-organiser-container">
        <h1>Days Planner</h1>
        <div className="days-wrapper">{renderDayBoxes()}</div>
        <div className="buttons">
          <button onClick={addDay}>Add Day</button>
          <button onClick={handleSubmit}>Save the daysData</button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default DaysOrganiser;
