import AuthService from "../../services/AuthService";
import React, {useEffect, useState} from "react";
// import '../../styles/MyProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

export const Profile = () => {
    const currentUser = AuthService.getCurrentUser();
    const [user, setUser] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:4000/users/${currentUser.id}`);
            const data = await response.json();
            setUser(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', imageFile);

        try {
            const response = await fetch(`http://localhost:4000/users/${currentUser.id}`, {
                method: 'PUT',

                body: formData,
            });
            if (response.ok) {
                console.log('User updated successfully');
                setIsUpdating(false);
            } else {
                console.log('User update failed');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    const openModal = () => {
        setIsUpdating(true);
    }

    const closeModal = () => {
        setIsUpdating(false);
    }

 return (
     <div className="profile-container">
             <div className="profile-picture-container">
                 {user.imageData === null ? (
                     <img
                         className={"profile-picture"}
                         src={"https://static.vecteezy.com/system/resources/previews/002/534/006/non_2x/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"}
                         alt={"User photo"}/>
                    ) : (
                 <img
                     className="profile-picture"
                     src={`data:image/*;base64,${user.imageData}`}
                     alt="User photo"
                 />)}
                 <div className="edit-icon" onClick={openModal}>
                     <FontAwesomeIcon className="fa-pencil-alt" icon={faPencilAlt} />
                 </div>
             </div>
        <h3 className="profile-username">{currentUser.username.toUpperCase()}</h3>
        <h4 className="email">{currentUser.email}</h4>
         <div>
             {isUpdating && (
                 <div className="modal">
                     <div className="modal-content">
                         <span className="close" onClick={closeModal}>&times;</span>
                         <form onSubmit={handleSubmit}>
                             <label>
                                 Image:
                                 <input type="file" name="image" accept="image/*" required={false}
                                        onChange={(e) => setImageFile(e.target.files[0])}/>
                             </label>
                             <button type="submit">Upload</button>
                         </form>
                     </div>
                 </div>
             )}
         </div>
     </div>
 )}