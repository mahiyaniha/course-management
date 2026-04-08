import React from "react";
import "./Requests.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCircleCheck,
  faCircleXmark,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

const Requests = () => {
  const requests = [
    {
      id: 1,
      courseName: "Algorithms",
      section: 5,
      status: "Pending",
      advisorComment: null,
    },
    {
      id: 2,
      courseName: "Operating Systems",
      section: 12,
      status: "Approved",
      advisorComment: "Good to go",
    },
    {
      id: 3,
      courseName: "Computer Networks",
      section: 13,
      status: "Rejected",
      advisorComment: "Time conflict",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Rejected":
        return "status-rejected";
      case "Pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return faCircleCheck;
      case "Rejected":
        return faCircleXmark;
      case "Pending":
        return faSpinner;
      default:
        return faSpinner;
    }
  };

  return (
    <div className="requests-container">
      {/* 🔥 Header */}
      <div className="header">
        <FontAwesomeIcon icon={faSpinner} className="header-icon" />
        <div className="header-title">My Requests</div>
      </div>

      {/* 📊 Table */}
      <div className="table-container">
        <table className="request-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Section</th>
              <th>Status</th>
              <th>Advisor Comment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td className="course-name">{req.courseName}</td>

                <td>{req.section}</td>

                <td>
                  <span className={`status-badge ${getStatusClass(req.status)}`}>
                    <FontAwesomeIcon icon={getStatusIcon(req.status)} />
                    {req.status}
                  </span>
                </td>

                <td>
                  <div className="cell-inline">
                    <FontAwesomeIcon icon={faComment} className="comment-icon" />
                    {req.advisorComment || "No comment"}
                  </div>
                </td>

                <td>
                  {req.status === "Pending" && (
                    <button className="cancel-btn">Cancel</button>
                  )}

                  {req.status === "Rejected" && (
                    <button className="retry-btn">Retry</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;