import React, { useEffect, useState } from "react";
import "./Register.css";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import postNewAccount from "../../api/postNewAccount";
import getDepartments from "../../api/getDepartments";

export default function Register() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    departmentId: "",
    role: "student"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const fetchDepartments = async () => {
    try {
      const resp = await getDepartments();
      if (resp?.error) {
        throw new Error(resp.error);
      }
      setDepartments(Array.isArray(resp) ? resp : []);
    } catch (e) {
      console.error(e.message);
      setDepartments([]);
    }
  };


  useEffect(() => {
    fetchDepartments()
  }, [])


  const handleRegister = async (e) => {
    console.log(formData)
    e.preventDefault();

    if (formData.departmentID === "") {
      toast.error("Invalid Department ID")
      return;
    }
    // find department obj using dept id
    const deptObj = departments.find(ele => ele.id === Number(formData.departmentId))
    try {
      const reqData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        department: deptObj,
        role: (formData.role).toLowerCase()
      }
      const resp = await postNewAccount({ data: reqData })

      if (resp?.error) {
        throw new Error(resp.error);
      }
      toast.success("User registered successfully")
      navigate("/login")

    } catch (e) {
      console.error(e.message);
    }
  };


  return (
    <div className="register-container">
      <div className="register-card">

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>

          {/* First Name */}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {/* LAST NAME */}
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
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
              <select value={formData.departmentId} name="departmentId" onChange={handleChange}>
                {departments.map(dept => <option key={dept.name} value={dept.id}>{dept.fullName}</option>)}
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