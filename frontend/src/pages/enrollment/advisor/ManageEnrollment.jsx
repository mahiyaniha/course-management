import { useEffect, useState, useCallback, useMemo } from "react";
import getEnrollments from "../../../api/getEnrollments";
import useUserDetails from "../../../hooks/useUserDetails";
import "./ManageEnrollment.css";

const ManageEnrollment = () => {
  const { userDetails } = useUserDetails();
  const [enrollments, setEnrollments] = useState([]);

  // 🔥 NEW STATES ONLY (ADDED)
  const [rowState, setRowState] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    try {
      const resp = await getEnrollments(userDetails?.userId);
      if (resp?.error) {
        throw new Error(resp.error);
      }
      setEnrollments(Array.isArray(resp) ? resp : []);
    } catch (e) {
      console.error(e.message);
      setEnrollments([]);
    }
  }, [userDetails?.userId]);

  useEffect(() => {
    if (userDetails) {
      fetchEnrollments();
    }
  }, [fetchEnrollments, userDetails]);

  const stats = useMemo(() => {
    const uniqueStudents = new Set(enrollments.map((item) => item?.student?.id).filter(Boolean)).size;
    const uniqueCourses = new Set(
      enrollments.map((item) => item?.section?.course?.code).filter(Boolean)
    ).size;

    return {
      total: enrollments.length,
      students: uniqueStudents,
      courses: uniqueCourses,
    };
  }, [enrollments]);

  return (
    <div className="advisor-enrollment-page">
      <div className="advisor-enrollment-shell">

        {/* HEADER (UNCHANGED) */}
        <header className="advisor-enrollment-hero">
          <div>
            <span className="advisor-enrollment-kicker">Advisor workspace</span>
            <h2>Manage Enrollments</h2>
            <p>Review approved student placements, course sections, and active schedules in one table.</p>
          </div>

          <div className="advisor-enrollment-summary">
            <div className="advisor-enrollment-summary-card">
              <strong>{stats.total}</strong>
              <span>Total Enrollments</span>
            </div>
            <div className="advisor-enrollment-summary-card">
              <strong>{stats.students}</strong>
              <span>Students</span>
            </div>
            <div className="advisor-enrollment-summary-card">
              <strong>{stats.courses}</strong>
              <span>Courses</span>
            </div>
          </div>
        </header>

        {/* TABLE */}
        <section className="advisor-enrollment-card">

          <div className="advisor-enrollment-card-header">
            <div>
              <h3>Enrollment Table</h3>
              <p>All student-course assignments under your review.</p>
            </div>
            <span className="advisor-enrollment-count">{enrollments.length}</span>
          </div>

          <div className="advisor-enrollment-table-wrap">
            <table className="advisor-enrollment-table">

              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Course Title</th>
                  <th>Course Code</th>
                  <th>Department</th>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Result</th> {/* 🔥 NEW */}
                </tr>
              </thead>

              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map((item, index) => {
                    const key = `${item?.student?.id}-${item?.section?.id}`;
                    const data = rowState[key] || {};

                    return (
                      <tr key={key}>
                        <td>{item?.student?.user?.firstName}</td>
                        <td>{item?.student?.user?.lastName}</td>
                        <td>{item?.student?.user?.email}</td>
                        <td>{item?.section?.course?.title}</td>
                        <td>{item?.section?.course?.code}</td>
                        <td>{item?.section?.course?.department?.name}</td>
                        <td>{item?.section?.day ?? "None"}</td>
                        <td>{item?.section?.startTime}</td>
                        <td>{item?.section?.endTime}</td>

                        {/* 🔥 RESULT CELL */}
                        <td>
                          {data.submitted ? (
                            <span style={{ color: "green", fontWeight: 600 }}>
                              Submitted ✔
                            </span>
                          ) : (
                            <button
                              className="open-btn"
                              onClick={() => setSelectedRow({ item, key })}
                            >
                              Set Result
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="advisor-enrollment-empty">
                      No enrollments found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </section>

        {/* 🔥 MODAL (NEW ADDITION) */}
        {selectedRow && (
          <div className="modal-overlay">
            <div className="modal-card">

              <h3>Course Result Entry</h3>

              <p>
                <strong>Student:</strong>{" "}
                {selectedRow.item?.student?.user?.firstName}{" "}
                {selectedRow.item?.student?.user?.lastName}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {selectedRow.item?.section?.course?.department?.name}
              </p>

              <p>
                <strong>Course:</strong>{" "}
                {selectedRow.item?.section?.course?.title}
              </p>

              <p className="modal-note">
                Enter CGPA for this course completion
              </p>

              <input
                type="number"
                step="0.01"
                placeholder="Enter CGPA"
                value={rowState[selectedRow.key]?.cgpa || ""}
                onChange={(e) =>
                  setRowState((prev) => ({
                    ...prev,
                    [selectedRow.key]: {
                      ...prev[selectedRow.key],
                      cgpa: e.target.value,
                    },
                  }))
                }
              />

              <div className="modal-actions">

                <button
                  className="submit-btn"
                  onClick={() => {
                    setRowState((prev) => ({
                      ...prev,
                      [selectedRow.key]: {
                        ...prev[selectedRow.key],
                        submitted: true,
                      },
                    }));
                    setSelectedRow(null);
                  }}
                >
                  Submit
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setSelectedRow(null)}
                >
                  Cancel
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageEnrollment;