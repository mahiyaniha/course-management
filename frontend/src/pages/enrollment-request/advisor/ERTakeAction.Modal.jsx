import React, { useState, useCallback, useEffect } from "react";
import getSectionsByCourseId from "../../../api/getSectionsByCourseId";
import postEnrollmentRequestAction from "../../../api/enrollment-request/postEnrollmentRequestAction";
import toast from "react-hot-toast";

const ERTakeActionModal = ({
  selectedEnrollmentRequest,
  isOpen,
  onClose
}) => {

  console.log(selectedEnrollmentRequest)

  const { course, student } = selectedEnrollmentRequest;
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [actions, setActions] = useState({}); // { sectionId: "APPROVED" | "REJECT" }

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
      })
      if (resp?.error) throw new Error(resp.error);
      console.log("Updated ER: ", resp)
      onClose(true)
      toast.success("Submitted successful");

    } catch (e) {
      console.error(e.message);
      toast.error("Failed to submit.");
    }

  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Request Details</h2>

        {/* Cards */}
        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h3>Student</h3>
            <div>First Name: {student?.user?.firstName}</div>
            <div>Last Name: {student?.user?.lastName}</div>
            <div>Email: {student?.user?.email}</div>
            <div>Department: {student?.department?.name}</div>
            <div>Phone: {student?.phone}</div>
            <div>Address: {student?.address}</div>
          </div>

          <div style={styles.card}>
            <h3>Course</h3>
            <div>Course Title: {course?.title}</div>
            <div>Course Code: {course?.code}</div>
            <div>Credit: {course?.credit}</div>
            <div>Available Seat: {course?.availableSeat}</div>
            <div>Total Seat: {course?.totalSeat}</div>
            <div>Department: {course?.department?.name}</div>
          </div>
        </div>

        <br />

        {/* Table */}
        <h3>Available Sections</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Select</th>
              <th style={styles.th}>Day</th>
              <th style={styles.th}>Start</th>
              <th style={styles.th}>End</th>
              <th style={styles.th}>Taken Seats</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {sections.map((e) => (
              <tr
                key={e.id}
                style={{
                  backgroundColor:
                    selectedSection?.id === e.id ? "#333" : "transparent"
                }}
              >
                {/* RADIO */}
                <td style={styles.td}>
                  <input
                    type="radio"
                    name="section"
                    checked={selectedSection?.id === e.id}
                    onChange={() => setSelectedSection(e)}
                  />
                </td>

                <td style={styles.td}>{e.day}</td>
                <td style={styles.td}>{e.startTime}</td>
                <td style={styles.td}>{e.endTime}</td>
                <td style={styles.td}>
                  {e.seatTaken}/{e.seatLimit}
                </td>

                {/* DROPDOWN */}
                <td style={styles.td}>
                  <select
                    style={styles.select}
                    value={actions[e.id] || ""}
                    onChange={(ev) =>
                      handleDropdownChange(e.id, ev.target.value)
                    }
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

        {/* Buttons */}
        <div style={styles.actions}>
          <button style={styles.cancel} onClick={() => onClose(false)}>
            Cancel
          </button>

          <button style={styles.submit} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#1e1e1e",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "700px"
  },

  cardContainer: {
    display: "flex",
    gap: "10px"
  },

  card: {
    flex: 1,
    background: "#2a2a2a",
    padding: "10px",
    borderRadius: "8px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #444"
  },

  th: {
    border: "1px solid #444",
    padding: "8px",
    background: "#333"
  },

  td: {
    border: "1px solid #444",
    padding: "8px",
    textAlign: "center"
  },

  select: {
    padding: "5px",
    borderRadius: "4px",
    background: "#333",
    color: "white",
    border: "1px solid #555"
  },

  actions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between"
  },

  submit: {
    background: "#1971c2",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  cancel: {
    background: "#555",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default ERTakeActionModal;