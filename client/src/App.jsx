import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/registration';
import Login from './components/login';

// Student
import DashboardStudent from './components/pages/student/DashboardStudent';

// Adviser
import DashboardAdviser from './components/pages/adviser/DashboardAdviser';

// Panelist
import DashboardPanelist from './components/pages/panelist/DashboardPanelist';

// Admin
import LoginAdmin from './components/pages/admin/loginAdmin';
import AdminRegister from './components/pages/admin/AdminRegister';
import AdminDashboard from './components/pages/admin/AdminDashboard';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  return (
      <Routes>
        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={saveToken} />} />

        {/* Student */}
        <Route path="/dashboard-student" element={<DashboardStudent />} />

        {/* Adviser */}
        <Route path="/dashboard-adviser" element={<DashboardAdviser />} />

        {/* Panelist */}
        <Route path="/dashboard-panelist" element={<DashboardPanelist />} />

        {/* Admin */}
        <Route path="/admin" element={<LoginAdmin setToken={saveToken} />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={token ? <AdminDashboard /> : <LoginAdmin setToken={saveToken} />} />
      </Routes>
  );
};

export default App;
