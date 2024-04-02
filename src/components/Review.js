import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from '../services/AuthService';
import  '../styles/RoadTrip.css';




const Review = () => {
    // user
    const currentUser = AuthService.getCurrentUser();
    // const currentUserId = currentUser.id;
    const currentUserId = 1;


    // db data
    const [destinations, setDestinations] = useState([]);
    const [activities, setActivities] = useState([]);
    const [reviews, setReviews] = useState([]);

    // review selected
    const [selected, setSelected] = useState([]);
    const [destinationSelected, setDestinationSelected] = useState([]);
    const [activitySelected, setActivitySelected] = useState([]);
    const [stars, setStars] = useState(10);
    const [comment, setComment] = useState('');
    const [review, setReview] = useState([]);

    const selectedType = 1;
    const selectedId = 1;


    // TODO: get destinations and activities from the startup load
    useEffect(() => {
        // fetchDestinations();
        // fetchActivities();
        // fetchReviews();
    }, []);



    const handleReviewChange = (e) => {
        setStars(parseInt(e.target.value));
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //body: JSON.stringify({ currentUserId, selectedType, selectedId, stars, comment }),
                body: JSON.stringify({ currentUserId, selectedType, selectedId, stars, comment }),
            });
            // Reset form fields after successful submission
            setReview(5);
            setComment('');
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again later.');
        }
    };



    return (
        <form className="review-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="review">Rating:</label>
            <select id="review" value={review} onChange={handleReviewChange}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              rows={4}
              cols={50}
            />
          </div>
          <button type="submit">Submit Review</button>
        </form>
      );
    };

export default Review;