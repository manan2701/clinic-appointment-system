import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaHospital, FaCalendarCheck, FaClock } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Spinner from '../common/Spinner';
const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (error) { console.error("Failed to fetch admin stats", error); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);
  if (loading) return <Spinner />;
  if (!stats) return <p>Could not load stats.</p>;
  return (
    <div>
      <h3>Platform Overview</h3>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-card-icon blue"><FaUsers /></div><div className="stat-card-info"><h3>{stats.totalUsers}</h3><p>Total Users</p></div></div>
        <div className="stat-card"><div className="stat-card-icon green"><FaHospital /></div><div className="stat-card-info"><h3>{stats.totalClinics}</h3><p>Total Clinics</p></div></div>
        <div className="stat-card"><div className="stat-card-icon orange"><FaCalendarCheck /></div><div className="stat-card-info"><h3>{stats.totalAppointments}</h3><p>Total Appointments</p></div></div>
        <div className="stat-card"><div className="stat-card-icon red"><FaClock /></div><div className="stat-card-info"><h3>{stats.pendingApprovals}</h3><p>Pending Approvals</p></div></div>
      </div>
      <div className="chart-container">
        <h3>Weekly Appointments</h3>
        <ResponsiveContainer width="100%" height={300}><BarChart data={stats.weeklyAppointments}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="count" fill="#4A90E2" name="Appointments" /></BarChart></ResponsiveContainer>
      </div>
    </div>
  );
};
export default AdminStats;
