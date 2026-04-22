import React, { useState, useEffect } from "react";
import "./Courses.css";
// import "./CoursesMain.css";
import getAvailableCoursesForStudent from "../../../api/getAvailableCoursesForStudent";
import toast from "react-hot-toast"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";

import {
  FaClock,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";
import postEnrollmentRequestAction from "../../../api/enrollment-request/postEnrollmentRequestAction";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);

  const dummySections = [
    { id: 1, courseId: 1, courseName: "Software Engineering", day: "Mon", startTime: "09:00", endTime: "10:30", instructor: "Dr. Rahman", seatLimit: 40, seatTaken: 12 },
    { id: 2, courseId: 1, courseName: "Software Engineering", day: "Wed", startTime: "09:00", endTime: "10:30", instructor: "Dr. Rahman", seatLimit: 40, seatTaken: 20 },

    { id: 3, courseId: 2, courseName: "Database Systems", day: "Tue", startTime: "11:00", endTime: "12:30", instructor: "Prof. Khan", seatLimit: 35, seatTaken: 18 },
    { id: 4, courseId: 2, courseName: "Database Systems", day: "Thu", startTime: "11:00", endTime: "12:30", instructor: "Prof. Khan", seatLimit: 35, seatTaken: 10 },

    { id: 5, courseId: 3, courseName: "Computer Networks", day: "Mon", startTime: "13:00", endTime: "14:30", instructor: "Dr. Ahmed", seatLimit: 30, seatTaken: 22 },
    { id: 6, courseId: 3, courseName: "Computer Networks", day: "Wed", startTime: "13:00", endTime: "14:30", instructor: "Dr. Ahmed", seatLimit: 30, seatTaken: 25 },

    { id: 7, courseId: 4, courseName: "AI Fundamentals", day: "Tue", startTime: "09:00", endTime: "10:30", instructor: "Dr. Saha", seatLimit: 50, seatTaken: 30 },
    { id: 8, courseId: 4, courseName: "AI Fundamentals", day: "Thu", startTime: "09:00", endTime: "10:30", instructor: "Dr. Saha", seatLimit: 50, seatTaken: 35 },
  ];

  const handleRequest = async (curr_course) => {
    try {
      let pmpt = prompt("Are you sure, you want to enroll in this course?", "No");
      if (pmpt !== null && pmpt.toLowerCase() === "yes") {
        const resp = await postEnrollmentRequestAction({
          userId: localStorage.getItem("userId"),
          courseId: curr_course?.id,
          status: "PENDING",
        })
        if (resp?.error) {
          throw new Error(resp.error);
        }
        console.log(resp)
        toast.success("Request submitted!");
        fetchCourses();
      } else {
        console.log("User cancelled the prompt.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Request failed!");
    }
  };

  const fetchCourses = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const resp = await getAvailableCoursesForStudent(userId);
      if (resp?.error) {
        throw new Error(resp.error);
      }
      setCourses(Array.isArray(resp) ? resp : []);
    } catch (e) {
      console.error(e.message);
      // Fallback to dummy for demo
      setCourses([]);
    }
  };

  // Fetch available courses on mount
  useEffect(() => {
    fetchCourses();
    // Always load sections for grouped display
    setSections(dummySections);
  }, []);

  // SAFE GROUPING
  const grouped = (sections || []).reduce((acc, item) => {
    if (!acc[item.courseId]) {
      acc[item.courseId] = {
        courseName: item.courseName,
        sections: [],
      };
    }
    acc[item.courseId].sections.push(item);
    return acc;
  }, {});

  return (
    <div className="courses-main">
      <div className="course-container">

        {/* HEADER */}
        <div className="header">
          <FontAwesomeIcon icon={faChalkboardUser} className="header-icon" />
          <h1 className="header-title">Available Course Sections</h1>
          <p>Browse and explore all active course schedules</p>
        </div>

        {/* AVAILABLE COURSES TABLE */}
        {courses.length > 0 && (
          <div className="courses-table-section">
            <h2>Available Courses</h2>
            <div className="table-container">
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Code</th>
                    <th>Advisor</th>
                    <th>Department</th>
                    <th>Available/Total Seats</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.code}</td>
                      <td>{course.advisor?.user?.firstName} {course.advisor?.user?.lastName}</td>
                      <td>{course.department?.name}</td>
                      <td>{course.availableSeat}/{course.totalSeat}</td>
                      <td>
                        {(course.status === "ACTIVE" || course.status === "COMPLETED") || course.status === "REQUEST_PENDING" ?
                          <div>{course.status}</div> :
                          <button
                            className="request-btn"
                            onClick={() => handleRequest(course)}
                          >
                            Request
                          </button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GROUPED SECTIONS GRID */}
        <div className="sections-grid">
          {Object.entries(grouped).map(([courseId, data]) => (
            <div className="card" key={courseId}>

              <div className="card-header">
                {data.courseName}
              </div>

              {data.sections.map((c) => (
                <div className="section" key={c.id}>

                  <div className="row">
                    <FaCalendarAlt />
                    {c.day}
                  </div>

                  <div className="row">
                    <FaClock />
                    {c.startTime} - {c.endTime}
                  </div>

                  <div className="row">
                    <FaChalkboardTeacher />
                    {c.instructor}
                  </div>

                  <div className="row">
                    <FaUsers />
                    {c.seatTaken}/{c.seatLimit} seats
                  </div>

                  <div className="bar">
                    <div
                      className="fill"
                      style={{
                        width: `${(c.seatTaken / c.seatLimit) * 100}%`,
                      }}
                    />
                  </div>

                </div>
              ))}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Courses;

