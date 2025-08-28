import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Forms.css";
import "../css/Button.css";
const RegisterPage = () => {
  const [role, setRole] = useState("User");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({});
    setError("");
    setSuccess("");
  };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const endpoint = role === "User" ? "/api/auth/register/user" : "/api/auth/register/clinic";
    try {
      const res = await axios.post(endpoint, formData);
      setSuccess(res.data.message + " You will be redirected to login.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="form-container">
      <h2>Create Your Account</h2>
      <div className="form-switch">
        <button
          className={role === "User" ? "active" : ""}
          onClick={() => handleRoleChange("User")}
        >
          I'm a Patient
        </button>
        <button
          className={role === "Clinic" ? "active" : ""}
          onClick={() => handleRoleChange("Clinic")}
        >
          I'm a Clinic
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" required onChange={handleChange} />
        </div>
        {role === "User" && (
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" required onChange={handleChange} />
          </div>
        )}
        {role === "Clinic" && (
          <div className="form-group">
            <label>Valid Clinic License Number</label>
            <input
              type="text"
              name="licenseNumber"
              required
              onChange={handleChange}
            />
          </div>
        )}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-full-width"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};
export default RegisterPage;
