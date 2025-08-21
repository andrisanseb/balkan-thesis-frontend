import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaRoute, FaTrash } from "react-icons/fa";
import "../../styles/MyRoadTrips.css";
import AuthService from "../../services/AuthService";

const MyRoadTrips = ({ destinations }) => {
  const [roadTrips, setRoadTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    async function fetchRoadTrips() {
      try {
        const res = await fetch(
          (process.env.REACT_APP_API_URL || "") + `/roadTrips/user/${currentUser.id}`
        );
        const data = await res.json();
        setRoadTrips(data.data);
      } catch (err) {
        setRoadTrips([]);
      }
      setLoading(false);
    }
    if (currentUser && currentUser.id) {
      fetchRoadTrips();
    }
  }, [currentUser]);

  const handleRemove = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this roadtrip?")) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || ""}/roadTrips/${tripId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setRoadTrips((prev) => prev.filter((trip) => trip.id !== tripId));
      } else {
        alert("Failed to delete roadtrip.");
      }
    } catch {
      alert("Failed to delete roadtrip.");
    }
  };

  // Helper: find activity object by ID from all destinations (same logic as Explore)
  const getActivityById = (id) => {
    for (const dest of destinations || []) {
      const found = (dest.activities || []).find((a) => a.id === id);
      if (found) return found;
    }
    return null;
  };

  if (loading) return <div>Loading roadtrips...</div>;
  if (!roadTrips.length)
    return (
      <div className="no-roadtrips-funny content-wrapper content-padding">
        <h2>No roadtrips found!</h2>
        <p>
          🏜️ Looks like your adventure bag is empty.<br />
          Why not start exploring and fill it with epic roadtrips?<br />
          Hit the road, discover new places, and let your journey begin! 🚗✨
        </p>
      </div>
    );

  return (
    <div className="my-roadtrips-container content-wrapper content-padding">
      <h2>My Roadtrips</h2>
      {roadTrips.map((trip, idx) => {
        let details = [];
        try {
          details = typeof trip.details === "string" ? JSON.parse(trip.details) : trip.details;
        } catch (e) {
          details = [];
        }

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
            <div className="roadtrip-days">
              <h4>Days & Activities:</h4>
              <ul>
                {details.map((day, i) => (
                  <li key={i}>
                    <span>{day.name ? day.name : `Day ${i + 1}`}: </span>
                    {day.travelRoute ? (
                      <span>
                        <FaRoute /> {day.travelRoute.start_address} → {day.travelRoute.end_address}
                        <span style={{ marginLeft: '8px' }}>
                          Distance: {(day.travelRoute.distance / 1000).toFixed(1)} km | Duration: {Math.floor(day.travelRoute.duration / 3600)}h {Math.round((day.travelRoute.duration % 3600) / 60)}m
                        </span>
                      </span>
                    ) : day.exploreDestination ? (
                      <span>
                        <FaMapMarkerAlt /> Explore Destination {day.exploreDestination}
                      </span>
                    ) : (
                      <span>No travel info</span>
                    )}
                    <div>
                      {day.activities && day.activities.length
                        ? day.activities.map((id) => {
                            const activity = getActivityById(id);
                            return (
                              <span key={id} className="activity-id">
                                {activity ? activity.name : `Activity #${id}`}{" "}
                              </span>
                            );
                          })
                        : <span>No activities</span>}
                    </div>
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