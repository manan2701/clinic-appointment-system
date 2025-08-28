import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../common/Spinner';
const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/clinic/appointments');
      setAppointments(res.data);
    } catch (error) { console.error("Failed to fetch appointments", error); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAppointments(); }, []);
  const handleStatusChange = async (id, status) => {
    try { await axios.put(`/api/clinic/appointments/${id}/status`, { status }); fetchAppointments(); }
    catch (error) { console.error("Failed to update status", error); }
  };
  if (loading) return <Spinner />;
  return (
    <div>
      <h3>All Appointments</h3>
      <table className="data-table">
        <thead><tr><th>Date</th><th>Time</th><th>Patient</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{appointments.map(app => (
            <tr key={app._id}><td>{app.date}</td><td>{app.time}</td><td>{app.userName}</td><td>{app.reason}</td><td><span className={`status-${app.status}`}>{app.status}</span></td>
              <td className="table-actions">
                {app.status === 'booked' && (
                  <><button onClick={() => handleStatusChange(app._id, 'completed')} className="btn btn-primary">Complete</button>
                  <button onClick={() => handleStatusChange(app._id, 'cancelled')} className="btn btn-outline" style={{borderColor: 'var(--error-color)', color: 'var(--error-color)'}}>Cancel</button></>
                )}
              </td>
            </tr>
          ))}</tbody>
      </table>
    </div>
  );
};
export default AppointmentList;
