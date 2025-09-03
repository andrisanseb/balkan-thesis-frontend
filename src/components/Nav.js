import { Link, NavLink } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/Nav.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSignOutAlt, FaBars } from "react-icons/fa";

export const NavBar = () => {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
        window.location.reload();
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 900 && menuOpen) {
                setMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [menuOpen]);

    return (
        <nav>
            <div className="nav-new-container">
                <div className="nav-row">
                    <div className="nav-brand">
                        <Link to="/">BalkanTrip</Link>
                    </div>
                    <div className="nav-center">
                        <div className="nav-links-desktop">
                            <NavLink to="/experiences">EXPLORE</NavLink>
                            <NavLink to="/roadTrip">PLAN ROADTRIP</NavLink>
                            <NavLink to="/my-roadtrips">MY ROADTRIPS</NavLink>
                            <NavLink to="/activity-controller">ACTIVITIES</NavLink>
                        </div>
                    </div>
                    <div className="nav-profile">
                        {currentUser ? (
                            <>
                                <span className="nav-username" style={{ cursor: "default" }}>
                                    {currentUser.username.toUpperCase()}
                                </span>
                                <button className="nav-logout-btn" onClick={handleLogout} title="Logout">
                                    <FaSignOutAlt />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">LOGIN</Link>
                                <Link to="/register">REGISTER</Link>
                            </>
                        )}
                    </div>
                    <button
                        className="nav-hamburger"
                        aria-label="Toggle navigation"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <FaBars />
                    </button>
                </div>
                {menuOpen && (
                    <div className="nav-mobile-menu">
                        <NavLink to="/experiences" onClick={() => setMenuOpen(false)}>EXPLORE</NavLink>
                        <NavLink to="/roadTrip" onClick={() => setMenuOpen(false)}>PLAN ROADTRIP</NavLink>
                        <NavLink to="/my-roadtrips" onClick={() => setMenuOpen(false)}>MY ROADTRIPS</NavLink>
                        <NavLink to="/activity-controller" onClick={() => setMenuOpen(false)}>ACTIVITIES</NavLink>
                        {currentUser ? (
                            <>
                                <span className="nav-username" style={{ cursor: "default" }}>
                                    {currentUser.username.toUpperCase()}
                                </span>
                                <button className="nav-logout-btn" onClick={() => { setMenuOpen(false); handleLogout(); }} title="Logout">
                                    <FaSignOutAlt />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMenuOpen(false)}>LOGIN</Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)}>REGISTER</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};