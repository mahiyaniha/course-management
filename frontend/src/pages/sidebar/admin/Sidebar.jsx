import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import useUserDetails from '../../../hooks/useUserDetails';

const Sidebar = () => {
  const { userDetails } = useUserDetails()

  const menuItems = [
    { label: 'Dashboard', path: '/admin-dashboard' },
    { label: 'Profile', path: '/admin-dashboard/profile' },
    { label: 'Manage Course', path: '/admin-dashboard/manage-course' },
    { label: 'Manage Section', path: '/admin-dashboard/manage-section' },
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
          <span className="logo-text">{userDetails?.name}</span>
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
