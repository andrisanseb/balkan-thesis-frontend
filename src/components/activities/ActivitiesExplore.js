import React, { useState, useEffect, useRef } from "react";
import "../../styles/ActivitiesExplore.css";
import { FaSpinner, FaStar } from "react-icons/fa";
import AuthService from "../../services/AuthService";
import ActivityList from "./ActivityList";

const ActivitiesExplore = ({ destinations }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activities, setActivities] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [categoryInfo, setCategoryInfo] = useState("");
  const [funFact, setFunFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [favoriteActivities, setFavoriteActivities] = useState({});
  const [visibleCount, setVisibleCount] = useState(12);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewActivityId, setReviewActivityId] = useState(null);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [activityRatings, setActivityRatings] = useState({});
  const [activityReviewCounts, setActivityReviewCounts] = useState({});
  const [userReviews, setUserReviews] = useState({});
  const [userReviewData, setUserReviewData] = useState({});
  const [sortType, setSortType] = useState("random");
  const [allReviews, setAllReviews] = useState([]);
  const [reviewSlideIndexes, setReviewSlideIndexes] = useState({});
  const reviewSlideIntervalRef = useRef({});
  const currentUser = AuthService.getCurrentUser();
  const [selectedCountry, setSelectedCountry] = useState("All");

  // Get activities from destinations prop (cached)
  useEffect(() => {
    if (destinations && destinations.length > 0) {
      let allActivities = destinations.flatMap(
        (destination) => destination.activities || []
      );
      // Shuffle activities randomly
      allActivities = allActivities.sort(() => Math.random() - 0.5);
      setActivities(allActivities);
      setLoading(false);
    } else {
      setActivities([]);
      setLoading(false);
    }
  }, [destinations]);

  // Fetch all reviews and calculate average ratings and counts
  const fetchReviews = async () => {
    try {
      const res = await fetch(API_URL + "/activityReviews");
      const reviews = await res.json();
      setAllReviews(reviews);

      const ratingsMap = {};
      const countsMap = {};
      const userReviewMap = {};
      const userReviewDataMap = {};
      reviews.forEach((review) => {
        if (!ratingsMap[review.activityId]) {
          ratingsMap[review.activityId] = { sum: 0, count: 0 };
        }
        ratingsMap[review.activityId].sum += review.stars;
        ratingsMap[review.activityId].count += 1;
        if (review.userId === currentUser.id) {
          userReviewMap[review.activityId] = true;
          userReviewDataMap[review.activityId] = {
            stars: review.stars,
            comment: review.comment,
            id: review.id
          };
        }
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
      setUserReviews(userReviewMap);
      setUserReviewData(userReviewDataMap);
    } catch (err) {
      setActivityRatings({});
      setActivityReviewCounts({});
      setUserReviews({});
      setUserReviewData({});
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [API_URL, currentUser.id]);

  // Fetch favorite activities for the user (keep this call)
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesResponse = await fetch(
          API_URL + "/favoriteActivities/" + currentUser.id
        );
        const favoriteActivityIds = await favoritesResponse.json();
        const favoriteActivitiesObj = activities.reduce((acc, activity) => {
          if (favoriteActivityIds.includes(activity.id)) {
            acc[activity.id] = true;
          }
          return acc;
        }, {});
        setFavoriteActivities(favoriteActivitiesObj);
      } catch (error) {
        console.error("Error fetching favorite activities:", error);
      }
    };
    if (activities.length > 0) fetchFavorites();
  }, [activities, currentUser.id, API_URL]);

  // Update category info and image based on selected category
  useEffect(() => {
    setVisibleCount(12); // Reset pagination when category changes
    switch (selectedCategory) {
      case "Culture":
        setSelectedImage(process.env.PUBLIC_URL + "/images/category/culture.jpg");
        setCategoryInfo(
          "Explore the rich history and traditions of the Balkans, from ancient ruins to vibrant folk dances."
        );
        setFunFact(
          "Did you know that the Balkans are home to some of the world's oldest continuously inhabited cities?"
        );
        break;
      case "Gastronomy":
        setSelectedImage(process.env.PUBLIC_URL + "/images/category/gastronomy.jpg");
        setCategoryInfo(
          "Indulge in the diverse flavors of Balkan cuisine, where hearty stews and freshly caught seafood await."
        );
        setFunFact(
          "The Balkans are known for their unique dishes such as cevapi, burek, and baklava."
        );
        break;
      case "Nature":
        setSelectedImage(process.env.PUBLIC_URL + "/images/category/nature.jpg");
        setCategoryInfo(
          "Immerse yourself in the breathtaking landscapes of the Balkans, from lush forests to cascading waterfalls."
        );
        setFunFact(
          "The Balkans are home to one of Europe's last remaining rainforests, the Biogradska Gora National Park."
        );
        break;
      case "Religion":
        setSelectedImage(process.env.PUBLIC_URL + "/images/category/religion.jpg");
        setCategoryInfo(
          "Discover the spiritual heritage of the Balkans, where ancient churches and mosques dot the countryside."
        );
        setFunFact(
          "The Balkans have a rich religious history, with influences from Christianity, Islam, and other faiths."
        );
        break;
      default:
        setSelectedImage(
          "https://www.sarahdegheselle.com/wp-content/uploads/2018/10/balkan-campers-88-scaled.jpg"
        );
        setCategoryInfo(
          "Embark on a journey through the Balkans and uncover a world of adventure and discovery."
        );
        setFunFact(
          "The Balkans offer a diverse range of experiences, from historic cities to stunning coastlines."
        );
        break;
    }
  }, [selectedCategory]);

  const changeCategory = (category) => {
    setSelectedCategory(category);
  };

  const renderCategoryButtons = () => {
    const categories = ["All", "Culture", "Gastronomy", "Nature", "Leisure", "Religion"];
    return categories.map((category, index) => (
      <button
        key={index}
        className={`category-button${selectedCategory === category ? " active-button" : ""}`}
        onClick={() => changeCategory(category)}
      >
        {category}
      </button>
    ));
  };

  // Add sort buttons after category buttons
  const renderSortButtons = () => (
    <div className="sort-menu">
      <button
        className={`sort-button ${sortType === "random" ? "active-sort" : ""}`}
        onClick={() => setSortType("random")}
      >
        Random <span role="img" aria-label="dice">🎲</span>
      </button>
      <button
        className={`sort-button ${sortType === "favorites" ? "active-sort" : ""}`}
        onClick={() => setSortType("favorites")}
      >
        Favorites <span role="img" aria-label="heart">❤️</span>
      </button>
      <button
        className={`sort-button ${sortType === "popular" ? "active-sort" : ""}`}
        onClick={() => setSortType("popular")}
      >
        Most Popular <span role="img" aria-label="fire">🔥</span>
      </button>
      <button
        className={`sort-button ${sortType === "best" ? "active-sort" : ""}`}
        onClick={() => setSortType("best")}
      >
        Best Reviewed <span role="img" aria-label="star">⭐</span>
      </button>
      <button
        className={`sort-button ${sortType === "cheapest" ? "active-sort" : ""}`}
        onClick={() => setSortType("cheapest")}
      >
        Cheapest <span role="img" aria-label="money">💸</span>
      </button>
      <button
        className={`sort-button ${sortType === "guide" ? "active-sort" : ""}`}
        onClick={() => setSortType("guide")}
      >
        User Suggestions <span role="img" aria-label="guide">🧑‍🏫</span>
      </button>
    </div>
  );

  // Get all unique countries from destinations
  const countryList = [
    ...new Set(
      destinations
        .map(dest => dest.country?.name)
        .filter(Boolean)
    ),
  ];

  // Helper to get flag image path
  const getFlagImg = (countryName) =>
    process.env.PUBLIC_URL +
    "/images/country/flags/" +
    (countryName ? countryName.slice(0, 3).toLowerCase() : "default") +
    ".png";

  // Country flag selector row
  const renderCountryFlags = () => (
    <div className="country-flags-row">
      <button
        className={`country-flag-btn${selectedCountry === "All" ? " active-country" : ""}`}
        onClick={() => setSelectedCountry("All")}
        title="All countries"
      >
        🌍
      </button>
      {countryList.map((country) => (
        <button
          key={country}
          className={`country-flag-btn${selectedCountry === country ? " active-country" : ""}`}
          onClick={() => setSelectedCountry(country)}
          title={country}
        >
          <img
            src={getFlagImg(country)}
            alt={country + " flag"}
            className="country-flag-img"
          />
        </button>
      ))}
    </div>
  );

  // Filter activities by selected country
  let filteredActivities = activities;
  if (selectedCountry !== "All") {
    filteredActivities = filteredActivities.filter((activity) => {
      const destId = activity.destinationId || (activity.destination && activity.destination.id);
      const destination = destinations.find((d) => d.id === destId);
      return destination && destination.country && destination.country.name === selectedCountry;
    });
  }
  if (selectedCategory && selectedCategory !== "All") {
    filteredActivities = filteredActivities.filter(
      (activity) => activity.category === selectedCategory
    );
  }

  // Sort logic
  let sortedActivities = [...filteredActivities];
  if (sortType === "favorites") {
    sortedActivities = sortedActivities.filter(
      (activity) => favoriteActivities[activity.id]
    );
  } else if (sortType === "popular") {
    sortedActivities.sort((a, b) =>
      (activityReviewCounts[b.id] || 0) - (activityReviewCounts[a.id] || 0)
    );
  } else if (sortType === "best") {
    sortedActivities.sort((a, b) =>
      (activityRatings[b.id] || 0) - (activityRatings[a.id] || 0)
    );
  } else if (sortType === "cheapest") {
    sortedActivities.sort((a, b) =>
      (a.cost ?? Infinity) - (b.cost ?? Infinity)
    );
  } else if (sortType === "guide") {
    sortedActivities = sortedActivities.filter(
      (activity) => activity.createdByUserId != null
    );
  }
  // else random/default: already shuffled on load

  // Pagination logic
  const displayedActivities = sortedActivities.slice(0, visibleCount);
  const hasMore = visibleCount < sortedActivities.length;

  const toggleFavorite = async (activityId) => {
    try {
      if (favoriteActivities[activityId]) {
        await fetch(API_URL + "/favoriteActivities", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            activityId: activityId,
          }),
        });
      } else {
        await fetch(API_URL + "/favoriteActivities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            activityId: activityId,
          }),
        });
      }
      setFavoriteActivities((prevFavoriteActivities) => ({
        ...prevFavoriteActivities,
        [activityId]: !prevFavoriteActivities[activityId],
      }));
    } catch (error) {
      console.error("Error toggling favorite activity:", error);
    }
  };

  // Open review modal, prefill if user has reviewed
  const handleStarClick = (activityId) => {
    if (userReviews[activityId] && userReviewData[activityId]) {
      setReviewStars(userReviewData[activityId].stars);
      setReviewComment(userReviewData[activityId].comment || "");
    } else {
      setReviewStars(0);
      setReviewComment("");
    }
    setReviewActivityId(activityId);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setReviewActivityId(null);
    setReviewStars(0);
    setReviewComment("");
  };

  // Submit or update review
  const submitReview = async () => {
    if (!reviewStars) return alert("Please select a star rating.");
    setReviewSubmitting(true);
    try {
      if (userReviews[reviewActivityId] && userReviewData[reviewActivityId]) {
        // Update existing review
        await fetch(`${process.env.REACT_APP_API_URL}/activityReviews`, {
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
        await fetch(process.env.REACT_APP_API_URL + "/activityReviews", {
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

  useEffect(() => {
    Object.values(reviewSlideIntervalRef.current).forEach(clearInterval);
    reviewSlideIntervalRef.current = {};

    displayedActivities.forEach((activity) => {
      const reviews = allReviews.filter(r => r.activityId === activity.id);
      if (reviews.length > 1) {
        setReviewSlideIndexes(prev => {
          if (prev[activity.id] === undefined) {
            return { ...prev, [activity.id]: 0 };
          }
          return prev;
        });
        reviewSlideIntervalRef.current[activity.id] = setInterval(() => {
          setReviewSlideIndexes(prev => {
            const current = prev[activity.id] || 0;
            const next = (current + 1) % reviews.length;
            return { ...prev, [activity.id]: next };
          });
        }, 5000);
      }
    });

    return () => {
      Object.values(reviewSlideIntervalRef.current).forEach(clearInterval);
    };
  }, [displayedActivities, allReviews]);

  return (
    <div className="content-wrapper content-padding">
      <div className="image-container">
        <img src={selectedImage} alt="Selected Category img" className="category-image" />
        <div className="category-info">
          <p>{categoryInfo}</p>
          <p>{funFact}</p>
        </div>
      </div>
      {renderCountryFlags()}
      <div className="category-menu">{renderCategoryButtons()}</div>
      {renderSortButtons()}
      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="no-activities-message">
          No activities found in this category.
        </div>
      ) : (
        <>
          <ActivityList
            activities={displayedActivities}
            destinations={destinations}
            favoriteActivities={favoriteActivities}
            onFavoriteToggle={toggleFavorite}
            activityRatings={activityRatings}
            activityReviewCounts={activityReviewCounts}
            userReviews={userReviews}
            allReviews={allReviews}
            reviewSlideIndexes={reviewSlideIndexes}
            handleStarClick={handleStarClick}
            showReviewRow={true}
            showFavorite={true}
            showYoutube={true}
            showCreatedBy={true}
          />
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "18px" }}>
              <button
                className="show-more-btn"
                onClick={() => setVisibleCount((prev) => prev + 12)}
              >
                Show more
              </button>
            </div>
          )}
        </>
      )}
      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <h3>Review Activity</h3>
            <div className="review-stars">
              {[1,2,3,4,5].map((star) => (
                <FaStar
                  key={star}
                  className={`review-star ${reviewStars >= star ? "selected" : ""}`}
                  onClick={() => setReviewStars(star)}
                />
              ))}
            </div>
            <textarea
              className="review-comment"
              placeholder="Add a comment (optional)"
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              rows={3}
            />
            {userReviews[reviewActivityId] && userReviewData[reviewActivityId] && (
              <div className="your-review-info" style={{ marginBottom: 8, color: "#1976d2", fontSize: "0.95em" }}>
                <span>
                  Current review: {userReviewData[reviewActivityId].stars}★
                  {userReviewData[reviewActivityId].comment ? ` — "${userReviewData[reviewActivityId].comment}"` : ""}
                </span>
              </div>
            )}
            <div className="review-modal-actions">
              <button
                className="review-submit-btn"
                onClick={submitReview}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button className="review-cancel-btn" onClick={closeReviewModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesExplore;
