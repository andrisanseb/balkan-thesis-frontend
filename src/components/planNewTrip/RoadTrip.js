import { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import  '../../styles/RoadTrip.css';



const RoadTrip = () => {
    const [roadTripOption, setRoadTripOption] = useState("");
    const navigate = useNavigate();

    
    return (     
        <div className='choose-roadtrip-container'>
            <div className="options-container">
                <div className='option1'>
                    <p>Choose where you want to go, we do the rest!</p>
                    <button class="big-button"><Link to={"create/manual"}><p className='option-title'>Manual</p></Link></button>
                </div>
                <div className='option2'>
                    <p>Want to hit the road immediatly? You will love our suggestions!</p>
                    <button class="big-button"><Link to={"create/closeToMe"}><p className='option-title'>Close to Me</p></Link></button>
                </div>
                <div className='option3'>
                    <p>Feeling daring?</p>
                    <button class="big-button"><Link to={"create/random"}><p className='option-title'>Random</p></Link></button>
                </div>
            </div>
        </div>
    );
}

export default RoadTrip;