import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaClock, FaRoute, FaTrash } from "react-icons/fa";
import "../../styles/MyRoadTrips.css";

const API_URL = process.env.REACT_APP_API_URL || "";

const MyRoadTrips = () => {
  const [roadTrips, setRoadTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch roadtrips for the current user
    async function fetchRoadTrips() {
      try {
        // TODO: handle for different user IDs
        const res = await fetch(API_URL + "/roadTrips/user/1");
        const data = await res.json();
        setRoadTrips(data.data);
      } catch (err) {
        setRoadTrips([]);
      }
      setLoading(false);
    }
    fetchRoadTrips();
  }, []);

  const handleRemove = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this roadtrip?")) return;
    try {
      const res = await fetch(`${API_URL}/roadTrips/${tripId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRoadTrips((prev) => prev.filter((trip) => trip.id !== tripId));
      } else {
        alert("Failed to delete roadtrip.");
      }
    } catch {
      alert("Failed to delete roadtrip.");
    }
  };

  if (loading) return <div>Loading roadtrips...</div>;
  if (!roadTrips.length) return <div>No roadtrips found.</div>;

  return (
    <div className="my-roadtrips-container">
      <h2>My Roadtrips</h2>
      {roadTrips.map((trip, idx) => {
        let route = [];
        let days = [];
        try {
          route = typeof trip.route === "string" ? JSON.parse(trip.route) : trip.route;
          days = typeof trip.days === "string" ? JSON.parse(trip.days) : trip.days;
        } catch (e) {}

        return (
          <div key={trip.id || idx} className="roadtrip-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>{trip.name}</h3>
              <button
                className="remove-roadtrip-btn"
                title="Remove roadtrip"
                onClick={() => handleRemove(trip.id)}
              >
                <FaTrash />
              </button>
            </div>
            <div className="roadtrip-route">
              <h4><FaRoute /> Route:</h4>
              <ol>
                {route.map((segment, i) => (
                  <li key={i}>
                    <FaMapMarkerAlt /> <strong>{segment.start_address}</strong>
                    {" → "}
                    <strong>{segment.end_address}</strong>
                    <div>
                      Distance: {(segment.distance / 1000).toFixed(1)} km
                      {" | "}
                      Duration: {Math.floor(segment.duration / 3600)}h {Math.round((segment.duration % 3600) / 60)}m
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="roadtrip-days">
              <h4>Days & Activities:</h4>
              <ul>
                {days.map((day, i) => (
                  <li key={i}>
                    <span>{day.name ? day.name : `Day ${i + 1}`}: </span>
                    {day.activityIds.length
                      ? day.activityIds.map((id) => (
                          <span key={id} className="activity-id">
                            Activity #{id}{" "}
                          </span>
                        ))
                      : <span>No activities</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="roadtrip-meta">
              <small>
                Created: {new Date(trip.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyRoadTrips;