// src/components/DashboardPanelist.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPanelist = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <h1>Panelist Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <img src={`http://localhost:5000/public/uploads/${user.profileImage}`} alt="Profile" />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPanelist;
