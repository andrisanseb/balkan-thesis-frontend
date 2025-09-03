import React, { useEffect, useState } from 'react';
import '../styles/Welcome.css';

// get all image filenames from /public/images/destination
const getAllDestinationImages = async () => {
    try {
        const res = await fetch(process.env.PUBLIC_URL + "/images/destination/list.json");
        if (!res.ok) return [];
        const files = await res.json();
        return files.map(filename => process.env.PUBLIC_URL + "/images/destination/" + filename);
    } catch {
        return [];
    }
};

export const Welcome = () => {
    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        getAllDestinationImages().then(setImages);
    }, []);

    useEffect(() => {
        if (images.length < 2) return;
        const timer = setInterval(() => {
            setCurrent(c => (c + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images]);

    return (
        <div className="welcome-content">
            <div className="welcome-box">
                <h1 className="welcome-title">Welcome to BalkanTrip!</h1>
                <p className="welcome-subtitle">
                    Discover, plan, and share your adventures in the Balkans.
                </p>
                <ul className="welcome-features">
                    <li>
                        <span role="img" aria-label="search">🔍</span>
                        <div>
                            <b>Discover:</b>
                            <div className="feature-desc">Find hidden gems and unique activities across the Balkans.</div>
                        </div>
                    </li>
                    <li>
                        <span role="img" aria-label="community">🌍</span>
                        <div>
                            <b>Community:</b>
                            <div className="feature-desc">Connect with fellow travellers, share your own travel tips and activities.</div>
                        </div>
                    </li>
                    <li>
                        <span role="img" aria-label="share">💡</span>
                        <div>
                            <b>Share:</b>
                            <div className="feature-desc">Add your favorite places and activities for others to enjoy.</div>
                        </div>
                    </li>
                    <li>
                        <span role="img" aria-label="organise">🗺️</span>
                        <div>
                            <b>Plan:</b>
                            <div className="feature-desc">Select destinations, choose activities, and let us calculate the optimal driving route for your Balkan adventure.</div>
                        </div>
                    </li>
                </ul>
                                <div className="welcome-slideshow">
                    {images.length > 0 ? (
                        <img
                            src={images[current]}
                            alt="Destination"
                            className="welcome-slideshow-img"
                        />
                    ) : (
                        <div className="welcome-slideshow-placeholder">
                            No destination images found.
                        </div>
                    )}
                    {images.length > 1 && (
                        <div className="welcome-slideshow-controls">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`welcome-slideshow-dot${idx === current ? " active" : ""}`}
                                    onClick={() => setCurrent(idx)}
                                    aria-label={`Show image ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="welcome-action">
                    <a href="/experiences" className="welcome-btn">Find Experiences</a>
                    <a href="/roadTrip" className="welcome-btn">Plan Your Trip</a>
                </div>
            </div>
        </div>
    );
};