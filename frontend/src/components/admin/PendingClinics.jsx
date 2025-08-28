import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../common/Spinner';
import '../../css/Button.css';

const PendingClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingClinics = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/clinics/pending');
      setClinics(res.data);
    } catch (error) {
      console.error("Failed to fetch pending clinics", error);
      toast.error("Could not fetch pending clinics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingClinics();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/clinics/${id}/approve`);
      toast.success("Clinic approved successfully!");
      fetchPendingClinics(); // Refresh list
    } catch (error) {
      console.error("Failed to approve clinic", error);
      toast.error("Failed to approve clinic.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/admin/clinics/${id}/reject`);
      toast.warn("Clinic rejected.");
      fetchPendingClinics(); // Refresh list
    } catch (error) {
      console.error("Failed to reject clinic", error);
      toast.error("Failed to reject clinic.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h3>Pending Clinic Approvals</h3>
      {clinics.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Clinic Name</th>
              <th>Email</th>
              <th>License Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map(clinic => (
              <tr key={clinic._id}>
                <td>{clinic.name}</td>
                <td>{clinic.email}</td>
                <td>{clinic.licenseNumber}</td>
                <td className="table-actions">
                  <button onClick={() => handleApprove(clinic._id)} className="btn btn-primary">Approve</button>
                  <button onClick={() => handleReject(clinic._id)} className="btn btn-outline" style={{ borderColor: 'var(--error-color)', color: 'var(--error-color)' }}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending approvals at the moment.</p>
      )}
    </div>
  );
};

export default PendingClinics;
