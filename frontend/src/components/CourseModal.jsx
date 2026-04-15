import React, { useState, useEffect } from "react";
import "./CourseModal.css";
import axios from "axios";
import toast from "react-hot-toast";

const CourseModal = ({
  isOpen,
  onClose,
  sections = [],
  studentId = 8,
  existingRequests = [],
}) => {
  const [loadingId, setLoadingId] = useState(null);
  const [localRequests, setLocalRequests] = useState(existingRequests);
  const [availableCourses, setAvailableCourses] = useState([])

  const fetchCourse = async () => {
    try {
      console.log("getting courses...")
      const coursesAPI = await fetch("http://localhost:8080/api/admin/courses", {
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
      setAvailableCourses(resp)
    } catch (e) {
      console.error(e.message)
      toast.error("Failed to load courses.")
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [])



  if (!isOpen) return null;

  // check if already requested
  const isRequested = (sectionId) => {
    return localRequests.some((r) => r.sectionId === sectionId);
  };

  const handleRequest = async (curr_course) => {
    try {
      console.log("curr course: ", curr_course)
      setLoadingId(curr_course.id);

      const resp = await fetch("http://localhost:8080/api/student/add_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "studentId": localStorage.getItem("uniqueId"),
          "courseId": curr_course.id,
          "advisorId": curr_course.advisor.uniqueId,
          "status": "pending"
        })
      });
      const respData = await resp.json();

      // update UI instantly (important for UX)
      setLocalRequests((prev) => [
        ...prev,
        { "sectionId": curr_course.id, status: "pending" },
      ]);

    } catch (err) {
      console.log(err);
      alert("Request failed!");
    } finally {
      setLoadingId(null);
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <h2>Available Course Sections</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* CONTENT */}
        <div className="modal-content">
          {availableCourses && availableCourses.map((c) => (
            <div className="modal-card" key={c.id}>

              <div className="modal-info">
                <h3>Title: {c.title}</h3>

                <p>👨‍🏫 {c.advisor.name}</p>
                <p>📅 {`Course Code: ${c.code}`}</p>
                <p>⏰ {`Dept Name: ${c.department.name}`}</p>
                <p>🪑 {c.availableSeat}/{c.totalSeat}</p>
              </div>

              <button
                className="modal-btn"
                disabled={
                  isRequested(c.id) ||
                  loadingId === c.id ||
                  c.seatTaken >= c.seatLimit
                }
                onClick={() => handleRequest(c)}
              >
                {loadingId === c.id
                  ? "Sending..."
                  : isRequested(c.id)
                    ? "Pending"
                    : c.seatTaken >= c.seatLimit
                      ? "Full"
                      : "Add Course"}
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CourseModal;