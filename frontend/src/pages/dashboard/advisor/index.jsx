import React, { useEffect, useMemo, useState } from "react";
import useUserDetails from "../../../hooks/useUserDetails";
import getEnrollmentRequests from "../../../api/enrollment-request/getEnrollmentRequests";
import getEnrollments from "../../../api/getEnrollments";
import "./style.css";

const AdvisorDashboard = () => {
  const { userDetails } = useUserDetails();
  const [requests, setRequests] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const loadDashboard = async () => {
      if (!userDetails?.userId) return;

      try {
        setLoading(true);
        const [requestResp, enrollmentResp] = await Promise.all([
          getEnrollmentRequests(userDetails.userId),
          getEnrollments(userDetails.userId),
        ]);

        setRequests(Array.isArray(requestResp) ? requestResp : []);
        setEnrollments(Array.isArray(enrollmentResp) ? enrollmentResp : []);
      } catch (error) {
        console.error(error);
        setRequests([]);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [userDetails?.userId]);

  const filteredRequests =
    filter === "ALL" ? requests : requests.filter((request) => request.status === filter);

  const stats = useMemo(() => {
    const pending = requests.filter((item) => item.status === "PENDING").length;
    const approved = requests.filter((item) => item.status === "APPROVED").length;
    const activeStudents = new Set(
      enrollments.map((item) => item?.student?.id).filter(Boolean)
    ).size;

    return {
      pending,
      approved,
      activeStudents,
      totalEnrollments: enrollments.length,
    };
  }, [enrollments, requests]);

  return (
    <div className="advisor-dashboard-page">
      <div className="advisor-dashboard-shell">
        <header className="advisor-dashboard-hero">
          <div>
            <span className="advisor-dashboard-kicker">Advisor workspace</span>
            <h2>Advisor Dashboard</h2>
            <p>
              Monitor incoming enrollment activity, keep track of approvals, and review active
              student enrollments from one overview.
            </p>
          </div>

          <div className="advisor-dashboard-summary">
            <div className="advisor-summary-card">
              <strong>{stats.pending}</strong>
              <span>Pending Requests</span>
            </div>
            <div className="advisor-summary-card">
              <strong>{stats.approved}</strong>
              <span>Approved Requests</span>
            </div>
            <div className="advisor-summary-card">
              <strong>{stats.totalEnrollments}</strong>
              <span>Total Enrollments</span>
            </div>
            <div className="advisor-summary-card">
              <strong>{stats.activeStudents}</strong>
              <span>Active Students</span>
            </div>
          </div>
        </header>

        <section className="advisor-filter-bar">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((item) => (
            <button
              key={item}
              className={filter === item ? "advisor-filter-btn active" : "advisor-filter-btn"}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </section>

        <div className="advisor-dashboard-grid">
          <section className="advisor-panel">
            <div className="advisor-panel-header">
              <div>
                <h3>Request Overview</h3>
                <p>Filtered enrollment requests for your review.</p>
              </div>
              <span className="advisor-panel-count">{filteredRequests.length}</span>
            </div>

            <div className="advisor-request-list">
              {loading ? (
                <div className="advisor-empty">Loading dashboard data...</div>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <article key={request.id} className="advisor-request-card">
                    <div className="advisor-request-main">
                      <h4>
                        {request?.student?.user?.firstName} {request?.student?.user?.lastName}
                      </h4>
                      <p>{request?.student?.user?.email}</p>
                    </div>
                    <div className="advisor-request-meta">
                      <span className="advisor-course-chip">{request?.course?.code}</span>
                      <strong>{request?.course?.title}</strong>
                      <span className={`advisor-status-pill ${request?.status?.toLowerCase() || "pending"}`}>
                        {request.status}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="advisor-empty">No requests found for this filter.</div>
              )}
            </div>
          </section>

          <section className="advisor-panel">
            <div className="advisor-panel-header">
              <div>
                <h3>Recent Enrollments</h3>
                <p>Students currently placed into approved sections.</p>
              </div>
              <span className="advisor-panel-count">{enrollments.length}</span>
            </div>

            <div className="advisor-enrollment-list">
              {loading ? (
                <div className="advisor-empty">Loading enrollment data...</div>
              ) : enrollments.length > 0 ? (
                enrollments.slice(0, 6).map((item, index) => (
                  <article
                    key={`${item?.student?.id || "student"}-${item?.section?.id || index}`}
                    className="advisor-enrollment-card"
                  >
                    <div>
                      <h4>
                        {item?.student?.user?.firstName} {item?.student?.user?.lastName}
                      </h4>
                      <p>{item?.section?.course?.title}</p>
                    </div>
                    <div className="advisor-enrollment-meta">
                      <span>{item?.section?.course?.code}</span>
                      <small>
                        {item?.section?.day} · {item?.section?.startTime} - {item?.section?.endTime}
                      </small>
                    </div>
                  </article>
                ))
              ) : (
                <div className="advisor-empty">No enrollments available yet.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
