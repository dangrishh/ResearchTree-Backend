import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardAdviser = () => {
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [declinedStudents, setDeclinedStudents] = useState([]);
  const [studentsToManage, setStudentsToManage] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
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
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardAdviser;
