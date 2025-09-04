import { Link, NavLink } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/Nav.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSignOutAlt, FaBars, FaKey, FaUserPlus } from "react-icons/fa"; // Add icons

export const NavBar = () => {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 880);

    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
        window.location.reload();
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 880);
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
                    {currentUser && !isMobile && (
                        <div className="nav-center">
                            <div className="nav-links-desktop">
                                <NavLink to="/experiences">EXPLORE</NavLink>
                                <NavLink to="/roadTrip">PLAN ROADTRIP</NavLink>
                                <NavLink to="/my-roadtrips">MY ROADTRIPS</NavLink>
                                <NavLink to="/activity-controller">ACTIVITIES</NavLink>
                            </div>
                        </div>
                    )}
                    <div className="nav-profile" style={{ marginLeft: "auto" }}>
                        {!currentUser && (
                            <>
                                <Link to="/login" title="Login" className="nav-icon-link">
                                    <FaKey style={{ marginRight: 6 }} />
                                </Link>
                                <Link to="/register" title="Register" className="nav-icon-link">
                                    <FaUserPlus style={{ marginRight: 6 }} />
                                </Link>
                            </>
                        )}
                        {currentUser && !isMobile && (
                            <>
                                <span className="nav-username" style={{ cursor: "default" }}>
                                    {currentUser.username.toUpperCase()}
                                </span>
                                <button className="nav-logout-btn" onClick={handleLogout} title="Logout">
                                    <FaSignOutAlt />
                                </button>
                            </>
                        )}
                    </div>
                    {currentUser && isMobile && (
                        <button
                            className="nav-hamburger"
                            aria-label="Toggle navigation"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FaBars />
                        </button>
                    )}
                </div>
                {menuOpen && currentUser && isMobile && (
                    <div className="nav-mobile-menu">
                        <NavLink to="/experiences" onClick={() => setMenuOpen(false)}>EXPLORE</NavLink>
                        <NavLink to="/roadTrip" onClick={() => setMenuOpen(false)}>PLAN ROADTRIP</NavLink>
                        <NavLink to="/my-roadtrips" onClick={() => setMenuOpen(false)}>MY ROADTRIPS</NavLink>
                        <NavLink to="/activity-controller" onClick={() => setMenuOpen(false)}>ACTIVITIES</NavLink>
                        <span className="nav-username" style={{ cursor: "default" }}>
                            {currentUser.username.toUpperCase()}
                        </span>
                        <button className="nav-logout-btn" onClick={() => { setMenuOpen(false); handleLogout(); }} title="Logout">
                            <FaSignOutAlt />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};