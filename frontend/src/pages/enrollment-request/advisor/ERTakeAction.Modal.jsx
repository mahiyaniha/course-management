import React, { useState, useCallback, useEffect } from "react";
import getSectionsByCourseId from "../../../api/getSectionsByCourseId";
import postEnrollmentRequestAction from "../../../api/enrollment-request/postEnrollmentRequestAction";
import toast from "react-hot-toast";
import "./ManageEnrollmentRequest.css";

const ERTakeActionModal = ({
  selectedEnrollmentRequest,
  isOpen,
  onClose
}) => {
  const { course, student } = selectedEnrollmentRequest;
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [actions, setActions] = useState({});

  const fetchSectionByCourse = useCallback(async () => {
    try {
      const resp = await getSectionsByCourseId(course?.id);
      if (resp?.error) throw new Error(resp.error);
      if (resp) setSections(resp);
    } catch (e) {
      console.error(e.message);
    }
  }, [course]);

  useEffect(() => {
    if (course?.id) fetchSectionByCourse();
  }, [fetchSectionByCourse, course]);

  const handleDropdownChange = (sectionId, value) => {
    setActions((prev) => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSection) {
      alert("Please select a section");
      return;
    }

    const action = actions[selectedSection?.id];
    if (!action) {
      alert("Please select an action for the chosen section");
      return;
    }

    try {
      const resp = await postEnrollmentRequestAction({
        enrollmentRequestId: selectedEnrollmentRequest?.id,
        courseId: course?.id,
        sectionId: selectedSection?.id,
        status: action,
        studentId: student?.id
      });
      if (resp?.error) throw new Error(resp.error);
      onClose(true);
      toast.success("Submitted successful");
    } catch (e) {
      console.error(e.message);
      toast.error("Failed to submit.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="er-modal-overlay" onClick={() => onClose(false)}>
      <div className="er-modal" onClick={(e) => e.stopPropagation()}>
        <div className="er-modal-header">
          <div>
            <h2>Request Details</h2>
            <p>Review the student, compare sections, then approve or reject the request.</p>
          </div>
          <button className="er-modal-close" onClick={() => onClose(false)}>
            Close
          </button>
        </div>

        <div className="er-modal-cards">
          <div className="er-info-card">
            <h3>Student</h3>
            <div className="er-info-grid">
              <div><span>First Name</span><strong>{student?.user?.firstName}</strong></div>
              <div><span>Last Name</span><strong>{student?.user?.lastName}</strong></div>
              <div><span>Email</span><strong>{student?.user?.email}</strong></div>
              <div><span>Department</span><strong>{student?.department?.name}</strong></div>
              <div><span>Phone</span><strong>{student?.phone}</strong></div>
              <div><span>Address</span><strong>{student?.address}</strong></div>
            </div>
          </div>

          <div className="er-info-card">
            <h3>Course</h3>
            <div className="er-info-grid">
              <div><span>Course Title</span><strong>{course?.title}</strong></div>
              <div><span>Course Code</span><strong>{course?.code}</strong></div>
              <div><span>Credit</span><strong>{course?.credit}</strong></div>
              <div><span>Available Seat</span><strong>{course?.availableSeat}</strong></div>
              <div><span>Total Seat</span><strong>{course?.totalSeat}</strong></div>
              <div><span>Department</span><strong>{course?.department?.name}</strong></div>
            </div>
          </div>
        </div>

        <div className="er-sections-block">
          <div className="er-sections-head">
            <h3>Available Sections</h3>
            <span>{sections.length} options</span>
          </div>

          <div className="er-table-wrap">
            <table className="er-table er-table-modal">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Taken Seats</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {sections.map((section) => (
                  <tr
                    key={section.id}
                    className={selectedSection?.id === section.id ? "er-row-selected" : ""}
                  >
                    <td>
                      <input
                        type="radio"
                        name="section"
                        checked={selectedSection?.id === section.id}
                        onChange={() => setSelectedSection(section)}
                      />
                    </td>
                    <td>{section.day}</td>
                    <td>{section.startTime}</td>
                    <td>{section.endTime}</td>
                    <td>{section.seatTaken}/{section.seatLimit}</td>
                    <td>
                      <select
                        className="er-select"
                        value={actions[section.id] || ""}
                        onChange={(ev) => handleDropdownChange(section.id, ev.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="APPROVED">Approve</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="er-modal-actions">
          <button className="er-btn er-btn-secondary" onClick={() => onClose(false)}>
            Cancel
          </button>
          <button className="er-btn er-btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ERTakeActionModal;
