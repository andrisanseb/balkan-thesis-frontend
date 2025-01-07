import {Link, NavLink} from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/Nav.css';

export const NavBar = () => {
    const currentUser = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
    };

    return (
        <nav>
            <div className="navbar-container">
                <div className="navbar-left">
                    <NavLink to="/">HOME</NavLink>
                    {/* <NavLink to="/explore/destinations">DESTINATIONS</NavLink> */}
                    <div className="dropdown">
                        <NavLink to="/explore/destinations">DESTINATIONS</NavLink>
                        {/* Popularity - Reviews together in /destinations link*/}
                        <div className="dropdown-content">
                            <Link to="/explore/popular">Popular</Link>
                            <Link to="/reviews">Reviews</Link>
                        </div>
                    </div>
                    <NavLink to="/experiences">EXPERIENCES</NavLink>
                    <NavLink to="/roadTrip">ROAD TRIP</NavLink>
                </div>
                <div className="navbar-right">
                    {currentUser ? (
                        <div className="user-info">
                            <Link className="username" to="/my-profile">{currentUser.username.toUpperCase()}</Link>
                            <Link onClick={handleLogout} to="/">LOGOUT</Link>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login">LOGIN</Link>
                            <Link to="/register">REGISTER</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};