import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaStar, FaMoneyBillWave, FaClock, FaUserMd } from 'react-icons/fa';
import '../css/ClinicDetail.css';
import '../css/Forms.css';
import '../css/Button.css';
const ClinicDetailPage = () => {
	const { id } = useParams();
	const { user } = useContext(AuthContext);
	const [clinic, setClinic] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [bookingData, setBookingData] = useState({ date: '', time: '', reason: '', doctorId: '', serviceId: '' });
	useEffect(() => {
		const fetchClinic = async () => {
			try {
				const res = await axios.get(`/api/clinics/${id}`);
				setClinic(res.data);
			} catch (err) { setError('Failed to fetch clinic details.'); }
			finally { setLoading(false); }
		};
		fetchClinic();
	}, [id]);
	const handleBookingChange = (e) => setBookingData({ ...bookingData, [e.target.name]: e.target.value });
	const handleBookingSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post('/api/user/appointments/book', { ...bookingData, clinicId: id });
			toast.success('Appointment booked successfully');
			setBookingData({ date: '', time: '', reason: '', doctorId: '', serviceId: '' });
		} catch (err) { toast.error(err.response?.data?.message || 'Failed to book appointment'); }
	};
	if (loading) return <Spinner />;
	if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;
	if (!clinic) return null;
	return (
		<div className="clinic-detail-page">
			<div className="clinic-detail-header" style={{backgroundImage: `url(${clinic.photo})`}}>
				<div className="header-overlay">
					<h1>{clinic.name}</h1>
					<div className="header-info">
						<span><FaMapMarkerAlt /> {clinic.address?.street}, {clinic.address?.city}</span>
						<span><FaStar /> {clinic.avgRating} ({clinic.reviewCount} reviews)</span>
						<span><FaMoneyBillWave /> Starts at ${clinic.charges}</span>
					</div>
				</div>
			</div>
			<div className="clinic-detail-body">
				<div className="clinic-main-content">
					<h2>About the Clinic</h2>
					<p>Welcome to {clinic.name}, a leading provider of exceptional healthcare services in {clinic.address?.city}. Our dedicated team is committed to your well-being.</p>
					<h3>Our Doctors</h3>
					<div className="doctors-list">
						{(clinic.doctors || []).map(doc => (
							<div key={doc._id} className="doctor-item">
								<FaUserMd />
								<div>
									<strong>{doc.name}</strong>
									<p>{doc.specialization}</p>
									<Link className="btn btn-outline" to={`/clinic/${clinic._id}/doctor/${doc._id}`}>View Profile</Link>
								</div>
							</div>
						))}
					</div>
					<h3>Reviews</h3>
					<div className="reviews-section">
						{clinic.reviews.length > 0 ? clinic.reviews.map(review => (
							<div key={review._id} className="review-card">
								<div className="review-header"><strong>{review.userName}</strong><span className="review-rating"><FaStar /> {review.rating}/5</span></div>
								<p>"{review.comment}"</p>
							</div>
						)) : <p>No reviews yet.</p>}
					</div>
				</div>
				<div className="clinic-sidebar">
					<div className="sidebar-widget">
						<h3><FaClock /> Opening Hours</h3>
						<ul>{clinic.availability && Object.entries(clinic.availability).map(([day, times]) => (<li key={day}><span>{day}</span> <span>{times[0]} - {times[1]}</span></li>))}</ul>
					</div>
					{user && user.role === 'User' && (
						<div className="sidebar-widget booking-form">
							<h3>Book an Appointment</h3>
							<form onSubmit={handleBookingSubmit}>
								<div className="form-group"><label>Service</label>
									<select name="serviceId" value={bookingData.serviceId} onChange={handleBookingChange} required>
										<option value="">Select a service</option>
										{(clinic.services || []).map(s => <option key={s._id} value={s._id}>{s.name} (${s.price})</option>)}
									</select>
								</div>
								<div className="form-group"><label>Doctor</label>
									<select name="doctorId" value={bookingData.doctorId} onChange={handleBookingChange}>
										<option value="">Any available</option>
										{(clinic.doctors || []).map(d => <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>)}
									</select>
								</div>
								<div className="form-group"><label>Date</label><input type="date" name="date" value={bookingData.date} onChange={handleBookingChange} required /></div>
								<div className="form-group"><label>Time</label><input type="time" name="time" value={bookingData.time} onChange={handleBookingChange} required /></div>
								<div className="form-group"><label>Reason for visit</label><textarea name="reason" value={bookingData.reason} onChange={handleBookingChange} required></textarea></div>
								<button type="submit" className="btn btn-primary btn-full-width">Book Now</button>
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default ClinicDetailPage;