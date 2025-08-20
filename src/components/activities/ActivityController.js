import React, { useState, useEffect } from "react";
import AuthService from "../../services/AuthService";
import "../../styles/ActivityController.css";
import { FaTrash } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;
const currentUser = AuthService.getCurrentUser();

const ActivityController = ({ destinations }) => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    cost: "",
    duration: "",
    category: "Culture",
    destinationId: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch activities directly from backend after any change
  const fetchActivities = async () => {
    setLoading(true);
    try {
      // Fetch only user's activities from backend
      const response = await fetch(
        `${API_URL}/activities/user/${currentUser.id}`
      );
      const data = await response.json();
      setActivities(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch activities from backend (not from cached destinations)
  useEffect(() => {
    fetchActivities();
  }, []);

  // Helper to update destinations cache after activity change
  const updateDestinationsCache = async () => {
    try {
      const response = await fetch(API_URL + "/destinations", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      localStorage.setItem("destinations", JSON.stringify(data));
      localStorage.setItem("destinations_cache_time", Date.now());
    } catch (error) {
      console.error("Error updating destinations cache:", error);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create new activity
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(API_URL + "/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          cost: Number(form.cost),
          duration: Number(form.duration) || 0,
          destinationId: form.destinationId,
          category: form.category,
          createdByUserId: currentUser.id,
          createdByUsername: currentUser.username,
        }),
      });
      setForm({
        name: "",
        description: "",
        cost: "",
        duration: "",
        category: "Culture",
        destinationId: "",
      });
      await fetchActivities();
      await updateDestinationsCache();
    } finally {
      setLoading(false);
    }
  };

  // Edit activity
  const handleEdit = (activity) => {
    setEditingActivity(activity.id);
    setForm({
      name: activity.name,
      description: activity.description,
      cost: activity.cost,
      duration: activity.duration,
      category: activity.category,
      destinationId: activity.destinationId || "",
    });
  };

  // Update activity
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_URL}/activities/${editingActivity}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          cost: Number(form.cost),
          duration: Number(form.duration) || 0,
          destinationId: form.destinationId,
          category: form.category,
        }),
      });
      setEditingActivity(null);
      setForm({
        name: "",
        description: "",
        cost: "",
        duration: "",
        category: "Culture",
        destinationId: "",
      });
      await fetchActivities();
      await updateDestinationsCache();
    } finally {
      setLoading(false);
    }
  };

  // Delete activity
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/activities/${id}`, {
        method: "DELETE",
      });
      await fetchActivities();
      await updateDestinationsCache();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-controller-root content-wrapper content-padding">
      <div className="activity-controller-flex-row">
        <div className="activity-controller-left">
          <div>
            <h3>Share your unique experiences!</h3>
            <p>
              Create, edit, and manage your activities.
              Add details, costs, and durations to help other travelers discover your favorite spots.
            </p>
          </div>
        </div>
        <div className="activity-controller-right">
          <form
            className="activity-form"
            onSubmit={editingActivity ? handleUpdate : handleCreate}
          >
            <input
              type="text"
              name="name"
              placeholder="Activity Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
              rows={2}
            />
            <div className="activity-form-row">
              <input
                type="number"
                name="cost"
                placeholder="Cost (€)"
                value={form.cost}
                onChange={handleChange}
                min="0"
                required
              />
              <input
                type="number"
                name="duration"
                placeholder="Duration (minutes)"
                value={form.duration}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="activity-form-row">
              <select
                name="destinationId"
                value={form.destinationId}
                onChange={handleChange}
                required
              >
                <option value="">Select Destination</option>
                {destinations &&
                  destinations.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name}
                    </option>
                  ))}
              </select>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="Culture">Culture</option>
                <option value="Gastronomy">Gastronomy</option>
                <option value="Nature">Nature</option>
                <option value="Leisure">Leisure</option>
                <option value="Religion">Religion</option>
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {editingActivity ? "Update Activity" : "Add Activity"}
            </button>
            {editingActivity && (
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={() => {
                  setEditingActivity(null);
                  setForm({
                    name: "",
                    description: "",
                    cost: "",
                    duration: "",
                    category: "Culture",
                    destinationId: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Add the styled title above the activity cards */}
      <div className="activity-manager-title">
        Created Activities Manager
      </div>

      <div className="activity-list">
        {loading ? (
          <div className="loading-msg">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="no-activities-msg">No activities found.</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div>
                <strong>{activity.name}</strong> ({activity.category})<br />
                <span>{activity.description}</span>
                <div>
                  Cost: {activity.cost === 0 ? "Free" : `${activity.cost} €`}
                </div>
                <div>
                  Duration: {activity.duration} minutes
                </div>
                <div>
                  Destination:{" "}
                  {(() => {
                    const destObj = destinations.find(
                      (d) => d.id === activity.destinationId
                    );
                    return destObj
                      ? `${destObj.name}, ${destObj.country?.name ?? "Unknown"}`
                      : "Unknown";
                  })()}
                </div>
              </div>
              <div className="activity-actions">
                <button onClick={() => handleEdit(activity)}>Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(activity.id)}
                  title="Delete activity"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityController;