// import React, { useState } from "react";
// import { FaCheck } from "react-icons/fa";
// import "../../styles/DaysOrganiser.css";

// const DaysOrganiser = ({ totalDays, routeData, selectedDestinations, selectedActivities }) => {

//     const [daysData, setDaysData] = useState([]); // State to store activities for each day

//     useEffect(() => {
//         distributeActivitiesRandomly();
//     }, [selectedActivities, totalDays]);


//     const distributeActivitiesRandomly = () => {
//         const days = Array.from({ length: totalDays }, () => ({ destinations: [] }));
//         selectedActivities.forEach((activity) => {
//             const randomDayIndex = Math.floor(Math.random() * totalDays);
//             const randomDestinationIndex = Math.floor(Math.random() * selectedDestinations.length);
//             const destination = selectedDestinations[randomDestinationIndex];
//             days[randomDayIndex].destinations.push(destination);
//             days[randomDayIndex].destinations[0].activities = days[randomDayIndex].destinations[0].activities || [];
//             days[randomDayIndex].destinations[0].activities.push(activity);
//         });
//         setDaysData(days);
//     };

//     // Generate boxes for each day
//     const renderDayBoxes = () => {
//         return daysData.map((day, index) => (
//             <div key={index} className="day-box">
//                 <h3>Day {index + 1}</h3>
//                 {day.destinations.map((destination, destIndex) => (
//                     <div key={destIndex}>
//                         <p>Destination: {destination.name}</p>
//                         <ul>
//                             {destination.activities.map((activity, activityIndex) => (
//                                 <li key={activityIndex}>{activity.name}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 ))}
//             </div>
//         ));
//     };

//     const handleSubmit = () => {
//         // console.log("Created road trip?");
//         // post in roadTrip table
//     };

//     return (
//         <div className="days-organiser-container">
//             <h1>Days Planner</h1>
//             <div className="days-wrapper">{renderDayBoxes()}</div>
//             <button onClick={handleSubmit}>Submit</button>
//         </div>
//     );
// };

// export default DaysOrganiser;


// TODO: concat working code with backend!

// Dummy Data TEST
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../../styles/DaysOrganiser.css";

const DaysOrganiser = () => {
    const [daysData, setDaysData] = useState([]);
    const [totalDays, setTotalDays] = useState(3);

    useEffect(() => {
        distributeActivitiesRandomly();
    }, []);

    // useEffect(() => {
    //     distributeActivitiesRandomly();
    // }, [totalDays]);

    const generateDummyActivities = () => {
        // Generate dummy activities
        const dummyActivities = [
            { id: 1, name: "Activity 1" },
            { id: 2, name: "Activity 2" },
            { id: 3, name: "Activity 3" },
            { id: 4, name: "Activity 4" },
            { id: 5, name: "Activity 5" }
        ];

        return dummyActivities;
    };

    const distributeActivitiesRandomly = () => {
        const dummyActivities = generateDummyActivities();
        const days = Array.from({ length: totalDays }, () => ({ activities: [] }));

        dummyActivities.forEach((activity) => {
            const randomDayIndex = Math.floor(Math.random() * totalDays);
            days[randomDayIndex].activities.push(activity);
        });

        setDaysData(days);
    };

    const generateEmptyDay = () => {
        return { activities: [] };
    };
    
    // Function to handle adding a new day
    const addDay = () => {
        setTotalDays(totalDays + 1);
        setDaysData([...daysData, generateEmptyDay()]);
    };

    // TODO: fix
    const removeDay = (indexToRemove) => {
        if (totalDays > 1) {
            setTotalDays(totalDays - 1);
            setDaysData(prevDaysData => prevDaysData.filter((_, index) => index !== indexToRemove));
        }
    };


    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;

        const updatedDaysData = [...daysData];
        const movedActivity = updatedDaysData[source.droppableId].activities[source.index];
        updatedDaysData[source.droppableId].activities.splice(source.index, 1);
        updatedDaysData[destination.droppableId].activities.splice(destination.index, 0, movedActivity);

        setDaysData(updatedDaysData);
    };

    
    const renderDayBoxes = () => {
        return daysData.map((day, index) => (
            <div key={index} className="day-box">
                <button className="remove-button" onClick={() => removeDay(index)}>-</button>
                <div className="day-header">
                    <h3>Day {index + 1}</h3>
                </div>
                <Droppable droppableId={`${index}`}>
                    {(provided) => (
                        <ul ref={provided.innerRef} {...provided.droppableProps}>
                            {day.activities && day.activities.map((activity, activityIndex) => (
                                <Draggable key={activity.id} draggableId={`${activity.id}`} index={activityIndex}>
                                    {(provided) => (
                                        <li
                                            key={activity.id}
                                            className="activity"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {activity.name}
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </div>
        ));
    };

    const handleSubmit = () => {
        // Handle form submission
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="days-organiser-container">
                <h1>Days Planner</h1>
                <div className="days-wrapper">{renderDayBoxes()}</div>
                <div className="buttons">
                    <button onClick={addDay}>Add Day</button>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </DragDropContext>
    );
};

export default DaysOrganiser;
