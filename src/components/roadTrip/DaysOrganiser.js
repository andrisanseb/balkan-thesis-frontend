import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import "../../styles/DaysOrganiser.css";

const DaysOrganiser = ({ routeData, selectedDestinations, selectedActivities }) => {

    // const [selectedActivities, setSelectedActivities] = useState(selectedActivities);

    // start using 3 days
    const [totalDays, setTotalDays] = useState(6); // later get number from ai response

    // Generate boxes for each day
    const renderDayBoxes = () => {
        const dayBoxes = [];
        for (let i = 1; i <= totalDays; i++) {
            dayBoxes.push(
                <div key={i} className="day-box">
                    <h3>Day {i}</h3>
                    {/* Here you can add content for each day */}
                </div>
            );
        }
        return dayBoxes;
    };

    const handleSubmit = () => {
        // console.log("Created road trip?");
    };

    return (
        <div className="days-organiser-container">
            <h1>Days Planner</h1>
            <div className="days-wrapper">{renderDayBoxes()}</div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default DaysOrganiser;
