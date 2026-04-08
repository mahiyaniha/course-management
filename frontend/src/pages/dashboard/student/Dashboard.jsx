import React from "react";
import "./style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faBookOpen,
  faGraduationCap,
  faClock,
  faCircleCheck,
  faLightbulb,
  faCalendarDays,
  faChartLine,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  // dummy API-like data
  const data = {
    totalCourses: 5,
    totalCredits: 18,
    pending: 2,
    approved: 3,
  };

  const completionPercent = Math.round(
    (data.approved / data.totalCourses) * 100
  );

  const status =
    completionPercent >= 70
      ? "Excellent Progress"
      : completionPercent >= 40
      ? "Good Progress"
      : "Needs Attention";

  const nextAction =
    data.pending > 0
      ? "Review pending course requests"
      : "Explore new courses";

  return (
    <div className="dashboard-container">

      {/* HEADER RESTORED */}
      <div className="header dashboard-header-center">
        <FontAwesomeIcon icon={faChalkboardTeacher} className="header-icon" />
        <div className="header-title">Student Dashboard</div>
        <p className="subtitle">Welcome back! Here is your academic overview</p>
      </div>

      {/* TOP CARDS */}
      <div className="dashboard-grid">

        <div className="dashboard-card">
          <FontAwesomeIcon icon={faBookOpen} className="card-icon blue" />
          <h4>Total Courses</h4>
          <p>{data.totalCourses}</p>
        </div>

        <div className="dashboard-card">
          <FontAwesomeIcon icon={faGraduationCap} className="card-icon purple" />
          <h4>Total Credits</h4>
          <p>{data.totalCredits}</p>
        </div>

        <div className="dashboard-card warning">
          <FontAwesomeIcon icon={faClock} className="card-icon yellow" />
          <h4>Pending</h4>
          <p>{data.pending}</p>
        </div>

        <div className="dashboard-card success">
          <FontAwesomeIcon icon={faCircleCheck} className="card-icon green" />
          <h4>Approved</h4>
          <p>{data.approved}</p>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="dashboard-bottom">

        {/* PROGRESS */}
        <div className="panel">
          <h3>
            <FontAwesomeIcon icon={faChartLine} /> Progress Overview
          </h3>

          <div className="progress-box">
            <p>Course Completion</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
            <span>{completionPercent}% Completed</span>
          </div>

          <div className="status-badge">{status}</div>
        </div>

        {/* SEMESTER INFO */}
        <div className="panel">
          <h3>
            <FontAwesomeIcon icon={faCalendarDays} /> Semester Info
          </h3>

          <div className="info-item">
            <strong>Semester:</strong> Fall 2025
          </div>
          <div className="info-item">
            <strong>Academic Year:</strong> 2025 - 2026
          </div>
          <div className="info-item">
            <strong>Status:</strong> Active
          </div>

          <div className="info-note">
            Keep track of your course completion regularly.
          </div>
        </div>

        {/* ACTION + TIPS */}
        <div className="panel">

          <h3>
            <FontAwesomeIcon icon={faBell} /> Next Action
          </h3>

          <div className="action-box">{nextAction}</div>

          <h3>
            <FontAwesomeIcon icon={faLightbulb} /> Study Tip
          </h3>

          <div className="tip-box">
            Focus on consistency rather than long study sessions.
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
