import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CkEditorDocuments from '../../CKeditorDocuments';

const DashboardStudent = () => {
  const [proposal, setProposal] = useState('');
  const [topAdvisors, setTopAdvisors] = useState([]);
  const [advisorInfo, setAdvisorInfo] = useState(null);
  const [advisorStatus, setAdvisorStatus] = useState(null);
  const [panelists, setPanelists] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAdvisorInfo();
  }, []);

  const fetchAdvisorInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/student/student-advisor-info/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setAdvisorInfo(data.chosenAdvisor);
        setAdvisorStatus(data.advisorStatus);
        setPanelists(data.panelists || []);
      } else {
        const errorData = await response.json();
        console.error('Error fetching advisor info:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching advisor info:', error.message);
    }
  };

  const submitProposal = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/student/submit-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, proposalText: proposal }),
      });
      if (response.ok) {
        const data = await response.json();
        setTopAdvisors(data.topAdvisors);
        console.log('Proposal submitted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error submitting proposal:', errorData.message);
      }
    } catch (error) {
      console.error('Error submitting proposal:', error.message);
    }
  };
  

  const chooseAdvisor = async (advisorId) => {
    try {
      const response = await fetch('http://localhost:5000/api/student/choose-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, advisorId }),
      });
      if (response.ok) {
        console.log('Advisor chosen successfully!');
        fetchAdvisorInfo(); // Refresh advisor info
      } else {
        const errorData = await response.json();
        console.error('Error choosing advisor:', errorData.message);
      }
    } catch (error) {
      console.error('Error choosing advisor:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditorSave = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/student/submit-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, proposalText: data }),
      });
      if (response.ok) {
        console.log('Document saved successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error saving document:', errorData.message);
      }
    } catch (error) {
      console.error('Error saving document:', error.message);
    }
  };

  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <img src={`http://localhost:5000/public/uploads/${user.profileImage}`} alt="Profile" />
      {(!advisorInfo || advisorStatus === 'declined') && (
        <form onSubmit={(e) => { e.preventDefault(); submitProposal(); }}>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            placeholder="Write your proposal here..."
            required
          />
          <button type="submit">Submit Proposal</button>
        </form>
      )}
      <h2>Top Advisors</h2>
      <ul>
        {topAdvisors.map((advisor) => (
          <li key={advisor._id}>
            {advisor.name}
            {!advisorInfo || advisorStatus === 'declined' ? (
              <button onClick={() => chooseAdvisor(advisor._id)}>Choose Advisor</button>
            ) : null}
          </li>
        ))}
      </ul>
      {advisorInfo && (
        <div>
          <h2>Chosen Advisor</h2>
          <p>Name: {advisorInfo.name}</p>
          <p>Status: {advisorStatus}</p>
        </div>
      )}
      {advisorInfo && advisorStatus === 'accepted' && panelists.length > 0 && (
        <div>
          <h2>Panelists</h2>
          <ul>
            {panelists.map((panelist) => (
              <li key={panelist._id}>{panelist.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => setIsEditorOpen(true)}>Upload Manuscript</button>
      {isEditorOpen && (
        <CkEditorDocuments userId={user._id} onSave={handleEditorSave} />
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardStudent;