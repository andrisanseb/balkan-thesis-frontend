import React, { useState, useEffect } from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import AuthService from '../../services/AuthService';
// import  '../../styles/DestinationDetails.css';


const DestinationDetails = () => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [destination, setDestination] = useState([]);
    const [country, setCountry] = useState([]);
    const [activities, setActivities] = useState([]);
    const currentUser = AuthService.getCurrentUser();
    const navigate = useNavigate();
    const params = useParams();
    const destinationId = params.id;

    useEffect(() => {
        fetchDestination();
    }, []);

    const fetchDestination = async () => {
        try {
            const response = await fetch(API_URL+"/destinations/"+destinationId);
            const data = await response.json();
            setDestination(data);
            setCountry(data.country);
            setActivities(data.activities);
            console.log(data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    if (!destination) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <p>{destination.name}</p>
        <p>{destination.description}</p>
        <p>{country.name}</p>
        {activities.map((activity) => {
            return (
                <div key={activity.id} className="activity-section">
                    <p className="activity-name">{activity.name}</p>
                    <p className="activity-description">{activity.description}</p>
                    <p className="activity-price">{activity.cost}</p>
                </div>
                    );
        })}
        </>
            );
};
export default DestinationDetails;