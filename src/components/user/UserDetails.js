import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
// import '../../styles/UserDetails.css'

export default function UsersDetails() {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    // const [friends, setFriends] = useState([]);

    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        fetchUser();
        // fetchFriends();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:8080/users/${id}`);
            const data = await response.json();
            setUser(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    // const fetchFriends = async () => {
    //     try {
    //         const response = await fetch(
    //             `http://localhost:8080/users/${id}/friends`
    //         );
    //         const data = await response.json();
    //         setFriends(data);
    //         console.log(data);
    //     } catch (error) {
    //         console.error("Error fetching friends:", error);
    //     }
    // };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="users-details-container">
            <h2>{user.username.toUpperCase()}</h2>
            <p>{user.email.toUpperCase()}</p>
            {/* <h3>DOGS</h3>
            {currentUser && currentUser.id === Number(id) ? <DogAdd/> : null}
            <ul>
                {user.dogs.map((dog) => (
                    <li key={dog.id}>
                        {dog.image && (
                            <img
                                className="dog-card-image"
                                src={`data:image/*;base64,${dog.image}`}
                                alt="Dog"
                            />
                        )}
                        <Link to={`/dogs/${dog.id}`}>{dog.name.toUpperCase()}</Link>
                    </li>
                ))}
            </ul>
            <h3>Friends</h3>
            <ul>
                {friends.map((friend) => (
                    <li key={friend.id}>
                        <Link to={`/users/${friend.user2.id}`}>
                            {friend.user2.username.toUpperCase()}
                        </Link>
                    </li>
                ))}
            </ul> */}
        </div>
    );
}