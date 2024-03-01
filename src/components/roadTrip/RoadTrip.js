import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import AuthService from '../../services/AuthService';
import  '../../styles/RoadTrip.css';
import { FaCheck } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

import 'leaflet/dist/leaflet.css';



const RoadTrip = () => {
    const [destinations, setDestinations] = useState([]);
    const [selectedDestinations, setSelectedDestinations] = useState([]);
    const [currentView, setCurrentView] = useState(1);

    const location = useLocation();

    //Route
    const apiKey = "5b3ce3597851110001cf6248f5e662ffc8c848ff8e860b2b731eb023";
    const [routeData, setRouteData] = useState(null);





    useEffect(() => {
        fetchDestinations();
        // Clear states when URL changes
        return () => {
            setSelectedDestinations([]);
            setCurrentView(1);
            setRouteData(null);
        };
    }, [location.pathname]); // Run this effect whenever the location pathname changes


    const fetchDestinations = async () => {
        try {
            const response = await fetch('http://localhost:4000/destinations');
            const data = await response.json();
            setDestinations(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    if (!destinations) {
        return <div>Loading...</div>;
    }


    const addSelectedDestination = (destination) => {
        setSelectedDestinations(prevSelectedDestinations => [...prevSelectedDestinations, destination]);
    }

    const removeSelectedDestination = (destination) => {
        const updatedSelectedDestinations = selectedDestinations.filter(selectedDestination => selectedDestination !== destination);
        setSelectedDestinations(updatedSelectedDestinations);
    }

    const nextView = () => {
        setCurrentView(currentView + 1);
    };



    const calculateRoute = async () => {
        try {
            const selectedDestinationsCoordinates = selectedDestinations.map(destination => [destination.longitude, destination.latitude]);
            const startFinishPoint = [selectedDestinations[0].longitude, selectedDestinations[0].latitude];
    
            const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    coordinates: selectedDestinationsCoordinates,
                }),
            });
    
            const data = await response.json();
            setRouteData(data); // Store route data in state
            console.log(data);
        } catch (error) {
            console.error('Error calculating route:', error);
        }
    };


    const showRouteData = () => {
        if (routeData) {
            return (
                <div>
                    <h2>Route Data</h2>
                    <p>Distance: {routeData.routes[0].summary.distance} meters</p>
                    <p>Duration: {routeData.routes[0].summary.duration} seconds</p>
                    {/* You can display more route information here */}
                </div>
            );
        } else {
            return <p>No route data available</p>;
        }
    };

    
    const renderCard = () => {
        switch (currentView) {
            case 1:
            return <Card1 onNext={nextView} />;
            case 2:
            return <Card2 onNext={nextView} />;
            case 3:
            return <Card3 onNext={nextView}/>;
            default:
            return null;
        }
        };



    

      
    const Card1 = ({ onNext }) => (
        <div>
        <div className="destinations-section">
            <div className='content-section'>
                <h2 className='title'>Destinations</h2>
                <div className='cards'>
                    {destinations.map((destination) => {
                        const isSelected = selectedDestinations.includes(destination);
                        let destination_img = process.env.PUBLIC_URL +'/images/destination/'+destination.img_path;
                        let country_flag_img = process.env.PUBLIC_URL +'/images/country/flags/'+destination.country.name.slice(0,3).toLowerCase()+'.png';
                        let destination_details_path = "/explore/destinations/"+destination.id;

                        return (
                            <div 
                                key={destination.id} 
                                className={`card ${isSelected ? 'selected' : ''}`} 
                                style={{backgroundImage: "url(" + destination_img + ")"}}
                                onClick={() => isSelected ? removeSelectedDestination(destination) : addSelectedDestination(destination)}
                            >
                                <div className='card-content'>
                                    <p className='dest-name'>{destination.name}</p>
                                    <img src={country_flag_img} alt='country_flag' />
                                    {isSelected && <FaCheck className="checkmark" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
          <button onClick={onNext}>Continue</button>
        </div>
      );
      
      const Card2 = ({ onNext }) => ( 
        <div>
          <h2>Card 2</h2>
          <p>This is the content of Card 2</p>
            {selectedDestinations && selectedDestinations.length > 0 && (
            <div className='selected-destinations-section'>
                <h2 className='title'>Selected Destinations</h2>
                <ul>
                    {selectedDestinations.map((selectedDestination, index) => (
                        <li key={index}>
                            <strong>Name:</strong> {selectedDestination.name}<br />
                            <strong>Description:</strong> {selectedDestination.description}<br />
                            <strong>Longitude:</strong> {selectedDestination.longitude}<br />
                            <strong>Latitude:</strong> {selectedDestination.latitude}<br />
                            <strong>Country:</strong> {selectedDestination.country.name}<br />
                        </li>
                    ))}
                </ul>

                <div>
                    <button onClick={calculateRoute}>Calculate Route</button>
                    {showRouteData()}
                </div>         
            </div>
        )}

          <button onClick={onNext}>Next, (Show Map)</button>
        </div>
      );
      
      const Card3 = ({ onNext }) => (
        <div>
          <h2>Map</h2>
        </div>
      );




    return (
        <>
        <div>
            {renderCard()}
        </div>

      
    </>
    );



};
export default RoadTrip;