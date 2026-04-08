import React from "react";
import "./MyCoursesRequests.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpenReader,
  faSpinner,
  faUser,
  faClock,
  faComment,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const MyCoursesRequests = () => {
  // MyCourses data
  const courses = [
    {
      id: 1,
      courseName: "Data Structures",
      instructor: "Prof. C",
      time: "Tue 11:00 - 12:30",
      status: "Enrolled",
    },
    {
      id: 2,
      courseName: "Algorithms",
      instructor: "Prof. E",
      time: "Mon 13:00 - 14:30",
      status: "Requested",
    },
    {
      id: 3,
      courseName: "Databases",
      instructor: "Prof. K",
      time: "Tue 13:00 - 14:30",
      status: "Enrolled",
    },
    {
      id: 4,
      courseName: "Operating Systems",
      instructor: "Prof. L",
      time: "Thu 09:00 - 10:30",
      status: "Requested",
    },
    {
      id: 5,
      courseName: "Computer Networks",
      instructor: "Prof. M",
      time: "Fri 10:00 - 11:30",
      status: "Enrolled",
    },
  ];

  // Requests data
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

  const getStatusClass = (status, type = 'course') => {
    const classes = {
      course: {
        Enrolled: 'status-enrolled',
        Requested: 'status-requested',
      },
      request: {
        Approved: 'status-approved',
        Rejected: 'status-rejected',
        Pending: 'status-pending',
      }
    };
    return classes[type]?.[status] || 'status-default';
  };

  return (
    <div className="combined-container">
      {/* LEFT: My Courses (60%) */}
      <div className="my-courses-section">
        <div className="section-header">
          <FontAwesomeIcon icon={faBookOpenReader} className="header-icon" />
          <div className="header-title">My Courses</div>
        </div>
        <div className="table-container">
          <table className="course-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="course-name">{course.courseName}</td>
                  <td>
                    <div className="cell-inline">
                      <FontAwesomeIcon icon={faUser} className="icon" />
                      {course.instructor}
                    </div>
                  </td>
                  <td>
                    <div className="cell-inline">
                      <FontAwesomeIcon icon={faClock} className="icon" />
                      {course.time}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(course.status, 'course')}`}>
                      {course.status}
                    </span>
                  </td>
                  <td>
                    <button className="drop-btn" disabled={course.status === "Requested"}>
                      Drop
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT: My Requests (40%) */}
      <div className="requests-section">
        <div className="section-header">
          <FontAwesomeIcon icon={faSpinner} className="header-icon" />
          <div className="header-title">My Requests</div>
        </div>
        <div className="table-container">
          <table className="request-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Section</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="course-name">{req.courseName}</td>
                  <td>{req.section}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(req.status, 'request')}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <div className="cell-inline">
                      <FontAwesomeIcon icon={faComment} className="icon" />
                      {req.advisorComment || "No comment"}
                    </div>
                  </td>
                  <td>
                    {req.status === "Pending" && <button className="cancel-btn">Cancel</button>}
                    {req.status === "Rejected" && <button className="retry-btn">Retry</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesRequests;
