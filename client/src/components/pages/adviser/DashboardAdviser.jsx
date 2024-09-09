import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CkEditorDocuments from '../../CKeditorDocuments';

const DashboardAdviser = () => {
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [declinedStudents, setDeclinedStudents] = useState([]);
  const [studentsToManage, setStudentsToManage] = useState([]);
  const [panelistStudents, setPanelistStudents] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null); // Store channelId
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchPanelistStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/advicer/advisor-students/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAcceptedStudents(data.acceptedStudents);
        setDeclinedStudents(data.declinedStudents);
        setStudentsToManage(data.studentsToManage);
      } else {
        const errorData = await response.json();
        console.error('Error fetching students:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching students:', error.message);
    }
  };

  const fetchPanelistStudents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/advicer/panelist-students/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPanelistStudents(data.panelistStudents);
      } else {
        const errorData = await response.json();
        console.error('Error fetching panelist students:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching panelist students:', error.message);
    }
  };

  const handleStudentResponse = async (studentId, status) => {
    try {
      const response = await fetch('http://localhost:5000/api/advicer/respond-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ studentId, advisorId: user._id, status }),
      });
      if (response.ok) {
        fetchStudents(); // Refresh the list of students
      } else {
        const errorData = await response.json();
        console.error('Error responding to student:', errorData.message);
      }
    } catch (error) {
      console.error('Error responding to student:', error.message);
    }
  };

  const handleViewManuscript = (studentId, channelId) => {
    setSelectedStudentId(studentId);
    setSelectedChannelId(channelId); // Set the correct channelId for the student's manuscript
    setIsEditorOpen(true);
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <h1>Adviser Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <p>Specializations: {user.specializations.join(', ')}</p>
      <img src={`http://localhost:5000/public/uploads/${user.profileImage}`} alt="Profile" />

      <h2>Accepted Students</h2>
      <ul>
        {acceptedStudents.map((student) => (
          <li key={student._id}>
            {student.name}
            <button onClick={() => handleViewManuscript(student._id, student.channelId)}>View Manuscript</button>
          </li>
        ))}
      </ul>

      <h2>Declined Students</h2>
      <ul>
        {declinedStudents.map((student) => (
          <li key={student._id}>
            {student.name}
          </li>
        ))}
      </ul>

      <h2>Pending Students</h2>
      <ul>
        {studentsToManage.map((student) => (
          <li key={student._id}>
            {student.name}
            <button onClick={() => handleStudentResponse(student._id, 'accepted')}>Accept</button>
            <button onClick={() => handleStudentResponse(student._id, 'declined')}>Decline</button>
          </li>
        ))}
      </ul>

      <h2>Panelist Students</h2>
      <ul>
        {panelistStudents.map((student) => (
          <li key={student._id}>
            {student.name}
            <button onClick={() => handleViewManuscript(student._id, student.channelId)}>View Manuscript</button>
          </li>
        ))}
      </ul>

{/*       {isEditorOpen && selectedStudentId && (
        <CkEditorDocuments userId={selectedStudentId} channelId={selectedChannelId} onClose={() => setIsEditorOpen(false)} />
      )} */}

    {isEditorOpen && selectedStudentId && (
      <CkEditorDocuments userId={user._id} channelId={selectedChannelId} onClose={() => setIsEditorOpen(false)} />
    )}


      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardAdviser;
