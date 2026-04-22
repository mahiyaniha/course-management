import { useEffect, useMemo, useState } from "react";
import "./style.css";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [advisors, setAdvisors] = useState([]);

  const fetchStudents = async () => {
    try {
      const resp = await fetch("http://localhost:8080/api/student/all");
      const respData = await resp.json();
      if (Array.isArray(respData)) setStudents(respData);
    } catch (e) {
      console.error(e.message);
      setStudents([]);
    }
  };

  const fetchAdvisors = async () => {
    try {
      const resp = await fetch("http://localhost:8080/api/advisor/all");
      const respData = await resp.json();
      if (Array.isArray(respData)) setAdvisors(respData);
    } catch (e) {
      console.error(e.message);
      setAdvisors([]);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchAdvisors();
  }, []);

  // ✅ Toggle handler
  const handleToggle = async (type, id, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const url =
        type === "advisor"
          ? `http://localhost:8080/api/advisor/status/${id}`
          : `http://localhost:8080/api/student/status/${id}`;

      await fetch(url, { method: "PUT", body: newStatus },);

      // refresh
      type === "advisor" ? fetchAdvisors() : fetchStudents();
    } catch (e) {
      console.error(e);
    }
  };

  const stats = useMemo(
    () => ({
      totalUsers: students.length + advisors.length,
      totalStudents: students.length,
      totalAdvisors: advisors.length,
    }),
    [students.length, advisors.length]
  );

  return (
    <div className="admin-page">
      <div className="admin-shell">

        {/* HEADER */}
        <header className="admin-hero">
          <div>
            <span className="admin-kicker">Admin workspace</span>
            <h2>Admin Dashboard</h2>
            <p>Manage users and control platform activity.</p>
          </div>

          <div className="admin-summary">
            <div className="admin-summary-card">
              <strong>{stats.totalUsers}</strong>
              <span>Total Users</span>
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

          {/* ADVISORS */}
          <section className="admin-card">
            <div className="admin-card-header">
              <h3>Manage Advisors</h3>
              <span className="admin-count">{advisors.length}</span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>First</th>
                    <th>Last</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Level</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {advisors.map((a) => (
                    <tr key={a.id}>
                      <td>{a.user?.firstName}</td>
                      <td>{a.user?.lastName}</td>
                      <td>{a.user?.email}</td>
                      <td>{a.phone}</td>
                      <td>{a.level}</td>

                      {/* SWITCH */}
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={a.status.toUpperCase() === "ACTIVE"}
                            onChange={() => handleToggle("advisor", a.id, a?.status.toUpperCase())}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* STUDENTS */}
          <section className="admin-card">
            <div className="admin-card-header">
              <h3>Manage Students</h3>
              <span className="admin-count">{students.length}</span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>First</th>
                    <th>Last</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.user?.firstName}</td>
                      <td>{s.user?.lastName}</td>
                      <td>{s.user?.email}</td>
                      <td>{s.phone}</td>
                      <td>{s.department?.name}</td>

                      {/* SWITCH */}
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={s?.status?.toUpperCase() === "ACTIVE"}
                            onChange={() => handleToggle("student", s.id, s?.status.toUpperCase())}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                    </tr>
                  ))}
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