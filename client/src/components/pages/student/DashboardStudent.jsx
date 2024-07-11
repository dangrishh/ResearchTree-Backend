import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardStudent = () => {
  const [proposal, setProposal] = useState('');
  const [topAdvisors, setTopAdvisors] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const submitProposal = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/submit-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, proposalText: proposal }), // Corrected to send proposalText
      });
      if (response.ok) {
        const data = await response.json();
        setTopAdvisors(data.topAdvisors); // Assuming your API response includes topAdvisors
        console.log('Proposal submitted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error submitting proposal:', errorData.message);
      }
    } catch (error) {
      console.error('Error submitting proposal:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Example redirect to login page after logout
  };

  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <img src={`http://localhost:5000/public/uploads/${user.profileImage}`} alt="Profile" />
      <form onSubmit={(e) => { e.preventDefault(); submitProposal(); }}>
        <textarea
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Write your proposal here..."
          required
        />
        <button type="submit">Submit Proposal</button>
      </form>
      <h2>Top Advisors</h2>
      <ul>
        {topAdvisors.map((advisor, index) => (
          <li key={index}>{advisor.name}</li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardStudent;
