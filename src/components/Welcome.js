import React from 'react';
import AuthService from '../services/AuthService';
import { Link } from 'react-router-dom';
import '../styles/Welcome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaw } from '@fortawesome/free-solid-svg-icons';

export const Welcome = () => {
    const currentUser = AuthService.getCurrentUser();

    return (
        <div className="welcome-container">
            <h2>WELCOME {currentUser && currentUser.username.toUpperCase()} <FontAwesomeIcon icon={faPaw}/> </h2>
            <div className="card-container">
                <div className="card-row">
                    <Link to="/my-profile" className="card">
                        <div className="card-content">MY PROFILE</div>
                    </Link>
                    <Link to="/my-dogs" className="card">
                        <div className="card-content">MY DOGS</div>
                    </Link>
                    <Link to="/my-friends" className="card">
                        <div className="card-content">MY FRIENDS</div>
                    </Link>
                </div>
                <div className="card-row">
                    <Link to="/my-requests" className="card">
                        <div className="card-content">MY REQUESTS</div>
                    </Link>
                    <Link to="/accepted-requests" className="card">
                        <div className="card-content">ACCEPTED REQUESTS</div>
                    </Link>
                    <Link to="/favorites" className="card">
                        <div className="card-content">FAVORITES</div>
                    </Link>
                </div>
            </div>
        </div>
    );
};