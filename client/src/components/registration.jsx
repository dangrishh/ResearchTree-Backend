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
  });
  const [specializationsOptions, setSpecializationsOptions] = useState([]);
  const [message, setMessage] = useState('');

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
          <option value="panelist">Panelist</option>
        </select>
      </label>
      <br />
      {formData.role === 'adviser' && (
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
      )}
      <br />
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
