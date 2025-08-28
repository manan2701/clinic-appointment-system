import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../common/Spinner';
const AllClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await axios.get('/api/admin/clinics');
        setClinics(res.data);
      } catch (error) { console.error("Failed to fetch clinics", error); }
      finally { setLoading(false); }
    };
    fetchClinics();
  }, []);
  if (loading) return <Spinner />;
  return (
    <div>
      <h3>All Registered Clinics</h3>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Email</th><th>License Number</th><th>Status</th></tr></thead>
        <tbody>{clinics.map(clinic => (<tr key={clinic._id}><td>{clinic.name}</td><td>{clinic.email}</td><td>{clinic.licenseNumber}</td><td><span className={`status-${clinic.isApproved}`}>{clinic.isApproved}</span></td></tr>))}</tbody>
      </table>
    </div>
  );
};
export default AllClinics;
