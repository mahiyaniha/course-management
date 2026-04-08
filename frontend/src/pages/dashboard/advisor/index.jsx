import React, { useEffect, useState } from "react";
import "./style.css";

const AdvisorDashboard = () => {
  // =========================
  // DUMMY DATA (NO BACKEND)
  // =========================
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [notifications, setNotifications] = useState([]);

  // =========================
  // LOAD DUMMY DATA
  // =========================
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        studentId: 101,
        studentName: "Mahiya Akter Niha",
        courseName: "Object Oriented Programming",
        courseCode: "CSE221",
        status: "PENDING",
      },
      {
        id: 2,
        studentId: 102,
        studentName: "Rahim Uddin",
        courseName: "Database Management",
        courseCode: "CSE311",
        status: "APPROVED",
      },
      {
        id: 3,
        studentId: 103,
        studentName: "Nusrat Jahan",
        courseName: "Data Structures",
        courseCode: "CSE210",
        status: "REJECTED",
      },
    ];

    setRequests(dummyData);

    // fake notification
    setNotifications([
      { id: 1, msg: "New course request from Rahim" },
      { id: 2, msg: "New request from Nusrat" },
    ]);
  }, []);

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredRequests =
    filter === "ALL"
      ? requests
      : requests.filter((r) => r.status === filter);

  return (
    <div className="advisor-container">

      {/* =========================
          TOP BAR
      ========================= */}
      <div className="top-bar">
        <h2>Advisor Dashboard</h2>

        {/* NOTIFICATIONS */}
        <div className="bell">
          🔔
          {notifications.length > 0 && (
            <span className="badge">{notifications.length}</span>
          )}

          <div className="dropdown">
            {notifications.map((n) => (
              <div key={n.id} className="note">
                {n.msg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================
          FILTER BUTTONS
      ========================= */}
      <div className="filter-bar">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active-filter" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* =========================
          REQUEST GRID
      ========================= */}
      <div className="grid">
        {filteredRequests.map((req) => (
          <div key={req.id} className="card">

            <h3>{req.studentName}</h3>

            <p><b>Course:</b> {req.courseName}</p>
            <p><b>Code:</b> {req.courseCode}</p>

            <p className={`status ${req.status}`}>
              {req.status}
            </p>

            <button onClick={() => setSelectedStudent(req)}>
              👤 Student Profile
            </button>

            <button onClick={() => setSelectedRequest(req)}>
              📄 Open Request
            </button>
          </div>
        ))}
      </div>

      {/* =========================
          STUDENT PROFILE MODAL
      ========================= */}
      {selectedStudent && (
        <div className="modal">
          <div className="modal-box">
            <h3>👤 Student Profile</h3>

            <p><b>Name:</b> {selectedStudent.studentName}</p>
            <p><b>ID:</b> {selectedStudent.studentId}</p>

            <button onClick={() => setSelectedStudent(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* =========================
          REQUEST MODAL
      ========================= */}
      {selectedRequest && (
        <div className="modal">
          <div className="modal-box">

            <h3>📄 Request Details</h3>

            <p><b>Student:</b> {selectedRequest.studentName}</p>
            <p><b>Course:</b> {selectedRequest.courseName}</p>
            <p><b>Code:</b> {selectedRequest.courseCode}</p>

            <textarea
              placeholder="Write comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="modal-actions">
              <button className="approve">
                Approve (UI only)
              </button>

              <button className="reject">
                Reject (UI only)
              </button>

              <button onClick={() => setSelectedRequest(null)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdvisorDashboard;