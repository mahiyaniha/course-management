import React, { useState, useEffect } from "react";
import "./Courses.css";

import CourseModal from "../components/CourseModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";

import {
  FaClock,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";
import toast from "react-hot-toast";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);

  const dummyCourses = [
    { id: 1, courseId: 1, courseName: "Software Engineering", day: "Mon", startTime: "09:00", endTime: "10:30", instructor: "Dr. Rahman", seatLimit: 40, seatTaken: 12 },
    { id: 2, courseId: 1, courseName: "Software Engineering", day: "Wed", startTime: "09:00", endTime: "10:30", instructor: "Dr. Rahman", seatLimit: 40, seatTaken: 20 },

    { id: 3, courseId: 2, courseName: "Database Systems", day: "Tue", startTime: "11:00", endTime: "12:30", instructor: "Prof. Khan", seatLimit: 35, seatTaken: 18 },
    { id: 4, courseId: 2, courseName: "Database Systems", day: "Thu", startTime: "11:00", endTime: "12:30", instructor: "Prof. Khan", seatLimit: 35, seatTaken: 10 },

    { id: 5, courseId: 3, courseName: "Computer Networks", day: "Mon", startTime: "13:00", endTime: "14:30", instructor: "Dr. Ahmed", seatLimit: 30, seatTaken: 22 },
    { id: 6, courseId: 3, courseName: "Computer Networks", day: "Wed", startTime: "13:00", endTime: "14:30", instructor: "Dr. Ahmed", seatLimit: 30, seatTaken: 25 },

    { id: 7, courseId: 4, courseName: "AI Fundamentals", day: "Tue", startTime: "09:00", endTime: "10:30", instructor: "Dr. Saha", seatLimit: 50, seatTaken: 30 },
    { id: 8, courseId: 4, courseName: "AI Fundamentals", day: "Thu", startTime: "09:00", endTime: "10:30", instructor: "Dr. Saha", seatLimit: 50, seatTaken: 35 },
  ];

  useEffect(() => {
    setCourses(dummyCourses);
  }, []);

  // SAFE GROUPING
  const grouped = (courses || []).reduce((acc, item) => {
    if (!acc[item.courseId]) {
      acc[item.courseId] = {
        courseName: item.courseName,
        sections: [],
      };
    }
    acc[item.courseId].sections.push(item);
    return acc;
  }, {});


  const fetchCourse = async () => {
    try {
      console.log("getting courses...")
      const coursesAPI = await fetch("http://localhost:8080/admin/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const resp = await coursesAPI.json();
      if (resp.error) {
        console.error(resp)
        throw new Error(resp.error)
      }
      console.info(resp)
      // setCourses(resp)
    } catch (e) {
        console.error(e.message)
        toast.error("Failed to load courses.")
    }
  }

  useEffect(() => {
    fetchCourse()
  },[])

  return (
    <div className="course-container">

      {/* HEADER */}
      <div className="header">
        <FontAwesomeIcon icon={faChalkboardUser} className="header-icon" />
        <h1 className="header-title">Available Course Sections</h1>
        <p>Browse and explore all active course schedules</p>
      </div>

      {/* BUTTON */}
      <div className="action-area">
        <button className="open-modal-btn" onClick={() => setOpen(true)}>
          View & Request Courses
        </button>
      </div>

      {/* GRID */}
      <div className="grid">
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

      {/* MODAL */}
      <CourseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        sections={courses}
        studentId={8}
      />

    </div>
  );
};

export default Courses;