import {Link, NavLink} from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/Nav.css';
import { useNavigate } from "react-router-dom";


export const NavBar = () => {

    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
        window.location.reload();
    };

    return (
        <nav>
            <div className="navbar-container">
                <div className="navbar-left">
                    <NavLink to="/">HOME</NavLink>
                    <NavLink to="/experiences">EXPLORE</NavLink>
                    <NavLink to="/roadTrip">PLAN ROADTRIP</NavLink>
                    <NavLink to="/my-roadtrips">MY ROADTRIPS</NavLink>
                    <NavLink to="/activity-controller">ACTIVITIES</NavLink>
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