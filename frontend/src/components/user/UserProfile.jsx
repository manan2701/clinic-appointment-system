import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import '../../css/Forms.css';
import '../../css/Button.css';

const UserProfile = () => {
	const { user, logout } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [form, setForm] = useState({ name: '', email: '', dob: '', address: '', gender: '', photo: '' });
	const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axios.get('/api/user/profile');
				setForm({ name: res.data.name || '', email: res.data.email || '', dob: res.data.dob || '', address: res.data.address || '', gender: res.data.gender || '', photo: res.data.photo || '' });
			} catch (e) {
				setError('Failed to load profile');
			} finally { setLoading(false); }
		};
		if (user) fetchProfile();
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswords(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true); setSuccess(''); setError('');
		try {
			const payload = { ...form };
			if (passwords.newPassword) {
				payload.currentPassword = passwords.currentPassword;
				payload.newPassword = passwords.newPassword;
			}
			await axios.put('/api/user/profile', payload);
			setSuccess('Profile updated successfully');
			setPasswords({ currentPassword: '', newPassword: '' });
		} catch (err) {
			setError(err?.response?.data?.message || 'Failed to update profile');
		} finally { setSaving(false); }
	};

	const handleDelete = async () => {
		if (!window.confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;
		try {
			await axios.delete('/api/account/delete');
			logout();
			window.location.href = '/';
		} catch (e) {
			setError('Failed to delete account');
		}
	};

	if (loading) return <Spinner />;

	return (
		<div>
			<h3>Update Profile</h3>
			{success && <p className="success-message">{success}</p>}
			{error && <p className="error-message">{error}</p>}
			<form onSubmit={handleSubmit} className="profile-form">
				<div className="form-group">
					<label>Name</label>
					<input type="text" name="name" value={form.name} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Email</label>
					<input type="email" name="email" value={form.email} disabled />
				</div>
				<div className="form-group">
					<label>Date of Birth</label>
					<input type="date" name="dob" value={form.dob} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Address</label>
					<input type="text" name="address" value={form.address} onChange={handleChange} />
				</div>
				<div className="form-group">
					<label>Gender</label>
					<select name="gender" value={form.gender} onChange={handleChange}>
						<option value="">Select</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">Other</option>
					</select>
				</div>
				<div className="form-group">
					<label>Photo URL</label>
					<input type="text" name="photo" value={form.photo} onChange={handleChange} />
				</div>

				<h4>Change Password</h4>
				<div className="form-row">
					<div className="form-group">
						<label>Current Password</label>
						<input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} />
					</div>
					<div className="form-group">
						<label>New Password</label>
						<input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} />
					</div>
				</div>

				<div className="form-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '1rem' }}>
					<button type="submit" className={`btn btn-primary ${saving ? 'loading' : ''}`} disabled={saving}>Save Changes</button>
					<button type="button" className="btn btn-danger hover-glow" onClick={handleDelete}>Delete Account</button>
				</div>
			</form>
		</div>
	);
};

export default UserProfile;


