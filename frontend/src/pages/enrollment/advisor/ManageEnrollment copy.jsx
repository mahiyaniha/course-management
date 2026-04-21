import { useEffect, useState, useCallback, useMemo } from "react";
import getEnrollments from "../../../api/getEnrollments";
import useUserDetails from "../../../hooks/useUserDetails";
import "./ManageEnrollment.css";

const ManageEnrollment = () => {
  const { userDetails } = useUserDetails();
  const [enrollments, setEnrollments] = useState([]);

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
                </tr>
              </thead>

              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map((item, index) => (
                    <tr key={`${item?.student?.id || "student"}-${item?.section?.id || index}`}>
                      <td>{item?.student?.user?.firstName}</td>
                      <td>{item?.student?.user?.lastName}</td>
                      <td>{item?.student?.user?.email}</td>
                      <td>{item?.section?.course?.title}</td>
                      <td>{item?.section?.course?.code}</td>
                      <td>{item?.section?.course?.department?.name}</td>
                      <td>{item?.section?.day ?? "None"}</td>
                      <td>{item?.section?.startTime}</td>
                      <td>{item?.section?.endTime}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="advisor-enrollment-empty">
                      No enrollments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManageEnrollment;
