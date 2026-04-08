import React, { useState } from "react";
import "./CourseModal.css";
import axios from "axios";

const CourseModal = ({
  isOpen,
  onClose,
  sections = [],
  studentId = 8,
  existingRequests = [],
}) => {
  const [loadingId, setLoadingId] = useState(null);
  const [localRequests, setLocalRequests] = useState(existingRequests);

  if (!isOpen) return null;

  // check if already requested
  const isRequested = (sectionId) => {
    return localRequests.some((r) => r.sectionId === sectionId);
  };

  const handleRequest = async (sectionId) => {
    try {
      setLoadingId(sectionId);

      await axios.post("http://localhost:8080/student/add_request", {
        studentId,
        sectionId,
      });

      // update UI instantly (important for UX)
      setLocalRequests((prev) => [
        ...prev,
        { sectionId, status: "pending" },
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
          {sections.map((c) => (
            <div className="modal-card" key={c.id}>

              <div className="modal-info">
                <h3>{c.courseName || `Course ${c.courseId}`}</h3>

                <p>👨‍🏫 {c.instructor}</p>
                <p>📅 {c.day}</p>
                <p>⏰ {c.startTime} - {c.endTime}</p>
                <p>🪑 {c.seatTaken}/{c.seatLimit}</p>
              </div>

              <button
                className="modal-btn"
                disabled={
                  isRequested(c.id) ||
                  loadingId === c.id ||
                  c.seatTaken >= c.seatLimit
                }
                onClick={() => handleRequest(c.id)}
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