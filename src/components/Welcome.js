import React from 'react';
import '../styles/Welcome.css';

export const Welcome = () => {
    return (
        <div className="welcome-content">
            <div className="welcome-box">
                <h1 className="welcome-title">Welcome to Balkan RoadTrip!</h1>
                <p className="welcome-subtitle">
                    Discover, plan, and share your adventures in the Balkans.
                </p>
                <ul className="welcome-features">
                    <li>
                        <span role="img" aria-label="search">🔍</span> <b>Search experiences:</b> Find hidden gems and unique activities across the Balkans.
                    </li>
                    <li>
                        <span role="img" aria-label="community">🌍</span> <b>Join a community:</b> Connect with fellow travellers, share your own travel tips and activities.
                    </li>
                    <li>
                        <span role="img" aria-label="share">💡</span> <b>Share your discoveries:</b> Add your favorite places and activities for others to enjoy.
                    </li>
                    <li>
                        <span role="img" aria-label="organise">🗺️</span> <b>Organise your trip:</b> Select destinations, choose activities, and let us calculate the optimal driving route for your Balkan adventure.
                    </li>
                </ul>
                <div className="welcome-action">
                    <span>Ready to start exploring?</span>
                    <a href="/experiences" className="welcome-btn">Find Experiences</a>
                    <a href="/roadTrip" className="welcome-btn">Plan Your Trip</a>
                </div>
            </div>
        </div>
    );
};