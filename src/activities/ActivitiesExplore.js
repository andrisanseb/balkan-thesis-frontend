import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
// import AuthService from '../../services/AuthService';
// import '../../styles/ActivitiesExplore.css';


const ActivitiesExplore = () => {

    // null(all) - culture - gastronomy - nature - religion - leisure
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        // Clear states when URL changes
        return () => {
            setSelectedCategory(null);
            fetchActivities()
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


    const changeCategory = (category) => {
        category = category.toLowerCase();
        switch (category) {
            case 'culture': setSelectedCategory(1);
            case 'gastronomy': setSelectedCategory(2);
            case 'nature': setSelectedCategory(3);
            case 'leisure': setSelectedCategory(4);
            case 'religion': setSelectedCategory(5);
            default: setSelectedCategory(null);
        }
    };


    const renderCategoryButtons = () => {
        const categories = ['All', 'Culture', 'Gastronomy', 'Nature', 'Leisure', 'Religion'];
        return categories.map((category, index) => (
            <button
                key={index}
                className={`category-button ${selectedCategory === index + 1 ? 'active' : ''}`}
                onClick={() => changeCategory(category)}
            >
                {category}
            </button>
        ));
    };



    // TODO: uncomment when categories are added to db
    return (
        <div className="destinations-section">
            <div className='content-section'>
                <h2 className='title'>Explore</h2>
                <div className="category-menu">
                    {renderCategoryButtons()}
                </div>
                <div className='cards'>
                    {/* {activities
                        .filter(activity => selectedCategory == null || activity.category_id == selectedCategory)
                        .map(activity => (
                            <div key={activity.id} className='card'>
                                <div className='card-content'>
                                    <p className='activity-name'>{activity.name}</p>
                                    <p className='activity-description'>{activity.description}</p>
                                </div>
                            </div>
                        ))} */}

                </div>
            </div>
        </div>
    );
};
export default ActivitiesExplore;