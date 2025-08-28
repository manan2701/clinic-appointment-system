import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>CareySite</h4>
          <p>Your trusted partner in finding and booking clinic appointments with ease. We connect patients with top-rated clinics.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/clinics">Find a Clinic</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>For Clinics</h4>
          <ul>
            <li><Link to="/register">Register Your Clinic</Link></li>
            <li><Link to="/login">Clinic Portal</Link></li>
            <li><Link to="/faq">Clinic FAQs</Link></li>
            <li><Link to="/contact">Clinic Support</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul>
            <li>123 Health St, MedCity, 12345</li>
            <li>Email: support@careysite.com</li>
            <li>Phone: +91 9054631569</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CareySite | All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
