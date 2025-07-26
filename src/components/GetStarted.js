import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from './auth/LoginForm';
import '../styles/GetStarted.css';
import AuthService from '../services/AuthService';
import {Welcome} from "./Welcome";

export const GetStarted = () => {
    const currentUser = AuthService.getCurrentUser();


    return (
        <div className="get-started-container">
            {currentUser ? (
                <Welcome /> ) : (
               <>
                <div>
                    <LoginForm className="logform"/>
                </div>
               </>
            )} 
        </div>
    );
};