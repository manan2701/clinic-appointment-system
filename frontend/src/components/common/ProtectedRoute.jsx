import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Spinner from './Spinner';
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) { return <Spinner />; }
  if (!user) { return <Navigate to="/login" state={{ from: location }} replace />; }
  if (roles && !roles.includes(user.role)) { return <Navigate to="/" replace />; }
  return children;
};
export default ProtectedRoute;
