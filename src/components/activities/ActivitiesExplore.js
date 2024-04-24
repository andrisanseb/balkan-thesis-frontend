import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "../../styles/ActivitiesExplore.css";

const ActivitiesExplore = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activities, setActivities] = useState([]);
  // const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:4000/activities");
      const data = await response.json();
      setActivities(data.data); // because of DTO
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    switch (selectedCategory) {
      case "Culture":
        setSelectedImage(
          process.env.PUBLIC_URL + "/images/category/culture.jpg"
        );
        break;
      case "Gastronomy":
        setSelectedImage(
          process.env.PUBLIC_URL + "/images/category/gastronomy.jpg"
        );
        break;
      case "Nature":
        setSelectedImage(
          process.env.PUBLIC_URL + "/images/category/nature.jpg"
        );
        break;
      case "Culture":
        setSelectedImage(
          process.env.PUBLIC_URL + "/images/category/culture.jpg"
        );
        break;
      case "Religion":
        setSelectedImage(
          process.env.PUBLIC_URL + "/images/category/religion.jpg"
        );
        break;
      default:
        setSelectedImage(
          "https://www.sarahdegheselle.com/wp-content/uploads/2018/10/balkan-campers-88-scaled.jpg"
        );
        break;
    }
  }, [selectedCategory]); // Run this effect whenever selectedCategory changes

  // TODO:
  // backend endpoint
  // const fetchReviews = async () => {
  //     try {
  //         const response = await fetch('http://localhost:4000/reviews');
  //         const data = await response.json();
  //         setActivities(data);
  //     } catch (error) {
  //         console.error('Error fetching activities:', error);
  //     }
  // };

  // Star - Reviews
  // const calculateStarRating = (activity) => {
  //     const activityReviews = reviews.filter(review => review.activity_id === activity.id);
  //     const starRatings = activityReviewsStars.map(review => review.stars);
  //     starRatings.sort((a, b) => a - b); // Sort the ratings in ascending order
  //     const sum = starRatings.reduce((total, current) => total + current, 0);
  //     const average = sum / starRatings.length;
  //     return average || 0;
  // };

  // const renderStars = (rating) => {
  //     const fullStars = Math.floor(rating);
  //     const halfStar = rating % 1 !== 0;
  //     const emptyStars = 10 - fullStars - (halfStar ? 1 : 0);

  //     const starElements = [];

  //     for (let i = 0; i < fullStars; i++) {
  //         starElements.push(<span key={i} className="star full-star"></span>);
  //     }

  //     if (halfStar) {
  //         starElements.push(<span key="half" className="star half-star"></span>);
  //     }

  //     for (let i = 0; i < emptyStars; i++) {
  //         starElements.push(<span key={i} className="star empty-star"></span>);
  //     }

  //     return starElements;
  // };

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

  return (
    <div className="experiences-section">
      <div className="content-section">
        <div className="image-container">
          <img
            src={selectedImage}
            alt="Selected Category Image"
            className="category-image"
          />
        </div>
        <div className="category-menu">{renderCategoryButtons()}</div>
        <div className="cards">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="card">
              <div className="card-content">
                <p className="activity-name">{activity.name}</p>
                <p className="activity-description">{activity.description}</p>
                {/* <div className="star-rating">{renderStars(calculateStarRating(activity))}</div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ActivitiesExplore;
