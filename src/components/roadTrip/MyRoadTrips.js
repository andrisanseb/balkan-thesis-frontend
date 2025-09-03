import React, { useEffect, useState } from "react";
import { FaRoute, FaTrash, FaMoneyBillWave, FaClock, FaCarSide, FaSpinner } from "react-icons/fa";
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

  if (loading)
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
      </div>
    );
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
    <div className="content-wrapper content-padding">
      <h2>My Roadtrips</h2>
      <div className="roadtrip-list-flex">
        {roadTrips.map((trip, idx) => {
          let details = [];
          try {
            details = typeof trip.details === "string" ? JSON.parse(trip.details) : trip.details;
          } catch (e) {
            details = [];
          }

          // Calculate total cost for the roadtrip
          let totalTripCost = 0;
          // Calculate total km and total travel duration (seconds)
          let totalKm = 0;
          let totalTravelSeconds = 0;

          return (
            <div key={trip.id || idx} className="roadtrip-card fun-roadtrip-card">
              <div>
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
                <ul>
                  {details.map((day, i) => {
                    const hasRoute = !!day.travelRoute;
                    const hasActivities = day.activities && day.activities.length > 0;
                    const isLastDay = i === details.length - 1;

                    // Calculate day totals
                    let dayCost = 0;
                    let dayDuration = 0;

                    // Accumulate route stats
                    if (hasRoute && day.travelRoute) {
                      totalKm += day.travelRoute.distance / 1000;
                      totalTravelSeconds += day.travelRoute.duration;
                    }

                    return (
                      <li key={i}>
                        <div className="fun-day-header">
                          <span className="fun-day-title">
                            {day.name ? day.name : `Day ${i + 1}`}:
                          </span>
                          {hasRoute && (
                            <span className="fun-route">
                              <FaCarSide style={{ color: "#1976d2", marginRight: 4 }} />
                              <b>{day.travelRoute.start_address}</b> → <b>{day.travelRoute.end_address}</b>
                              <span style={{ marginLeft: '8px', color: "#1565c0" }}>
                                <FaRoute style={{ marginRight: 2 }} />
                                {(day.travelRoute.distance / 1000).toFixed(1)} km | {Math.floor(day.travelRoute.duration / 3600)}h {Math.round((day.travelRoute.duration % 3600) / 60)}m
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="fun-activities-list">
                          {hasActivities
                            ? day.activities.map((id) => {
                                const activity = getActivityById(id);
                                // If activity does not exist or has no name, skip rendering entirely
                                if (!activity || !activity.name) return null;
                                dayCost += activity.cost || 0;
                                dayDuration += activity.duration || 0;
                                totalTripCost += activity.cost || 0;
                                let durationStr = "?";
                                if (activity.duration) {
                                  const mins = activity.duration;
                                  const hours = Math.floor(mins / 60);
                                  const minutes = mins % 60;
                                  durationStr =
                                    (hours > 0 ? `${hours}h` : "") +
                                    (minutes > 0 ? ` ${minutes}min` : "");
                                }
                                return (
                                  <div key={id} className="fun-activity-box">
                                    <span className="activity-name-fun">
                                      {activity.name}
                                    </span>
                                    <span className="activity-details-fun">
                                      <FaClock style={{ color: "#1976d2", marginRight: 2 }} />
                                      {durationStr}
                                      {" | "}
                                      <FaMoneyBillWave style={{ color: "#1976d2", marginRight: 2 }} />
                                      {activity.cost === 0 ? "Free" : `${activity.cost} €`}
                                    </span>
                                  </div>
                                );
                              })
                            : hasRoute
                              ? isLastDay
                                ? <span className="no-activities">🏠 Return back home</span>
                                : <span className="no-activities">🚗 Only driving day</span>
                              : <span className="no-activities">🧘 Relax day</span>
                          }
                        </div>
                        {(hasActivities || dayCost > 0 || dayDuration > 0) && (
                          <div className="fun-day-summary">
                            <span>
                              <FaMoneyBillWave style={{ color: "#388e3c", marginRight: 4 }} />
                              <b>Day Cost:</b> {dayCost} €
                            </span>
                            <span style={{ marginLeft: 16 }}>
                              <FaClock style={{ color: "#1976d2", marginRight: 4 }} />
                              <b>Activities Duration:</b> {
                                (() => {
                                  const hours = Math.floor(dayDuration / 60);
                                  const minutes = dayDuration % 60;
                                  return (hours > 0 ? `${hours}h` : "") + (minutes > 0 ? ` ${minutes}min` : "");
                                })()
                              }
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="roadtrip-meta fun-roadtrip-meta">
                <span>
                  <FaMoneyBillWave style={{ color: "#388e3c", marginRight: 4 }} />
                  <b>Total Trip Cost:</b> {totalTripCost} €
                </span>
                <br />
                <span>
                  <FaRoute style={{ color: "#1976d2", marginRight: 4 }} />
                  <b>Total Distance:</b> {totalKm.toFixed(1)} km
                </span>
                <br />
                <span>
                  <FaCarSide style={{ color: "#1976d2", marginRight: 4 }} />
                  <b>Estimated Travel Time:</b> {
                    (() => {
                      const hours = Math.floor(totalTravelSeconds / 3600);
                      const minutes = Math.round((totalTravelSeconds % 3600) / 60);
                      return (hours > 0 ? `${hours}h` : "") + (minutes > 0 ? ` ${minutes}min` : "");
                    })()
                  }
                </span>
                <br />
                <small>
                  Created: {new Date(trip.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRoadTrips;