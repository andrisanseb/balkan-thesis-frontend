import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import  '../../styles/DestinationsList.css';


const DestinationList = ({ destinations }) => {
    if (!destinations) {
        return <div>Loading...</div>;
    }

    return (
        <div className="destinations-section">
            <div className='content-section'>
                <h2 className='title'>Explore Destinations</h2>
                <div className='cards'>
                    {destinations.map((destination) => {
                        let destination_img = process.env.PUBLIC_URL +'/images/destination/'+destination.img_path;
                        let country_flag_img = process.env.PUBLIC_URL +'/images/country/flags/'+destination.country.name.slice(0,3).toLowerCase()+'.png';
                        let destination_details_path = "/explore/destinations/"+destination.id;
                            return (
                                <div key={destination.id} className='card' style={{backgroundImage: "url(" + destination_img + ")"}}>
                                    <div className='card-content'>
                                        <Link to={destination_details_path}><p className='dest-name'>{destination.name}</p></Link>
                                        <img src={country_flag_img} alt='country_flag' />
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
            );
};
export default DestinationList;