import React, { useState, useEffect } from "react";
import "../../styles/ActivitiesExplore.css";
import { FaSpinner, FaHeart, FaRegHeart } from "react-icons/fa";
import AuthService from "../../services/AuthService";

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
  const currentUser = AuthService.getCurrentUser();

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
        className={`category-button ${selectedCategory === category ? "active-button" : ""}`}
        onClick={() => changeCategory(category)}
      >
        {category}
      </button>
    ));
  };

  let filteredActivities = activities;
  if (selectedCategory && selectedCategory !== "All") {
    filteredActivities = activities.filter(
      (activity) => activity.category === selectedCategory
    );
  }

  // Pagination logic
  const displayedActivities = filteredActivities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredActivities.length;

  const toggleFavorite = async (activityId) => {
    try {
      // If the activity is currently favorite, remove it from favorites
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
        // If the activity is not currently favorite, add it to favorites
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

      // Update the local state to reflect the change in favorite status
      setFavoriteActivities((prevFavoriteActivities) => ({
        ...prevFavoriteActivities,
        [activityId]: !prevFavoriteActivities[activityId],
      }));
    } catch (error) {
      console.error("Error toggling favorite activity:", error);
    }
  };

  const getDestinationInfo = (activity) => {
    // Find the destination for this activity
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
    <div className="activities-explore-root content-wrapper">
        <div className="image-container">
          <img src={selectedImage} alt="Selected Category img" className="category-image" />
          <div className="category-info">
            <p>{categoryInfo}</p>
            <p>{funFact}</p>
          </div>
        </div>
        <div className="category-menu">{renderCategoryButtons()}</div>
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
            <div className="cards">
              {displayedActivities.map((activity) => {
                const destInfo = getDestinationInfo(activity);
                return (
                  <div key={activity.id} className="activity-card">
                    <div className="activity-card-content">
                      <div className="activity-dest-info">
                        {destInfo && (
                          <>
                            <img
                              src={destInfo.flag}
                              alt="country_flag"
                              className="activity-country-flag"
                              style={{ width: 22, height: 22, borderRadius: "50%", marginRight: 6, verticalAlign: "middle" }}
                            />
                            <span className="activity-dest-name">{destInfo.name}</span>
                          </>
                        )}
                      </div>
                      <p className="activity-name">{activity.name}</p>
                      <p className="activity-description">{activity.description}</p>
                      <div className="activity-details"></div>
                    </div>
                    {favoriteActivities[activity.id] ? (
                      <FaHeart
                        className="heart-icon liked"
                        onClick={() => toggleFavorite(activity.id)}
                      />
                    ) : (
                      <FaRegHeart
                        className="heart-icon"
                        onClick={() => toggleFavorite(activity.id)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
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
    </div>
  );
};

export default ActivitiesExplore;
