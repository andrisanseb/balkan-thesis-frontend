import  '../../styles/PlanNewTrip.css';
import {Link, useNavigate} from "react-router-dom";



const PlanNewTrip = () => {

    return (
        <>
        <div className="choose-section">
            <div className="flight-section" >
                <div className='choose-container'>
                    <h1>FLIGHT</h1>
                    <p>Experience an unique destination</p>
                    <button class="big-button">Flight</button>
                </div>
            </div>
            <div className="road-trip-section">
                <div className='choose-container'>
                    <h1>ROAD TRIP</h1>
                    <p>Get ready to hit the open road, create lasting memories, and discover new horizons!</p>
                    <button class="big-button"><Link to={"roadTrip"}>Road Trip</Link></button>
                </div>
            </div>
        </div>
        </>
    );
}

export default PlanNewTrip;