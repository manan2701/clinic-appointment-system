import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../common/Spinner';
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/admin/users');
        setUsers(res.data);
      } catch (error) { console.error("Failed to fetch users", error); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);
  if (loading) return <Spinner />;
  return (
    <div>
      <h3>All Registered Users</h3>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Email</th><th>Date of Birth</th></tr></thead>
        <tbody>{users.map(user => (<tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td>{user.dob}</td></tr>))}</tbody>
      </table>
    </div>
  );
};
export default AllUsers;
