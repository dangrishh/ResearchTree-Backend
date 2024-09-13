import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [newSpecialization, setNewSpecialization] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }

    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/pending');
        setPendingUsers(response.data);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users');
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/specializations');
        setSpecializations(response.data);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    fetchPendingUsers();
    fetchAllUsers();
    fetchSpecializations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin';
  };

  const handleApprove = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${userId}`);
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
      const updatedUsers = await axios.get('http://localhost:5000/api/admin/users');
      setAllUsers(updatedUsers.data);
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleDecline = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/decline/${userId}`);
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
      const updatedUsers = await axios.get('http://localhost:5000/api/admin/users');
      setAllUsers(updatedUsers.data);
    } catch (error) {
      console.error('Error declining user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      setAllUsers(allUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddSpecialization = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/specializations', { name: newSpecialization });
      setSpecializations([...specializations, response.data]);
      setNewSpecialization('');
    } catch (error) {
      console.error('Error adding specialization:', error);
    }
  };

  const handleEditSpecialization = async (id, name) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/specializations/${id}`, { name });
      setSpecializations(specializations.map(spec => spec._id === id ? response.data : spec));
    } catch (error) {
      console.error('Error editing specialization:', error);
    }
  };

  const handleDeleteSpecialization = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/specializations/${id}`);
      setSpecializations(specializations.filter(spec => spec._id !== id));
    } catch (error) {
      console.error('Error deleting specialization:', error);
    }
  };

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2>Admin Dashboard</h2>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <p className="text-xl mb-2">Welcome, {admin.name}</p>
      {admin.profileImage && <p><img className="w-32 h-32 rounded-full" src={`http://localhost:5000${admin.profileImage}`} alt="Profile" /></p>}
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleLogout}>Logout</button>

      <div className="mt-8 w-full max-w-2xl">
        <h3 className="text-2xl font-bold mb-4">Pending Users</h3>
        {pendingUsers.map(user => (
          <div key={user._id} className="border p-4 mb-4">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Course: {user.course}</p>
            <p>Handle Student: {user.handleNumber}</p>
            <p>Specializations: {user.specializations.join(', ')}</p>
            {user.profileImage && <img className="w-16 h-16 rounded-full" src={`http://localhost:5000/public/uploads/${user.profileImage}`} alt="Profile" />}
            <div className="mt-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2" onClick={() => handleApprove(user._id)}>Approve</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={() => handleDecline(user._id)}>Decline</button>
            </div>
          </div>
        ))}

        <h3 className="text-2xl font-bold mb-4">All Users</h3>
        {allUsers.map(user => (
          <div key={user._id} className="border p-4 mb-4">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Course: {user.course}</p>
            <p>Handle Student: {user.handleNumber}</p>
            <p>Specializations: {user.specializations.join(', ')}</p>
            {user.profileImage && <img className="w-16 h-16 rounded-full" src={`http://localhost:5000/public/uploads/${user.profileImage}`} alt="Profile" />}
            <div className="mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={() => handleDelete(user._id)}>Delete</button>
            </div>
          </div>
        ))}

        <h3 className="text-2xl font-bold mb-4">Manage Specializations</h3>
        <div>
          <input 
            type="text" 
            value={newSpecialization} 
            onChange={(e) => setNewSpecialization(e.target.value)} 
            placeholder="Add new specialization" 
          />
          <button onClick={handleAddSpecialization}>Add</button>
        </div>
        {specializations.map(spec => (
          <div key={spec._id} className="border p-4 mb-4 flex justify-between items-center">
            <input 
              type="text" 
              value={spec.name} 
              onChange={(e) => handleEditSpecialization(spec._id, e.target.value)} 
            />
            <button onClick={() => handleDeleteSpecialization(spec._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
