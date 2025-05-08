// src/components/Login.jsx
import React, { useState } from 'react';
import './Login.css'; // Import the CSS file
import axios from 'axios';
import { toast } from 'react-toastify';
import { Img2 } from '../../assets';

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async(e) => {
    e.preventDefault();

    console.log('Email:', email);
    console.log('Password:', password);
    try{

      if(email === 'admin@gmail.com' && password === 'admin'){
        toast.success('login successfully')
        window.location.href='/admin'
      }else{
        const response = await axios.post('http://localhost:5000/login',{
          email:email,
          password:password
        });
        console.log(response)
                toast.success('Login successfully');
        window.localStorage.setItem("loginUser",response.data.user.user);
        window.location.href='/users'
  
      }
      closeModal();
    }catch(error){
      console.log(error)
      toast.error('invalid data')
    }
  };

  return (
    <div className="login-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">Home Automation</h1>
        <button className="login-button" onClick={openModal}>
          Login
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <img
          src={ Img2 }
          alt="AutoAdapt"
          className="dashboard-image"
        />
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Home Automation.All rights reserved.</p>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Login</h2>
            <form onSubmit={handleLogin} className="modal-form">
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Login
                </button>
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
