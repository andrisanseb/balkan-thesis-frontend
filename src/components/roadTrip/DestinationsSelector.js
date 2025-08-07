import React, { useState } from "react";
import "../../styles/DestinationsSelector.css";

const DestinationsSelector = ({
  destinations,
  selectedDestinations,
  addSelectedDestination,
  removeSelectedDestination,
  onNext,
  isRoundTrip,
  setIsRoundTrip,
}) => (
  <div className="content-wrapper content-padding">
    <h2 className="title">Destinations</h2>

    <div className="selected-destinations-list">
      {selectedDestinations.length === 0 ? (
        <span className="selected-placeholder">No destinations selected yet.</span>
      ) : (
        selectedDestinations.map((destination, idx) => (
          <div className="selected-destination-item" key={destination.id}>
            <span className="selected-order">{idx + 1}.</span>
            <span className="selected-name">{destination.name}</span>
          </div>
        ))
      )}
    </div>

    <div className="roadtrip-toggle-container" style={{ marginBottom: "1em" }}>
      <label>
        <input
          type="checkbox"
          checked={isRoundTrip}
          onChange={() => setIsRoundTrip(!isRoundTrip)}
        />{" "}
        Round Trip (return to starting point)
      </label>
    </div>

    <div className="destination-cards">
      {destinations.map((destination) => {
        const isSelected = selectedDestinations.includes(destination);
        let destination_img =
          process.env.PUBLIC_URL +
          "/images/destination/" +
          destination.img_path;
        let country_flag_img =
          process.env.PUBLIC_URL +
          "/images/country/flags/" +
          (destination.country && destination.country.name
            ? destination.country.name.slice(0, 3).toLowerCase()
            : "default") +
          ".png";
        return (
          <div
            key={destination.id}
            className={`destination-card${isSelected ? " selected" : ""}`}
            style={{ backgroundImage: "url(" + destination_img + ")" }}
            onClick={() =>
              isSelected
                ? removeSelectedDestination(destination)
                : addSelectedDestination(destination)
            }
          >
            <div className="destination-card-content">
              <p className="dest-name">{destination.name}</p>
              <img src={country_flag_img} alt="country_flag" />
            </div>
          </div>
        );
      })}
    </div>
    <button
      onClick={onNext}
      disabled={selectedDestinations.length < 2}
      className="next-btn"
    >
      Next
    </button>
  </div>
);

export default DestinationsSelector;