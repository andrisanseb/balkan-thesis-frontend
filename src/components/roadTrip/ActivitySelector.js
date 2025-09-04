import React, { useState, useEffect } from "react";
import ActivityList from "../activities/ActivityList";
import "../../styles/ActivitySelector.css";
import { useReviewModal } from "../../hooks/useReviewModal";
import ReviewModal from "../activities/ReviewModal";

const categories = [
  "All",
  "Culture",
  "Gastronomy",
  "Nature",
  "Leisure",
  "Religion",
];

const ActivitySelector = ({
  selectedDestinations,
  selectedActivities: selectedActivitiesProp = [],
  onSelectedActivitiesChange,
  onNext,
  onBack,
}) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [selectedActivities, setSelectedActivities] = useState(selectedActivitiesProp);
  const [allActivities, setAllActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState("All");
  const [activityRatings, setActivityRatings] = useState({});
  const [activityReviewCounts, setActivityReviewCounts] = useState({});
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteActivities, setFavoriteActivities] = useState({});

  // Review modal hook
  const {
    reviewModalOpen,
    reviewActivityId,
    reviewStars,
    setReviewStars,
    reviewComment,
    setReviewComment,
    reviewSubmitting,
    setReviewSubmitting,
    openReviewModal,
    closeReviewModal,
  } = useReviewModal();

  // Fetch favorite activities for the user
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser) return;
        const favoritesResponse = await fetch(
          API_URL + "/favoriteActivities/" + currentUser.id
        );
        const favoriteActivityIds = await favoritesResponse.json();
        const favoriteActivitiesObj = {};
        favoriteActivityIds.forEach(id => {
          favoriteActivitiesObj[id] = true;
        });
        setFavoriteActivities(favoriteActivitiesObj);
      } catch (error) {
        setFavoriteActivities({});
      }
    };
    fetchFavorites();
  }, [API_URL]);

  useEffect(() => {
    let allActivities = selectedDestinations.flatMap(
      (destination) => destination.activities
    );
    allActivities = [...allActivities].sort(() => Math.random() - 0.5);
    setAllActivities(allActivities);
    setSelectedActivities((prev) =>
      prev.filter((activity) =>
        allActivities.some((a) => a.id === activity.id)
      )
    );
  }, [selectedDestinations]);

  useEffect(() => {
    onSelectedActivitiesChange(selectedActivities);
  }, [selectedActivities]);

  // Fetch reviews and calculate ratings/counts
  const fetchReviews = async () => {
    try {
      const res = await fetch(API_URL + "/activityReviews");
      const reviews = await res.json();
      setAllReviews(reviews);

      const ratingsMap = {};
      const countsMap = {};
      reviews.forEach((review) => {
        if (!ratingsMap[review.activityId]) {
          ratingsMap[review.activityId] = { sum: 0, count: 0 };
        }
        ratingsMap[review.activityId].sum += review.stars;
        ratingsMap[review.activityId].count += 1;
      });
      Object.keys(ratingsMap).forEach((activityId) => {
        countsMap[activityId] = ratingsMap[activityId].count;
      });
      const avgRatings = {};
      Object.keys(ratingsMap).forEach((activityId) => {
        avgRatings[activityId] = ratingsMap[activityId].sum / ratingsMap[activityId].count;
      });
      setActivityRatings(avgRatings);
      setActivityReviewCounts(countsMap);
    } catch (err) {
      setActivityRatings({});
      setActivityReviewCounts({});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [API_URL]);

  const toggleActivitySelection = (activity) => {
    setSelectedActivities((prevSelectedActivities) => {
      const isSelected = prevSelectedActivities.includes(activity);
      return isSelected
        ? prevSelectedActivities.filter(
            (selectedActivity) => selectedActivity !== activity
          )
        : [...prevSelectedActivities, activity];
    });
  };

  const filteredActivities = allActivities
    .filter((activity) =>
      selectedCategory === "All"
        ? true
        : activity.category === selectedCategory
    )
    .filter((activity) =>
      selectedDestinationFilter === "All"
        ? true
        : String(activity.destinationId || (activity.destination && activity.destination.id)) === String(selectedDestinationFilter)
    );

  // My Favorites: activities that are in favoriteActivities
  const myFavoriteActivities = filteredActivities.filter(
    (a) => favoriteActivities[a.id]
  );

  // Best reviewed: top 5 by average rating, then by review count if ratings are equal
  const bestReviewedActivities = [...filteredActivities]
    .sort((a, b) => {
      const ratingA = activityRatings[a.id] || 0;
      const ratingB = activityRatings[b.id] || 0;
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }
      // If ratings are equal, compare by review count
      const countA = activityReviewCounts[a.id] || 0;
      const countB = activityReviewCounts[b.id] || 0;
      return countB - countA;
    })
    .slice(0, 5);

  // Most popular: top 5 by review count, then by average rating if counts are equal
  const mostPopularActivities = [...filteredActivities]
    .sort((a, b) => {
      const countA = activityReviewCounts[a.id] || 0;
      const countB = activityReviewCounts[b.id] || 0;
      if (countB !== countA) {
        return countB - countA;
      }
      // If review counts are equal, compare by average rating
      const ratingA = activityRatings[a.id] || 0;
      const ratingB = activityRatings[b.id] || 0;
      return ratingB - ratingA;
    })
    .slice(0, 5);

  // Remove best reviewed, most popular, and favorites from the rest to avoid duplicates
  const bestReviewedIds = new Set(bestReviewedActivities.map(a => a.id));
  const mostPopularIds = new Set(mostPopularActivities.map(a => a.id));
  const myFavoriteIds = new Set(myFavoriteActivities.map(a => a.id));
  const restActivities = filteredActivities.filter(
    a => !bestReviewedIds.has(a.id) && !mostPopularIds.has(a.id) && !myFavoriteIds.has(a.id)
  );

  // Find user review for the modal
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userReviewData = allReviews.find(
    r => r.activityId === reviewActivityId && r.userId === currentUser?.id
  );

  // Submit or update review
  const submitReview = async () => {
    if (!reviewStars) return alert("Please select a star rating.");
    setReviewSubmitting(true);
    try {
      // Check if user already reviewed this activity
      const existingReview = allReviews.find(
        r => r.activityId === reviewActivityId && r.userId === currentUser?.id
      );
      if (existingReview) {
        // Update existing review
        await fetch(`${API_URL}/activityReviews`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            activityId: reviewActivityId,
            stars: reviewStars,
            comment: reviewComment,
          }),
        });
      } else {
        // Create new review
        await fetch(`${API_URL}/activityReviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            activityId: reviewActivityId,
            stars: reviewStars,
            comment: reviewComment,
          }),
        });
      }
      closeReviewModal();
      await fetchReviews();
    } catch (err) {
      alert("Failed to submit review.");
    }
    setReviewSubmitting(false);
  };

  return (
    <div className="content-wrapper content-padding">
      <h1 className="big-green-title">Activities</h1>
      <p className="activity-description-info">
        Select the activities you want to include in your trip. Click on an
        activity to add or remove it from your selection.
      </p>
      <div className="activity-filter-row">
        <label htmlFor="activity-category-filter" style={{ marginRight: "8px" }}>
          Category:
        </label>
        <select
          id="activity-category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ marginRight: "18px" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label htmlFor="activity-destination-filter" style={{ marginRight: "8px" }}>
          Destination:
        </label>
        <select
          id="activity-destination-filter"
          value={selectedDestinationFilter}
          onChange={(e) => setSelectedDestinationFilter(e.target.value)}
        >
          <option value="All">All</option>
          {selectedDestinations.map((dest) => (
            <option key={dest.id} value={dest.id}>
              {dest.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="loading-container">
          <span className="spinner" />
        </div>
      ) : (
        <>
          <div>
            <h2 style={{ color: "#1976d2", marginBottom: "8px" }}>
              My Favorites <span role="img" aria-label="heart">❤️</span>
            </h2>
            <ActivityList
              activities={myFavoriteActivities}
              destinations={selectedDestinations}
              activityRatings={activityRatings}
              activityReviewCounts={activityReviewCounts}
              showFavorite={false}
              showYoutube={true}
              showRatingRow={true}
              showCreatedBy={false}
              onActivityClick={toggleActivitySelection}
              selectedActivities={selectedActivities}
              handleStarClick={openReviewModal}
              allReviews={allReviews}
            />
          </div>
          <div>
            <h2 style={{ color: "#1976d2", marginBottom: "8px" }}>
              Best Reviewed <span role="img" aria-label="star">⭐</span>
            </h2>
            <ActivityList
              activities={bestReviewedActivities}
              destinations={selectedDestinations}
              activityRatings={activityRatings}
              activityReviewCounts={activityReviewCounts}
              showFavorite={false}
              showYoutube={true}
              showRatingRow={true}
              showCreatedBy={false}
              onActivityClick={toggleActivitySelection}
              selectedActivities={selectedActivities}
              handleStarClick={openReviewModal}
              allReviews={allReviews}
            />
          </div>
          <div>
            <h2 style={{ color: "#1976d2", margin: "24px 0 8px 0" }}>
              Most Popular <span role="img" aria-label="fire">🔥</span>
            </h2>
            <ActivityList
              activities={mostPopularActivities}
              destinations={selectedDestinations}
              activityRatings={activityRatings}
              activityReviewCounts={activityReviewCounts}
              showFavorite={false}
              showYoutube={true}
              showRatingRow={true}
              showCreatedBy={false}
              onActivityClick={toggleActivitySelection}
              selectedActivities={selectedActivities}
              handleStarClick={openReviewModal}
              allReviews={allReviews}
            />
          </div>
          <div>
            <h2 style={{ color: "#1976d2", margin: "24px 0 8px 0" }}>All Activities</h2>
            <ActivityList
              activities={restActivities}
              destinations={selectedDestinations}
              activityRatings={activityRatings}
              activityReviewCounts={activityReviewCounts}
              showFavorite={false}
              showYoutube={true}
              showRatingRow={true}
              showCreatedBy={false}
              onActivityClick={toggleActivitySelection}
              selectedActivities={selectedActivities}
              handleStarClick={openReviewModal}
              allReviews={allReviews}
            />
          </div>
        </>
      )}
      <ReviewModal
        open={reviewModalOpen}
        stars={reviewStars}
        setStars={setReviewStars}
        comment={reviewComment}
        setComment={setReviewComment}
        submitting={reviewSubmitting}
        onSubmit={submitReview}
        onCancel={closeReviewModal}
        userReviewData={userReviewData}
      />
      <div className="button-row">
        <button onClick={onBack} className="back-btn">
          Back
        </button>
        <button
          onClick={onNext}
          className="next-btn"
          disabled={selectedActivities.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivitySelector;
