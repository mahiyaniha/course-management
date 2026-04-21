import React, { useState } from "react";
import "./CreateSectionModal.css";
import toast from "react-hot-toast";

const CreateSectionModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    credits: "",
    code: "",
    seats: "",
    advisor: "",
    status: "",
    department: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRequest = async () => {
    console.log(form);
    toast.success("Course created successfully!");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box modern">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Create Section</h2>
          <button className="close-btn" onClick={() => onClose(false)}>✖</button>
        </div>

        <div className="modal-content">
          <div className="modal-grid">

            <input
              name="title"
              placeholder="Course Title"
              value={form.title}
              onChange={handleChange}
            />

            <input
              name="code"
              placeholder="Course Code (e.g. CS101)"
              value={form.code}
              onChange={handleChange}
            />

            <input
              name="credits"
              placeholder="Credits"
              type="number"
              value={form.credits}
              onChange={handleChange}
            />

            <input
              name="seats"
              placeholder="Total Seats"
              type="number"
              value={form.seats}
              onChange={handleChange}
            />

            {/* Department Select */}
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science</option>
              <option value="EEE">Electrical Engineering</option>
              <option value="BBA">Business Administration</option>
              <option value="ENG">English</option>
            </select>

            {/* Status Select */}
            <select
              name="advisor"
              value={form.advisor}
              onChange={handleChange}
            >
              <option value="">Select Advisor</option>
              <option value="APPROVED">Prof A</option>
              <option value="REJECTED">Prof B</option>
            </select>
          </div>

          <button className="submit-btn" onClick={handleRequest}>
            Create Section
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSectionModal;