import React from 'react';
import  '../styles/Footer.css';


export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          Sebastian Andrisan &copy; {new Date().getFullYear()} | Digital Systems University of Piraeus 
        </p>
      </div>
    </footer>
  );
}
