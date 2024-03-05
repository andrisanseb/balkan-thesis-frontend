import React, {useEffect, useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/Nav.css';

export const NavBar = () => {
    const currentUser = AuthService.getCurrentUser();
    const [user, setUser] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:4000/users/${currentUser.id}`);
            const data = await response.json();
            setUser(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    const handleLogout = () => {
        AuthService.logout();
    };

    return (
        <nav>
            <div className="navbar-container">
                <div className="navbar-left">
                    <NavLink to="/get-started">HOME</NavLink>
                    <NavLink to="/explore/destinations">DESTINATIONS</NavLink>
                    <NavLink to="/activities">ACTIVITIES</NavLink>
                    <NavLink to="/itineraries">ITINERARIES</NavLink>
                    <NavLink to="/explore">EXPLORE</NavLink>
                    <NavLink to="/roadTrip">ROAD TRIP</NavLink>
                    <NavLink to="/planNewTrip">PLAN NEW TRIP</NavLink>
                    <NavLink to="/test">Test Component</NavLink>


                </div>
                <div className="navbar-right">
                    {currentUser ? (
                        <div className="user-info">
                            <Link className="username" to="/my-profile">{currentUser.username.toUpperCase()}</Link>
                            <Link onClick={handleLogout} to="/get-started">LOGOUT</Link>
                        </div>
                    ) : (
                        <Link to="/login">LOGIN</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};