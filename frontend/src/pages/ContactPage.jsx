import React, { useState } from 'react';
import '../css/Forms.css';
import '../css/Button.css';
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  return (
    <div className="form-container">
      <h2>Contact Us</h2>
      <p style={{textAlign: 'center', marginBottom: '2rem'}}>Have a question or feedback? We'd love to hear from you.</p>
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Your Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
        <div className="form-group"><label>Your Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
        <div className="form-group"><label>Message</label><textarea name="message" value={formData.message} onChange={handleChange} required></textarea></div>
        <button type="submit" className="btn btn-primary btn-full-width">Send Message</button>
      </form>
    </div>
  );
};
export default ContactPage;
