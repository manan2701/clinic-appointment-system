import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../css/Navbar.css';
import '../../css/Button.css';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ? stored : (preferredDark ? 'dark' : 'light');
    // Start in light as requested
    const startTheme = stored ? initial : 'light';
    setTheme(startTheme);
    document.documentElement.setAttribute('data-theme', startTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'Admin': return '/dashboard/admin';
      case 'Clinic': return '/dashboard/clinic';
      case 'User': return '/dashboard/user';
      default: return '/';
    }
  };

  return (
    <nav className={`navbar ${isOpen ? 'open' : ''}`}>
      <div className="navbar-logo"><Link to="/">Carey<span>Site</span></Link></div>
      <div className="mobile-menu-icon" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <FaTimes /> : <FaBars />}</div>
      <ul className="navbar-menu">
        <li><NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink></li>
        
        {/* These links will ONLY show if a user is logged in */}
        {user && (
            <>
                <li><NavLink to="/clinics" className={({isActive}) => isActive ? "active" : ""}>Find a Clinic</NavLink></li>
                <li><NavLink to="/faq" className={({isActive}) => isActive ? "active" : ""}>FAQ</NavLink></li>
            </>
        )}
      </ul>
      <div className="navbar-actions">
        {user ? (
          <div className="profile-dropdown">
            <button className="profile-button"><FaUserCircle className="icon" /><span>{user.name}</span></button>
            <ul className="dropdown-menu">
              <li><Link to={getDashboardLink()}>Dashboard</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
