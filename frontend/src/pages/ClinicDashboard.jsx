import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarAlt, FaUserEdit, FaUserMd, FaList } from 'react-icons/fa';
import ClinicStats from '../components/clinic/ClinicStats';
import AppointmentList from '../components/clinic/AppointmentList';
import ClinicProfile from '../components/clinic/ClinicProfile';
import DoctorsManager from '../components/clinic/DoctorsManager';
import ServicesManager from '../components/clinic/ServicesManager';
import '../css/Dashboard.css';
const ClinicDashboard = ({ isHomePage }) => {
	const basePath = "/dashboard/clinic";
	return (
		<div className="page-container">
			{!isHomePage && <div className="page-header"><h1>Clinic Dashboard</h1></div>}
			<div className="dashboard-layout">
				<aside className="dashboard-sidebar">
					<ul className="dashboard-sidebar-menu">
						<li><NavLink to={`${basePath}/`} end className={({isActive}) => isActive ? "active" : ""}><FaTachometerAlt className="icon" /> Overview</NavLink></li>
						<li><NavLink to={`${basePath}/appointments`} className={({isActive}) => isActive ? "active" : ""}><FaCalendarAlt className="icon" /> Appointments</NavLink></li>
						<li><NavLink to={`${basePath}/doctors`} className={({isActive}) => isActive ? "active" : ""}><FaUserMd className="icon" /> Doctors</NavLink></li>
						<li><NavLink to={`${basePath}/services`} className={({isActive}) => isActive ? "active" : ""}><FaList className="icon" /> Services</NavLink></li>
						<li><NavLink to={`${basePath}/profile`} className={({isActive}) => isActive ? "active" : ""}><FaUserEdit className="icon" /> Profile</NavLink></li>
					</ul>
				</aside>
				<main className="dashboard-content">
					<Routes>
						<Route path="/" element={<ClinicStats />} />
						<Route path="/appointments" element={<AppointmentList />} />
						<Route path="/doctors" element={<DoctorsManager />} />
						<Route path="/services" element={<ServicesManager />} />
						<Route path="/profile" element={<ClinicProfile />} />
					</Routes>
				</main>
			</div>
		</div>
	);
};
export default ClinicDashboard;