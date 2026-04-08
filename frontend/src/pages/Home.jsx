import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-navbar">
        <div className="logo-text">SmartCRS</div>
        <div className="nav-links">
          <button className="secondary-btn">Learn More</button>
        </div>
      </div>
      
      <div className="hero">
        <h1 className="title">Welcome to Smart Course Registration System.</h1>
        <p className="description">
          Welcome to the future of course registration. Our intuitive platform streamlines every step - from browsing available courses to submitting requests and tracking approvals in real-time.
          <br/><br/>
          Manage your schedule effortlessly, view your enrolled courses, monitor pending requests, and receive instant notifications.
        </p>
        <div className="hero-buttons">
          <a href="/login" className="primary-btn" style={{textDecoration: 'none', display: 'inline-block'}}>Login</a>
          <a href="/register" className="secondary-btn" style={{textDecoration: 'none', display: 'inline-block', marginLeft: '10px'}}>Register</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
