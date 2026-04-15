import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Courses', path: '/dashboard/courses' },
    { label: 'My Courses & Requests', path: '/dashboard/requests' },
    { label: 'Schedule', path: '/dashboard/schedule' },
    { label: 'Profile', path: '/dashboard/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("uniqueId");
    localStorage.removeItem("authEmail");
    localStorage.removeItem("role");
    window.location.href = '/';
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">Course Portal</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
