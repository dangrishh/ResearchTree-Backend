import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    profileImage: null,
    specializations: [],
    course: '', // For student course
    year: '', // For student year
    handleNumber: '', // For adviser handle number
  });
  const [specializationsOptions, setSpecializationsOptions] = useState([]);
  const [message, setMessage] = useState('');

  // Generate years from 1900 to 2100
  const startYear = 1900;
  const endYear = 2100;
  const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
    value: startYear + i,
    label: startYear + i,
  }));

  const courseOptions = [
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BSCS', label: 'BSCS' },
  ];

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/advicer/specializations');
        setSpecializationsOptions(response.data.map(spec => ({ value: spec.name, label: spec.name })));
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    fetchSpecializations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSpecializationsChange = (selectedOptions) => {
    setFormData({ ...formData, specializations: selectedOptions.map(option => option.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);
    data.append('profileImage', formData.profileImage);
    data.append('specializations', JSON.stringify(formData.specializations));
    data.append('course', formData.course);
    data.append('year', formData.year);
    data.append('handleNumber', formData.handleNumber);

    try {
      const response = await axios.post('http://localhost:5000/api/advicer/register', data);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error.response.data);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Role:
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="student">Student</option>
          <option value="adviser">Adviser</option>
        </select>
      </label>
      <br />

      {/* If role is student, show course and year fields */}
      {formData.role === 'student' && (
        <>
          <label>
            Course:
            <select name="course" value={formData.course} onChange={handleChange} required>
              {courseOptions.map((course) => (
                <option key={course.value} value={course.value}>{course.label}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Year:
            <select name="year" value={formData.year} onChange={handleChange} required>
              {yearOptions.map((year) => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
          </label>
          <br />
        </>
      )}

      {/* If role is adviser, show specializations and handle number fields */}
      {formData.role === 'adviser' && (
        <>
          <label>
            Specializations:
            <Select
              isMulti
              name="specializations"
              options={specializationsOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleSpecializationsChange}
            />
          </label>
          <br />
          <label>
            Handle Number (No. of Advisees):
            <input
              type="number"
              name="handleNumber"
              value={formData.handleNumber}
              onChange={handleChange}
              required
            />
          </label>
          <br />
        </>
      )}

      <label>
        Profile Image:
        <input type="file" name="profileImage" onChange={handleFileChange} />
      </label>
      <br />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default Register;
