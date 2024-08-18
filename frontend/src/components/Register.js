import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import '../styles/Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!email || !password || !username || !age) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    if (isNaN(age) || age < 18) {
      setErrorMessage('Age must be a number and at least 18.');
      return;
    }

    try {
      const response = await axios.post('/register', { email, password, username, age });
      if (response.data.success) {
        navigate('/'); // Redirect to homepage after successful registration
      } else {
        setErrorMessage('Registration failed.');
      }
    } catch (error) {
      setErrorMessage('Error during registration.');
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
