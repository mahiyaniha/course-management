import { useEffect, useMemo, useState } from "react";
import "./style.css";
import CreateCourseModal from "../../course/admin/CreateCourseModal";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [advisors, setAdvisors] = useState([]);

  const fetchStudents = async () => {
    try {
      const resp = await fetch("http://localhost:8080/api/student/all");
      const respData = await resp.json();
      if (Array.isArray(respData)) {
        setStudents(respData);
      }
    } catch (e) {
      console.error(e.message);
      setStudents([]);
    }
  };

  const fetchAdvisors = async () => {
    try {
      const resp = await fetch("http://localhost:8080/api/advisor/all");
      const respData = await resp.json();
      if (Array.isArray(respData)) {
        setAdvisors(respData);
      }
    } catch (e) {
      console.error(e.message);
      setAdvisors([]);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchAdvisors();
  }, []);

  const stats = useMemo(
    () => ({
      totalUsers: students.length + advisors.length,
      totalStudents: students.length,
      totalAdvisors: advisors.length,
    }),
    [advisors.length, students.length]
  );

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-hero">
          <div>
            <span className="admin-kicker">Admin workspace</span>
            <h2>Admin Dashboard</h2>
            <p>
              Keep track of platform users, review advisor and student records, and monitor the
              academic system from one place.
            </p>
          </div>

          <div className="admin-summary">
            <div className="admin-summary-card">
              <strong>{stats.totalUsers}</strong>
              <span>Total Active Users</span>
            </div>
            <div className="admin-summary-card">
              <strong>{stats.totalStudents}</strong>
              <span>Students</span>
            </div>
            <div className="admin-summary-card">
              <strong>{stats.totalAdvisors}</strong>
              <span>Advisors</span>
            </div>
          </div>
        </header>

        <div className="admin-grid">
          <section className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>Manage Advisors</h3>
                <p>Advisor directory and contact details.</p>
              </div>
              <span className="admin-count">{advisors.length}</span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {advisors.length > 0 ? (
                    advisors.map((advisor) => (
                      <tr key={advisor?.id}>
                        <td>{advisor?.photo ? "Available" : "None"}</td>
                        <td>{advisor?.user?.firstName}</td>
                        <td>{advisor?.user?.lastName}</td>
                        <td>{advisor?.user?.email}</td>
                        <td>{advisor?.description ?? "None"}</td>
                        <td>{advisor?.address}</td>
                        <td>{advisor?.phone}</td>
                        <td>{advisor?.level}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="admin-empty">No advisors found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>Manage Students</h3>
                <p>Student records and department assignments.</p>
              </div>
              <span className="admin-count">{students.length}</span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student?.id}>
                        <td>{student?.photo ? "Available" : "None"}</td>
                        <td>{student?.user?.firstName}</td>
                        <td>{student?.user?.lastName}</td>
                        <td>{student?.user?.email}</td>
                        <td>{student?.description ?? "None"}</td>
                        <td>{student?.address}</td>
                        <td>{student?.phone}</td>
                        <td>{student?.department?.name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="admin-empty">No students found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
