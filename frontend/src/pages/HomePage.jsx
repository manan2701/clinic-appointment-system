import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeartBackground from '../components/common/HeartBackground';
import '../css/HomePage.css';
import '../css/Button.css';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="hero-section">
      <div className="hero-card">
        <HeartBackground />
        <div className="hero-content">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Find and Book Your Next Doctor's Appointment
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            Effortless booking, trusted clinics, and seamless healthcare management. All in one place.
          </motion.p>

          {!user ? (
            <motion.div 
              className="hero-actions" 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <Link to="/login" className="btn btn-primary btn-lg hover-shine hover-lift">
                Get Started
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg hover-sweep hover-glow">
                Join as Clinic
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              className="hero-actions" 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <Link to="/clinics" className="btn btn-primary btn-lg hover-shine hover-lift">
                Book Appointment
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;