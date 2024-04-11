import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from '../../services/AuthService';
import '../../styles/ActivitiesExplore.css';


const ActivitiesExplore = () => {

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activities, setActivities] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        return () => {
            // fetchActivities();
            // fetchReviews()
        };
    },);


    const fetchActivities = async () => {
        try {
            const response = await fetch('http://localhost:4000/activities');
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    // TODO: 
    // backend endpoint
    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:4000/reviews');
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };


    useEffect(() => {
        console.log("Selected category changed:", selectedCategory);
        switch (selectedCategory) {
            case 1: setSelectedImage(process.env.PUBLIC_URL +'/airplane.jpg'); break;
            case 2: setSelectedImage('https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg'); break;
            case 3: setSelectedImage(process.env.PUBLIC_URL +'/airplane.jpg'); break;
            case 4: setSelectedImage(process.env.PUBLIC_URL +'/airplane.jpg'); break;
            case 5: setSelectedImage(process.env.PUBLIC_URL +'/airplane.jpg'); break;
            default: setSelectedImage('https://www.sarahdegheselle.com/wp-content/uploads/2018/10/balkan-campers-88-scaled.jpg'); break;
        }
    }, [selectedCategory]); // Run this effect whenever selectedCategory changes

    
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
        category = category.toLowerCase();
        switch (category) {
            case 'culture': setSelectedCategory(1); break;
            case 'gastronomy': setSelectedCategory(2); break;;
            case 'nature': setSelectedCategory(3); break;;
            case 'leisure': setSelectedCategory(4); break;;
            case 'religion': setSelectedCategory(5); break;;
            default: setSelectedCategory(null);
        }
    };


    const renderCategoryButtons = () => {
        const categories = ['All', 'Culture', 'Gastronomy', 'Nature', 'Leisure', 'Religion'];
        return categories.map((category, index) => (
            <button
                key={index}
                className={`category-button ${selectedCategory === index  ? 'active' : ''}`}
                onClick={() => changeCategory(category)}
            >
                {category}
            </button>
        ));
    };

    const filteredActivities = selectedCategory ? activities.filter(activity => activity.category_id === selectedCategory) : activities;

    // TODO: 
    // uncomment when categories are added to db
    // add destination name and country in the activity box
    return (
        <div className="experiences-section">
            <div className='content-section'>
                <h2 className='title'>Explore</h2>
                <div className="image-container">
                    <img src={selectedImage} alt="Selected Category Image" className="category-image" />
                </div>
                <div className="category-menu">
                    {renderCategoryButtons()}
                </div>
                {/* <div className='cards'>
                    {filteredActivities.map(activity => (
                        <div key={activity.id} className='card'>
                            <div className='card-content'>
                                <p className='activity-name'>{activity.name}</p>
                                <p className='activity-description'>{activity.description}</p>
                                <div className="star-rating">{renderStars(calculateStarRating(activity))}</div>
                            </div>
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    );
};
export default ActivitiesExplore;