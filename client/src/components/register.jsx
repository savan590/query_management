
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      toast.error('All fields are required');
      return;
    }
    try {
      await axios.post('http://localhost:4000/api/auth/register', { email, password,username});
      window.localStorage.setItem("username", username);
      navigate('/login');
    } catch (error) {
      toast.error('Registration error:', error);
    }
  };

  return (
    <div>
      <form className='register_form' onSubmit={handleSubmit}>
        <h1 className='reg_text'>Register</h1>
        <label>Username:</label>
        <input
          type="text"
          className='reg_input'
          required
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
        <label>Email:</label>
        <input
          className='reg_input'
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          className='reg_input'
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='reg_btn'>Register</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default Register;
