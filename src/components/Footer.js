import React from 'react';
import  '../styles/Footer.css';


export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          Your Name &copy; {new Date().getFullYear()} | Your University
        </p>
      </div>
    </footer>
  );
}
