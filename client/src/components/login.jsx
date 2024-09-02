import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/advicer/login', { email, password });
      const { token, user } = response.data;
  
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
  
      switch (user.role) {
        case 'student':
          navigate('/dashboard-student');
          break;
        case 'adviser':
          navigate('/dashboard-adviser');
          break;
        default:
          break;
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage('Your account is awaiting admin approval.');
      } else if (error.response && error.response.status === 400) {
        setErrorMessage('Your credentials are incorrect.');
      } else {
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
      {errorMessage && <p>{errorMessage}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
