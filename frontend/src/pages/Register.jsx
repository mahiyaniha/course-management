import React, { useEffect, useState } from "react";
import "./Register.css";
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([])
  const [departmentID, setDepartmentID] = useState()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    departmentId: "",
    role: "student" // ✅ default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const getDepartment = async () => {
    try {
      const loginAPI = await fetch("http://localhost:8080/api/admin/departments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const resp = await loginAPI.json();
      setDepartments(resp)
      if (resp.error) {
        console.error(resp)
        throw new Error(resp.error)
      }
    } catch (e) {
      console.error(e.message)
    }

  }

  useEffect(() => {
    getDepartment()
  }, [])


  const handleDeptChange = (e) => {
    setDepartmentID(e.target.value)
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            departmentId: Number(departmentID),
            role: (formData.role).toLowerCase() // ✅ send role
          })
      }
      );
      const resp = await response.json()
      console.log(resp)

      // ✅ store user info (auto login)
      toast.success("User registered successfully")
      navigate("/login")

    } catch (error) {
      toast.error("Failed to registered.")
    }
  };


  return (
    <div className="register-container">
      <div className="register-card">

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>

          {/* NAME */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* DEPARTMENT */}
          <div className="form-group">
            <label>Department ID</label>
            {departments.length > 0 ?
              <select onChange={handleDeptChange} id="1" name="Computer Science">
                {departments.map(dept => <option key={dept.name} value={dept.id}>{dept.name}</option>)}
              </select>
              : null}
          </div>

          {/* 🔥 ROLE SELECT */}
          <div className="form-group">
            <label>Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="advisor">Advisor</option>
            </select>
          </div>

          <button className="register-btn" type="submit">
            Register
          </button>

        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>

      </div>
    </div>
  );
}