import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppointmentHistory from '../components/user/AppointmentHistory';
import UserProfile from '../components/user/UserProfile';
import '../css/Dashboard.css';
const UserDashboard = () => {
  const [upcomingNext, setUpcomingNext] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, cancelled: 0 });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, profRes, artRes] = await Promise.all([
          axios.get('/api/user/dashboard'),
          axios.get('/api/user/profile')
        ]);
        const upcoming = Array.isArray(dashRes.data.upcoming) ? dashRes.data.upcoming.slice().sort((a, b) => new Date(a.date) - new Date(b.date)) : [];
        setUpcomingNext(upcoming[0] || null);
        const past = dashRes.data.past || [];
        setStats({ total: (upcoming.length + past.length) || 0, completed: past.filter(p => p.status === 'completed').length, cancelled: past.filter(p => p.status === 'cancelled').length });
        setProfile(profRes.data || {});
      } catch (e) { /* ignore */ }
    };
    load();
  }, []);

  const profileFields = ['name', 'dob', 'gender', 'address', 'photo'];
  const filled = profileFields.reduce((acc, key) => acc + (profile && profile[key] ? 1 : 0), 0);
  const completeness = Math.round((filled / profileFields.length) * 100);

  return (
    <div className="page-container">
      <div className="page-header"><h1>My Dashboard</h1><p>Update your profile, manage bookings, and your account.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card"><div className="card-body"><UserProfile /></div></div>
          <div className="card"><div className="card-body"><h3 style={{ marginBottom: '0.75rem' }}>Appointment History</h3><AppointmentHistory /></div></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card"><div className="card-body">
            <h4 style={{ marginBottom: '0.75rem' }}>Upcoming Appointment</h4>
            {upcomingNext ? (
              <div>
                <p style={{ marginBottom: '0.5rem' }}><strong>{upcomingNext.date}</strong> at <strong>{upcomingNext.time}</strong></p>
                <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>{upcomingNext.clinicName || 'Clinic'}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href="/clinics" className="btn btn-outline btn-sm">Reschedule</a>
                  <a href="/clinics" className="btn btn-secondary btn-sm">Find Clinic</a>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>No upcoming appointments.</p>
                <a href="/clinics" className="btn btn-primary btn-sm">Book Now</a>
              </div>
            )}
          </div></div>

          <div className="card"><div className="card-body">
            <h4 style={{ marginBottom: '0.75rem' }}>Your Stats</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div className="card" style={{ boxShadow: 'var(--shadow-sm)' }}><div className="card-body"><h5 style={{ margin: 0 }}>{stats.total}</h5><p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total</p></div></div>
              <div className="card" style={{ boxShadow: 'var(--shadow-sm)' }}><div className="card-body"><h5 style={{ margin: 0 }}>{stats.completed}</h5><p style={{ margin: 0, color: 'var(--text-secondary)' }}>Completed</p></div></div>
              <div className="card" style={{ boxShadow: 'var(--shadow-sm)' }}><div className="card-body"><h5 style={{ margin: 0 }}>{stats.cancelled}</h5><p style={{ margin: 0, color: 'var(--text-secondary)' }}>Cancelled</p></div></div>
            </div>
          </div></div>

          <div className="card"><div className="card-body">
            <h4 style={{ marginBottom: '0.75rem' }}>Profile Completeness</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: 10, background: 'var(--surface-hover)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ width: `${completeness}%`, height: '100%', background: 'linear-gradient(90deg, var(--secondary-color), var(--primary-color))' }} />
              </div>
              <span style={{ fontWeight: 600 }}>{completeness}%</span>
            </div>
            {completeness < 100 && (
              <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Add your {profile && profileFields.filter(k => !profile[k]).join(', ')}.</p>
            )}
          </div></div>
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
