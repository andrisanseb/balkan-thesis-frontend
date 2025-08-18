import React from 'react';
import '../App.css';

// unused for now
export const Header = ({ currentPath }) => {
    let headerComponent;

    if (currentPath === '/my-profile'){
        headerComponent = <h1>My Profile</h1>
    }

    return <header>{headerComponent}</header>;
};