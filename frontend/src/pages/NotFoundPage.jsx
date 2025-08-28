import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Button.css';
const NotFoundPage = () => {
  return (
    <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--primary-color)', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem' }}>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Go to Homepage</Link>
    </div>
  );
};
export default NotFoundPage;
