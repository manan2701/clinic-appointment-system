import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaClock, FaUsers, FaHospital } from 'react-icons/fa';
import AdminStats from '../components/admin/AdminStats';
import PendingClinics from '../components/admin/PendingClinics';
import AllUsers from '../components/admin/AllUsers';
import AllClinics from '../components/admin/AllClinics';
import '../css/Dashboard.css';
const AdminDashboard = ({ isHomePage }) => {
  const basePath = "/dashboard/admin";
  return (
    <div className="page-container">
      {!isHomePage && <div className="page-header"><h1>Admin Dashboard</h1></div>}
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <ul className="dashboard-sidebar-menu">
            <li><NavLink to={`${basePath}/`} end className={({isActive}) => isActive ? "active" : ""}><FaTachometerAlt className="icon" /> Overview</NavLink></li>
            <li><NavLink to={`${basePath}/pending-approvals`} className={({isActive}) => isActive ? "active" : ""}><FaClock className="icon" /> Pending Approvals</NavLink></li>
            <li><NavLink to={`${basePath}/clinics`} className={({isActive}) => isActive ? "active" : ""}><FaHospital className="icon" /> Manage Clinics</NavLink></li>
            <li><NavLink to={`${basePath}/users`} className={({isActive}) => isActive ? "active" : ""}><FaUsers className="icon" /> Manage Users</NavLink></li>
          </ul>
        </aside>
        <main className="dashboard-content">
          <Routes>
            <Route path="/" element={<AdminStats />} />
            <Route path="/pending-approvals" element={<PendingClinics />} />
            <Route path="/users" element={<AllUsers />} />
            <Route path="/clinics" element={<AllClinics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
export default AdminDashboard;
