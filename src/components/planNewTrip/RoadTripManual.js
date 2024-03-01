import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import AuthService from '../../services/AuthService';
import  '../../styles/RoadTrip.css';
import { FaCheck } from 'react-icons/fa';



const RoadTripManual = () => {
    const [destinations, setDestinations] = useState([]);
    const currentUser = AuthService.getCurrentUser();
    const navigate = useNavigate();
    const [selectedDestinations, setSelectedDestinations] = useState([]);
    // Define state to toggle what to show
    const [showText, setShowText] = useState(false);
    const [currentCard, setCurrentCard] = useState(1);



    useEffect(() => {
        fetchDestinations();
    }, []);

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

    const handleNextPage = () => {
        // Navigate to the next page with selected destinations as parameters
        navigate('overview', { selectedDestinations });
    };



    // State Functionality
    // const toggleText = () => {
    //     setShowText(!showText);
    // };

    const nextCard = () => {
        setCurrentCard(currentCard + 1);
      };


      const renderCard = () => {
        switch (currentCard) {
          case 1:
            return <Card1 onNext={nextCard} />;
          case 2:
            return <Card2 onNext={nextCard} />;
          case 3:
            return <Card3 onNext={nextCard} />;
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
            <div className='proceed-btn-section'>
                <button className='proceed-btn' onClick={handleNextPage} >Continue</button>
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
                            {selectedDestination.name}
                        </li>
                    ))}
                </ul>         
            </div>
        )}
          <button onClick={onNext}>Continue</button>
        </div>
      );
      
      const Card3 = ({ onNext }) => (
        <div>
          <h2>Card 3</h2>
          <p>This is the content of Card 3</p>
          <button onClick={onNext}>Continue</button>
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
export default RoadTripManual;