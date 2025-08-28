import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarCheck, FaCalendarDay, FaUserFriends } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Spinner from "../common/Spinner";
const ClinicStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/clinic/dashboard");
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch clinic stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  if (loading) return <Spinner />;
  if (!data) return <p>Could not load dashboard data.</p>;
  const { stats, todaysAppointments, weeklyAppointments } = data;
  return (
    <div>
      <h3>Your Clinic Overview</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon blue">
            <FaCalendarDay />
          </div>
          <div className="stat-card-info">
            <h3>{stats.todaysAppointmentCount}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">
            <FaCalendarCheck />
          </div>
          <div className="stat-card-info">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange">
            <FaUserFriends />
          </div>
          <div className="stat-card-info">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
      </div>
      <div className="chart-container">
        <h3>Weekly Appointments</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyAppointments}>
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, (dataMax) => dataMax + 2]} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#0b3c5d" name="Appointments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3>Today's Schedule</h3>
        {todaysAppointments.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient Name</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {todaysAppointments.map((app) => (
                <tr key={app._id}>
                  <td>{app.time}</td>
                  <td>{app.userName}</td>
                  <td>{app.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No appointments scheduled for today.</p>
        )}
      </div>
    </div>
  );
};
export default ClinicStats;
