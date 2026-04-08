import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const redirectUserByRole = (userRole) => {
    switch(userRole) {
      case "admin":
        navigate("/dashboard/admin")
        break;
      case "advisor":
        navigate("/dashboard/advisor")
        break;
      case "student":
        navigate("/dashboard/student")
        break;
      default:
        break;
    }

  }

  const handleLogin = async (e) => {
    try {
      if (username === "" || password === "") {
        throw new Error("Login failed. Please try again.")
      }

      console.log("login calling...")
      const loginAPI = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });
      const resp = await loginAPI.json();
      if (resp.error) {
        console.error(resp)
        throw new Error(resp.error)
      }
      toast.success(resp.message)
      localStorage.setItem("role", resp.role)
      redirectUserByRole(resp.role)

    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{ color: '#e0e1dd', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.8rem' }}>Login to Smart Course Registration System</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleLogin} className="login-btn">Login</button>
        </form>
        <p className="register-link">
          No account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
