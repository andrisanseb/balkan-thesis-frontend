import React from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaw } from '@fortawesome/free-solid-svg-icons';

export const Header = ({ currentPath }) => {
    let headerComponent;

    if (currentPath === '/my-profile'){
        headerComponent = <h1><FontAwesomeIcon icon={faPaw}/> My Profile</h1>
    } 
    // else if (currentPath === '/dogs') {
    //     headerComponent = <h1><FontAwesomeIcon icon={faPaw}/> Dogs</h1>;
    // } else if (currentPath === '/my-dogs') {
    //     headerComponent = <h1><FontAwesomeIcon icon={faPaw}/> My Dogs</h1>;
    // } else if (currentPath === '/accepted-requests') {
    //     headerComponent = <h1><FontAwesomeIcon icon={faPaw}/> Accepted Requests</h1>;
    // } else if (currentPath === '/my-friends') {
    //     headerComponent = <h1><FontAwesomeIcon icon={faPaw}/> Friends</h1>;
    // } else if (currentPath === '/my-requests') {
    //     headerComponent = <h1><FontAwesomeIcon icon={faPaw}/> My Requests</h1>;
    // } else if (currentPath === '/requests') {
    //     headerComponent = <h1><FontAwesomeIcon icon={faPaw}/> All Requests</h1>;
    // }

    return <header>{headerComponent}</header>;
};