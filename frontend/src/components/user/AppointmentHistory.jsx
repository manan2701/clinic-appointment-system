import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../common/Spinner';
import ReviewForm from './ReviewForm';
import { toast } from 'react-toastify';
const AppointmentHistory = () => {
	const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
	const [loading, setLoading] = useState(true);
	const [reviewing, setReviewing] = useState(null);
	const [rescheduling, setRescheduling] = useState(null);
	const [newDate, setNewDate] = useState('');
	const [newTime, setNewTime] = useState('');

	const fetchAppointments = async () => {
		setLoading(true);
		try {
			const res = await axios.get('/api/user/dashboard');
			setAppointments(res.data);
		} catch (error) { console.error("Failed to fetch appointments", error); }
		finally { setLoading(false); }
	};
	useEffect(() => { fetchAppointments(); }, []);

	const cancelAppointment = async (id) => {
		try { await axios.delete(`/api/user/appointments/${id}`); toast.success('Appointment cancelled'); fetchAppointments(); }
		catch { toast.error('Failed to cancel'); }
	};

	const rescheduleAppointment = async (id) => {
		try { await axios.put(`/api/user/appointments/${id}/reschedule`, { date: newDate, time: newTime }); toast.success('Appointment rescheduled'); setRescheduling(null); setNewDate(''); setNewTime(''); fetchAppointments(); }
		catch { toast.error('Failed to reschedule'); }
	};

	if (loading) return <Spinner />;
	return (
		<div>
			{reviewing && (<ReviewForm clinicId={reviewing} onClose={() => setReviewing(null)} onReviewSubmit={() => { setReviewing(null); fetchAppointments(); }} />)}
			<h3>Upcoming Appointments</h3>
			{appointments.upcoming.length > 0 ? (
				<table className="data-table">
					<thead><tr><th>Date</th><th>Time</th><th>Clinic</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
					<tbody>{appointments.upcoming.map(app => (
						<tr key={app._id}>
							<td>{app.date}</td><td>{app.time}</td><td>{app.clinicName}</td><td>{app.reason}</td>
							<td><span className={`status-${app.status}`}>{app.status}</span></td>
							<td className="table-actions">
								<button className="btn btn-outline" onClick={() => cancelAppointment(app._id)}>Cancel</button>
								{rescheduling === app._id ? (
									<>
										<input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} />
										<input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} />
										<button className="btn btn-primary" onClick={() => rescheduleAppointment(app._id)}>Save</button>
										<button className="btn btn-outline" onClick={() => setRescheduling(null)}>Close</button>
									</>
								) : (
									<button className="btn btn-secondary" onClick={() => setRescheduling(app._id)}>Reschedule</button>
								)}
							</td>
						</tr>
					))}</tbody>
				</table>
			) : <p>You have no upcoming appointments.</p>}
			<h3 style={{marginTop: '2rem'}}>Past Appointments</h3>
			{appointments.past.length > 0 ? (
				<table className="data-table">
					<thead><tr><th>Date</th><th>Clinic</th><th>Status</th><th>Action</th></tr></thead>
					<tbody>{appointments.past.map(app => (
							<tr key={app._id}><td>{app.date}</td><td>{app.clinicName}</td><td><span className={`status-${app.status}`}>{app.status}</span></td>
								<td>{app.status === 'completed' && (<button className="btn btn-secondary" onClick={() => setReviewing(app.clinicId)}>Leave a Review</button>)}</td>
							</tr>
						))}</tbody>
				</table>
			) : <p>You have no past appointments.</p>}
		</div>
	);
};
export default AppointmentHistory;