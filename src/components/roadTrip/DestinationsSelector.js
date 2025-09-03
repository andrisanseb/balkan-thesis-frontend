import React, { useMemo } from "react";
import "../../styles/DestinationsSelector.css";

const DestinationsSelector = ({
  destinations,
  selectedDestinations,
  addSelectedDestination,
  removeSelectedDestination,
  onNext,
  isRoundTrip,
  setIsRoundTrip,
}) => {
  // Shuffle destinations once per mount
  const shuffledDestinations = useMemo(() => {
    if (!destinations) return [];
    return [...destinations].sort(() => Math.random() - 0.5);
  }, [destinations]);

  return (
    <div className="content-wrapper content-padding">
      <div className="selector-row">
        <div className="selector-left">
          <div className="catchy-intro">
            <h1 className="big-green-title">READY TO PLAN YOUR ADVENTURE ?</h1>
            <div className="roadtrip-toggle-btns">
              <button
                type="button"
                className={`toggle-btn${!isRoundTrip ? " active" : ""}`}
                onClick={() => setIsRoundTrip(false)}
              >
                One-way
              </button>
              <button
                type="button"
                className={`toggle-btn${isRoundTrip ? " active" : ""}`}
                onClick={() => setIsRoundTrip(true)}
              >
                Road Trip
              </button>
            </div>
          </div>
        </div>
        <div className="selector-right">
          <h3>
            {isRoundTrip
              ? (
                <>
                  Choose your stops! <br />
                  We'll find the optimal round trip route, returning to your starting point.
                </>
              )
              : (
                <>
                  Choose your stops! <br />
                  The best one-way route will be calculated, and your finish destination will be found.
                </>
              )
            }
          </h3>
          <div className="selected-destinations-list">
            {selectedDestinations.length === 0 ? (
              <span className="selected-placeholder">No destinations selected yet.</span>
            ) : (
              <>
                {selectedDestinations.map((destination, idx) => (
                  <div className="selected-destination-item" key={destination.id}>
                    {idx === 0 ? (
                      <span className="selected-order" title="Start">🚩</span>
                    ) : null}
                    <span className="selected-name">{destination.name}</span>
                  </div>
                ))}
                {isRoundTrip && selectedDestinations.length > 0 && (
                  <div className="selected-destination-item">
                    <span className="selected-order" title="Finish">🏁</span>
                    <span className="selected-name">{selectedDestinations[0].name}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="destination-cards">
        {shuffledDestinations.map((destination) => {
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
};

export default DestinationsSelector;