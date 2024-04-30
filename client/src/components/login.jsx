import React, { useState } from 'react';
import axios from 'axios';
import './login.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user'); // Default to user login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('All fields are required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email format');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:4000/api/auth/login`, { email, password, userType });
      console.log(res.data); // Handle token response
      window.localStorage.setItem("token", res.data.token);
      if (userType === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/create');
      }
    } catch (err) {
      console.error(err);
      toast.error('Invalid credentials');
    }
  };

  // const togglePasswordVisibility = () => {
  //   const passwordInput = document.getElementById('password');
  //   if (passwordInput.type === 'password') {
  //     passwordInput.type = 'text';
  //   } else {
  //     passwordInput.type = 'password';
  //   }
  // };

  return (
    <div className="login_container">
      <h1 className='text'>LOGIN PAGE</h1>
      <div className="button-container">
        <button className={`btn_grp ${userType === 'user' ? 'active' : ''}`} onClick={() => setUserType('user')}>User</button>
        <button className={`btn_grp ${userType === 'admin' ? 'active' : ''}`} onClick={() => setUserType('admin')}>Admin</button>
      </div>
      <form onSubmit={handleLogin}>
        <div className='login_form'>
          <input className='login_input' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <div className='password-container'>
            <input id='password' className='login_input' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            {/* <button type='button' className='eye-btn' onClick={togglePasswordVisibility}>👁️</button> */}
          </div>
        </div>
        <button className='btn_login' type="submit">Login</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Login;
