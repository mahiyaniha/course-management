import React from "react";
import "./MyCourses.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpenReader,
  faUser,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const MyCourses = () => {
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Enrolled":
        return "status-enrolled";
      case "Requested":
        return "status-requested";
      default:
        return "status-default";
    }
  };

  return (
    <div className="mycourses-container">
      {/* 🔥 Header */}
      <div className="header">
        <FontAwesomeIcon icon={faBookOpenReader} className="header-icon" />
        <div className="header-title">My Courses</div>
      </div>

      {/* 📊 Table */}
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
                {/* Course Name */}
                <td className="course-name">{course.courseName}</td>

                {/* Instructor */}
                <td>
                  <div className="cell-inline">
                    <FontAwesomeIcon icon={faUser} className="icon user-icon" />
                    {course.instructor}
                  </div>
                </td>

                {/* Time */}
                <td>
                  <div className="cell-inline">
                    <FontAwesomeIcon icon={faClock} className="icon clock-icon" />
                    {course.time}
                  </div>
                </td>

                {/* Status */}
                <td>
                  <span className={`status-badge ${getStatusClass(course.status)}`}>
                    {course.status}
                  </span>
                </td>

                {/* Action */}
                <td>
                  <button
                    className="drop-btn"
                    disabled={course.status === "Requested"}
                  >
                    Drop
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCourses;