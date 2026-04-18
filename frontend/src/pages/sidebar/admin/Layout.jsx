import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const AdminLayout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
