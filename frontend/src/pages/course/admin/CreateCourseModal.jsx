import React, { useState, useEffect } from "react";
import "./CreateCourseModal.css";
import toast from "react-hot-toast";
import getDepartments from "../../../api/getDepartments";
import getAdvisors from "../../../api/getAdvisors";
import postNewCourse from "../../../api/postNewCourse";

const CreateCourseModal = ({ isOpen, onClose, courses }) => {
  const [departments, setDepartments] = useState([])
  const [advisors, setAdvisors] = useState([])

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


  const createCourse = async (reqData) => {
    try {
      const resp = await postNewCourse({ data: reqData }) ;
      if (resp?.error) {
        throw new Error(resp.error);
      }
      toast.success("Course created successfully!");
      onClose(false)

    } catch (e) {
      console.error(e.message);
      setDepartments([]);
    }
  };

  const handleRequest = async () => {
    if (form.title !== "" &&
      form.credits !== 0 &&
      form.code !== "" &&
      form.seats !== 0 &&
      form.advisor !== "" &&
      form.department !== "") {

      // Check course code already exists or not
      const duplicateCourseCode = courses.filter(ele => ele.code.toLowerCase() === form.code.toLowerCase());
      if (duplicateCourseCode && duplicateCourseCode.length > 0) {
        toast.error("Found duplicate course code");
        return;
      }

      const advisorObj = advisors.find(ele => ele.id === Number(form.advisor));
      const deptObj = departments.find(ele => ele.id === Number(form.department))
      const reqData = {
        title: form.title,
        code: form.code,
        totalSeat: form.seats,
        department: deptObj,
        advisor: advisorObj,
        credit: form.credits
      }

      if (advisorObj && deptObj) {
        createCourse(reqData)

      } else {
        toast.error("Advisor or Department not found!")
        return
      }

    } else {
      toast.error("Please fill out all the value!");
    }


  };

  const fetchDepartments = async () => {
    try {
      const resp = await getDepartments();
      if (resp?.error) {
        throw new Error(resp.error);
      }
      setDepartments(Array.isArray(resp) ? resp : []);
    } catch (e) {
      console.error(e.message);
      setDepartments([]);
    }
  };

  const fetchAdvisors = async () => {
    try {
      const resp = await getAdvisors();
      if (resp?.error) {
        throw new Error(resp.error);
      }
      setAdvisors(Array.isArray(resp) ? resp : []);
    } catch (e) {
      console.error(e.message);
      setAdvisors([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchAdvisors()
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box modern">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Create Course</h2>
          <button className="close-btn" onClick={() => onClose(false)}>✖</button>
        </div>

        <div className="modal-content">
          <div className="modal-grid">

            <input
              required
              name="title"
              placeholder="Course Title"
              value={form.title}
              onChange={handleChange}
            />

            <input
              required
              name="code"
              placeholder="Course Code (e.g. CS101)"
              value={form.code}
              onChange={handleChange}
            />

            <input
              required
              name="credits"
              placeholder="Credits"
              type="number"
              value={form.credits}
              onChange={handleChange}
            />

            <input
              required
              name="seats"
              placeholder="Total Seats"
              type="number"
              value={form.seats}
              onChange={handleChange}
            />



            <div className="form-group">
              <label>Select Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
              >
                <option key="select" value="">Select Department</option>
                {departments.map(ele => (
                  <option key={ele.id} value={ele.id}>
                    {ele.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Advisor</label>
              <select
                name="advisor"
                value={form.advisor}
                onChange={handleChange}
              >
                <option key="select" value="">Select Advisor</option>
                {advisors.map(ele => (
                  <option key={ele.id} value={ele.id}>
                    {ele.user.firstName} {ele.user.lastName}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <button className="submit-btn" onClick={handleRequest}>
            Create Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseModal;