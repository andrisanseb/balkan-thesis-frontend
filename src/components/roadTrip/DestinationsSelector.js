import React from "react";
import { FaCheck } from "react-icons/fa";
import "../../styles/DestinationsSelector.css";

const DestinationsSelector = ({
  destinations,
  selectedDestinations,
  addSelectedDestination,
  removeSelectedDestination,
  onNext,
}) => (
  <div className="destinations-section">
    <div className="content-section">
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

      <div className="cards">
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
              className={`card ${isSelected ? "selected" : ""}`}
              style={{ backgroundImage: "url(" + destination_img + ")" }}
              onClick={() =>
                isSelected
                  ? removeSelectedDestination(destination)
                  : addSelectedDestination(destination)
              }
            >
              <div className="card-content">
                <p className="dest-name">{destination.name}</p>
                <img src={country_flag_img} alt="country_flag" />
                {isSelected && <FaCheck className="checkmark" />}
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={onNext}
        disabled={selectedDestinations.length === 0}
        className="next-btn"
      >
        Next
      </button>
    </div>
  </div>
);

export default DestinationsSelector;