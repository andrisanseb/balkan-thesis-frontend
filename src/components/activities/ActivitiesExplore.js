import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/ActivitiesExplore.css";
import { FaSpinner, FaHeart, FaRegHeart } from "react-icons/fa";
import AuthService from "../../services/AuthService";


//TODO: fix, dto may have changed, Id is broken
const ActivitiesExplore = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activities, setActivities] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [categoryInfo, setCategoryInfo] = useState("");
  const [funFact, setFunFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [favoriteActivities, setFavoriteActivities] = useState({});
  const currentUser = AuthService.getCurrentUser();

  const fetchActivitiesAndFavorites = async () => {
    try {
      // Fetch activities
      const activitiesResponse = await fetch(
         API_URL+"/activities"
      );
      const activitiesData = await activitiesResponse.json();

      setActivities(activitiesData.data); // because of DTO

      // Fetch favorite activities for the user
      const favoritesResponse = await fetch(
        API_URL+"/favoriteActivities/${currentUser.id}"
      );
      const favoriteActivityIds = await favoritesResponse.json();

      // Map through activities to find those that match the favorite activity IDs
      const favoriteActivities = activitiesData.data.reduce((acc, activity) => {
        if (favoriteActivityIds.includes(activity.id)) {
          acc[activity.id] = true;
        }
        return acc;
      }, {});

      setFavoriteActivities(favoriteActivities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities or favorite activities:", error);
    }
  };

  useEffect(() => {
    fetchActivitiesAndFavorites();
  }, []);

  useEffect(() => {
    switch (selectedCategory) {
      case "Culture":
        setSelectedImage(
          process.env.PUBLIC_URL + "/images/category/culture.jpg"
        );
        setCategoryInfo(
          "Explore the rich history and traditions of the Balkans, from ancient ruins to vibrant folk dances."
        );
        setFunFact(
          "Did you know that the Balkans are home to some of the world's oldest continuously inhabited cities?"
        );
        break;
      case "Gastronomy":
        setSelectedImage(
          process.env.PUBLIC_URL + "/images/category/gastronomy.jpg"
        );
        setCategoryInfo(
          "Indulge in the diverse flavors of Balkan cuisine, where hearty stews and freshly caught seafood await."
        );
        setFunFact(
          "The Balkans are known for their unique dishes such as cevapi, burek, and baklava."
        );
        break;
      case "Nature":
        setSelectedImage(
          process.env.PUBLIC_URL + "/images/category/nature.jpg"
        );
        setCategoryInfo(
          "Immerse yourself in the breathtaking landscapes of the Balkans, from lush forests to cascading waterfalls."
        );
        setFunFact(
          "The Balkans are home to one of Europe's last remaining rainforests, the Biogradska Gora National Park."
        );
        break;
      case "Religion":
        setSelectedImage(
          process.env.PUBLIC_URL + "/images/category/religion.jpg"
        );
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
    const categories = [
      "All",
      "Culture",
      "Gastronomy",
      "Nature",
      "Leisure",
      "Religion",
    ];
    return categories.map((category, index) => (
      <button
        key={index}
        className={`category-button ${
          selectedCategory === category ? "active-button" : ""
        }`}
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

  const toggleFavorite = async (activityId) => {
    try {
      // If the activity is currently favorite, remove it from favorites
      if (favoriteActivities[activityId]) {
        await fetch(API_URL+"/favoriteActivities", {
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
        await fetch(API_URL+"favoriteActivities", {
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

  return (
    <div className="experiences-section">
      <div className="content-section">
        <div className="image-container">
          <img
            src={selectedImage}
            alt="Selected Category img"
            className="category-image"
          />
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
        ) : (
          <div className="cards">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="card">
                <div className="card-content">
                  <p className="activity-name">{activity.name}</p>
                  <p className="activity-description">{activity.description}</p>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ActivitiesExplore;
