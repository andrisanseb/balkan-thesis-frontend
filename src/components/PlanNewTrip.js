import { useState } from 'react';
import '../styles/PlanNewTrip.css';
import {Link} from "react-router-dom";
import ChooseTripType from './planNewTrip/ChooseTripType';

export const PlanNewTrip = () => {

    const [activeView, setActiveView] = useState("ChooseTripType");
    const [tripType, setTripType] = useState("");

    const onClickChangeView = (e) => {
        const { name, value } = e.target;
        if (name === 'tripType') {
            setTripType(value);
            setActiveView("ChooseDestinations")
        }
    };

    return (
        <div>
                
            <div>
                <h2>Plan a new Trip</h2>
                <p>Choose Trip Type:</p>
                {activeView === "ChooseTripType" && <ChooseTripType title="ChooseTripType"/>}
                <button value={"road"} onClick= {onClickChangeView}>Road Trip</button>
                <button value={"fly"} onClick= {onClickChangeView}>Fly To Destination</button>
            </div>
        </div>
    );
};