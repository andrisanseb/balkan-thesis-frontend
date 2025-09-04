import React from "react";
import { FaHeart, FaRegHeart, FaYoutube, FaStar, FaCheck } from "react-icons/fa";
import "../../styles/ActivitiesList.css";

const ActivityList = ({
  activities = [],
  destinations = [],
  onActivityClick,
  selectedActivities = [],
  favoriteActivities = {},
  onFavoriteToggle,
  activityRatings = {},
  activityReviewCounts = {},
  userReviews = {},
  allReviews = [],
  reviewSlideIndexes = {},
  handleStarClick,
  showReviewRow = true,
  showFavorite = true,
  showYoutube = true,
  showRatingRow = true,
  showCreatedBy = false,
}) => {
  // Helper to get destination info
  const getDestinationInfo = (activity) => {
    if (!activity.destinationId && !activity.destination) return null;
    const destId = activity.destinationId || (activity.destination && activity.destination.id);
    const destination = destinations.find((d) => d.id === destId);
    if (!destination) return null;
    const countryFlagImg =
      process.env.PUBLIC_URL +
      "/images/country/flags/" +
      (destination.country && destination.country.name
        ? destination.country.name.slice(0, 3).toLowerCase()
        : "default") +
      ".png";
    return {
      name: destination.name,
      flag: countryFlagImg,
    };
  };

  return (
    <div className="activity-cards">
      {activities.map((activity) => {
        const destInfo = getDestinationInfo(activity);
        const avgRating = activityRatings[activity.id];
        const reviewCount = activityReviewCounts[activity.id] || 0;
        const hasUserReviewed = !!userReviews[activity.id];
        const reviewsForActivity = allReviews.filter(r => r.activityId === activity.id);
        const slideIndex = reviewSlideIndexes[activity.id] || 0;
        const reviewToShow =
          reviewsForActivity.length > 1
            ? reviewsForActivity[slideIndex]
            : reviewsForActivity[0];
        const isSelected = selectedActivities.some(a => a.id === activity.id);

        return (
          <div
            key={activity.id}
            className={`activity-card${isSelected ? " selected" : ""}`}
            onClick={() => onActivityClick && onActivityClick(activity)}
            style={{ cursor: onActivityClick ? "pointer" : "default" }}
          >
            {/* Created by user flag in top right */}
            {showCreatedBy && activity.createdByUserId && (
              <div
                className="activity-created-flag"
                title={`This activity has been created by: ${activity.createdByUsername ? activity.createdByUsername : activity.createdByUserId}`}
              >
                <span className="activity-created-user">
                  {activity.createdByUsername
                    ? activity.createdByUsername
                    : activity.createdByUserId}
                </span>
              </div>
            )}
            <div className="activity-card-content">
              <div className="activity-dest-info">
                {destInfo && (
                  <>
                    <img
                      src={destInfo.flag}
                      alt="country_flag"
                      className="activity-country-flag"
                    />
                    <span className="activity-dest-name">{destInfo.name}</span>
                  </>
                )}
              </div>
              <p className="activity-name">
                {activity.name}
                {isSelected && (
                  <span className="activity-list-selected-icon">
                    <FaCheck />
                  </span>
                )}
              </p>
              <p className="activity-description">{activity.description}</p>
              <div className="activity-details">
                <div className="activity-cost">
                  💸 {activity.cost === 0 ? "Free" : `${activity.cost} €`}
                </div>
                <div className="activity-duration">
                  ⏱ {
                    (() => {
                      const mins = Number(activity.duration) || 0;
                      const hours = Math.floor(mins / 60);
                      const minutes = mins % 60;
                      let result = "";
                      if (hours > 0) result += `${hours}h `;
                      if (minutes > 0 || hours === 0) result += `${minutes}min`;
                      return result.trim();
                    })()
                  }
                </div>
              </div>
            </div>
            {/* Review slideshow row */}
            {showReviewRow && reviewsForActivity.length > 0 && reviewToShow && (
              <div className="activity-user-review-row">
                <span className="activity-user-review-chip">
                  <span className="activity-user-review-username">
                    {reviewToShow.userUsername
                      ? reviewToShow.userUsername
                      : `User #${reviewToShow.userId}`}
                  </span>
                  <span className="activity-user-review-stars">
                    {[...Array(reviewToShow.stars)].map((_, i) => (
                      <FaStar key={i} style={{ color: "#FFD700", fontSize: "1em", marginRight: "2px" }} />
                    ))}
                  </span>
                  {reviewToShow.comment && (
                    <span className="activity-user-review-comment">
                      "{reviewToShow.comment}"
                    </span>
                  )}
                </span>
              </div>
            )}
            <div className="activity-actions-row">
              {showRatingRow && (
                <div className="activity-rating-row">
                  {reviewCount > 0 ? (
                    <>
                      <span className="activity-rating-value">
                        {avgRating
                          ? Number.isInteger(avgRating)
                            ? avgRating
                            : avgRating.toFixed(1).replace(/\.0$/, '')
                          : ""}
                      </span>
                      <FaStar
                        className={`activity-rating-star ${hasUserReviewed ? "user-reviewed" : "user-not-reviewed"}`}
                        style={{ cursor: "pointer" }}
                        title="Click to review this activity"
                        onClick={e => {
                          e.stopPropagation();
                          handleStarClick && handleStarClick(activity.id);
                        }}
                      />
                      <span className="activity-review-count">
                        ({reviewCount})
                      </span>
                    </>
                  ) : (
                    <>
                      <FaStar
                        className="activity-rating-star user-not-reviewed"
                        style={{ cursor: "pointer" }}
                        title="Be the first to review this activity!"
                        onClick={e => {
                          e.stopPropagation();
                          handleStarClick && handleStarClick(activity.id);
                        }}
                      />
                      <span className="activity-review-count" style={{ color: "#888", marginLeft: "6px" }}>
                        no reviews yet
                      </span>
                    </>
                  )}
                </div>
              )}
              {showYoutube && (
                <button
                  className="youtube-btn"
                  title="Watch most related video on YouTube"
                  onClick={e => {
                    e.stopPropagation();
                    window.open(
                      `https://www.youtube.com/results?search_query=${encodeURIComponent(activity.name + " " + (destInfo?.name || ""))}&sp=EgIQAQ%253D%253D`,
                      "_blank"
                    );
                  }}
                >
                  <FaYoutube className="youtube-icon" />
                </button>
              )}
              {showFavorite && (
                favoriteActivities[activity.id] ? (
                  <FaHeart
                    className="heart-icon liked"
                    onClick={e => {
                      e.stopPropagation();
                      onFavoriteToggle && onFavoriteToggle(activity.id);
                    }}
                  />
                ) : (
                  <FaRegHeart
                    className="heart-icon"
                    onClick={e => {
                      e.stopPropagation();
                      onFavoriteToggle && onFavoriteToggle(activity.id);
                    }}
                  />
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityList;