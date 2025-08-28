import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../css/Forms.css';
import '../css/Button.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', formData);
      toast.success('Login successful! Welcome back.');
      login(res.data.token);
      
      const role = res.data.user.role;
      if (role === 'Admin') navigate('/dashboard/admin');
      else if (role === 'Clinic') navigate('/dashboard/clinic');
      else if (role === 'User') navigate('/dashboard/user');
      else navigate('/');

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      console.log(err);
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary btn-full-width" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
