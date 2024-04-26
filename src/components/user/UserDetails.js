import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
// import '../../styles/UserDetails.css'

export default function UsersDetails() {
    const currentUser = AuthService.getCurrentUser();

    return (
        <div className="users-details-container">
            <h2>{currentUser.username.toUpperCase()}</h2>
            <p>{currentUser.email.toUpperCase()}</p>
        </div>
    );
}