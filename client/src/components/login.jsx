// src/components/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // For error messages

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = response.data;

      // Save token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on user role
      switch (user.role) {
        case 'student':
          navigate('/dashboard-student');
          break;
        case 'adviser':
          navigate('/dashboard-adviser');
          break;
        case 'panelist':
          navigate('/dashboard-panelist');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error.response.data);
      if (error.response && error.response.status === 403) { // Forbidden
        if (error.response.data.message === 'Account not yet accepted by admin') {
          setErrorMessage('Your account is awaiting admin approval.');
        } else {
          setErrorMessage('Your credentials are incorrect.'); 
        }
      } else {
        console.error('An error occurred during login:', error); // Log to console for debugging
        setErrorMessage('An unexpected error occurred.'); 
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
