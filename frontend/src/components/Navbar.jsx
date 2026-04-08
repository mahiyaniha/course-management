import React from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="navbar">

      {/* Logo */}
      <div className="logo">
        <FontAwesomeIcon icon={faBook} className="logo-icon" />
        <span className="logo-text">Course Portal</span>
      </div>

      {/* Links */}
      <div className="nav-links">

        <NavLink to="/dashboard/student#dashboard">Dashboard</NavLink>
        <NavLink to="/dashboard/student#courses">Courses</NavLink>
        <NavLink to="/dashboard/student#my-courses-requests">My Courses & Requests</NavLink>
        <NavLink to="/dashboard/student#schedule">Schedule</NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} className="nav-icon" />
          Logout
        </button>

      </div>

    </div>
  );
};

export default Navbar;
