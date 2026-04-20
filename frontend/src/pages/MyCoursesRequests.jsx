import React, { useEffect, useMemo, useState } from "react";
import {
  FaArrowTrendUp,
  FaBookOpen,
  FaCircleCheck,
  FaClipboardList,
  FaClock,
  FaGraduationCap,
  FaLayerGroup,
} from "react-icons/fa6";
import "./MyCoursesRequestsMain.css";

const STATUS_STYLES = {
  PENDING: "status-pending",
  APPROVED: "status-approved",
  REJECTED: "status-rejected",
};

const DUMMY_MY_COURSES = [
  { courseId: 1, courseName: "Database Systems", credit: 3, completedAt: "", sectionId: 101, grade: "" },
  { courseId: 2, courseName: "Software Engineering", credit: 3, completedAt: "", sectionId: 202, grade: "" },
];

const DUMMY_REQUESTS = [
  {
    id: 1,
    course: { id: 3, code: "CSE201", title: "Data Structures", credit: 3 },
    status: "PENDING",
  },
  {
    id: 2,
    course: { id: 4, code: "CSE460", title: "AI", credit: 3 },
    status: "APPROVED",
  },
];

const DUMMY_COMPLETED = [
  { courseId: 5, courseName: "Networking", credit: 3, completedAt: "2024-05-15", sectionId: 303, grade: "A" },
  { courseId: 6, courseName: "OS", credit: 3, completedAt: "2024-04-20", sectionId: 404, grade: "B+" },
];

const getGradeClassName = (grade = "") => {
  const normalized = grade.toUpperCase();
  if (normalized === "A" || normalized === "A+") return "grade-green";
  if (normalized.startsWith("B")) return "grade-blue";
  if (normalized.startsWith("C")) return "grade-yellow";
  return "grade-red";
};

const formatDate = (value) => {
  if (!value) return "Recently completed";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MyCoursesRequests = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMyCourses(DUMMY_MY_COURSES);
      setRequests(DUMMY_REQUESTS);
      setCompleted(DUMMY_COMPLETED);
      setLoading(false);
      return;
    }

    const fetchJsonArray = async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    };


    const fetchData = async () => {
      try {
        setLoading(true);

        const [myRes, reqRes, compRes] = await Promise.all([
          fetchJsonArray(`http://localhost:8080/api/student/enrollments/${userId}`),
          fetchJsonArray(`http://localhost:8080/api/student/enrollment-requests/${userId}`),
          fetchJsonArray(`http://localhost:8080/api/student/completed_courses/${userId}`),
        ]);

        setMyCourses(myRes.length ? myRes : DUMMY_MY_COURSES);
        setRequests(reqRes.length ? reqRes : DUMMY_REQUESTS);
        setCompleted(compRes.length ? compRes : DUMMY_COMPLETED);
      } catch (error) {
        console.error("Using fallback data for My Courses & Requests:", error);
        setMyCourses(DUMMY_MY_COURSES);
        setRequests(DUMMY_REQUESTS);
        setCompleted(DUMMY_COMPLETED);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalCredits = myCourses.reduce((sum, ele) => sum + (ele.section.course.credit || 0), 0);
    const pendingRequests = requests.filter((item) => item.status === "PENDING").length;
    const completedCredits = completed.reduce((sum, course) => sum + (course.credit || 0), 0);

    return [
      {
        label: "Active courses",
        value: myCourses.length,
        meta: `${totalCredits} credits in progress`,
        icon: <FaBookOpen />,
      },
      {
        label: "Pending requests",
        value: pendingRequests,
        meta: `${requests.length} total request${requests.length === 1 ? "" : "s"}`,
        icon: <FaClock />,
      },
      {
        label: "Completed courses",
        value: completed.length,
        meta: `${completedCredits} credits completed`,
        icon: <FaArrowTrendUp />,
      },
    ];
  }, [completed, myCourses, requests]);

  if (loading) {
    return (
      <div className="courses-dashboard">
        <div className="dashboard-shell dashboard-loading">
          <div className="loading-spinner" />
          <p>Loading your courses dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-dashboard">
      <div className="dashboard-shell">
        <header className="dashboard-hero">
          <div className="hero-copy">
            <div className="hero-eyebrow">Student workspace</div>
            <h1>My Courses &amp; Requests</h1>
            <p>
              Track current enrollments, review request progress, and keep completed coursework in one
              clean dashboard.
            </p>
          </div>

          <div className="hero-summary">
            {stats.map((stat) => (
              <div key={stat.label} className="summary-card">
                <div className="summary-icon">{stat.icon}</div>
                <div>
                  <div className="summary-value">{stat.value}</div>
                  <div className="summary-label">{stat.label}</div>
                  <div className="summary-meta">{stat.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </header>

        <main className="dashboard-grid">
          <section className="dashboard-column">
            <div className="column-header">
              <div className="column-title">
                <span className="column-icon"><FaGraduationCap /></span>
                <div>
                  <h2>My Courses</h2>
                  <p>Current semester enrollments</p>
                </div>
              </div>
              <span className="column-count">{myCourses.length}</span>
            </div>

            <div className="column-content course-grid">
              {myCourses.map((ele) => (
                <article key={`${ele.section.course.id}-${ele.section.course.code}`} className="course-card">
                  <div className="card-topline">
                    <span className="card-chip chip-primary">{ele.status}</span>
                    <span className="credit-pill">{ele.section.course.credit} Credit{ele.section.course.credit === 1 ? "" : "s"}</span>
                  </div>
                  <h3>{ele.section.course.title}</h3>
                  <div className="course-meta">
                    <div className="meta-row">
                      <span className="meta-label">Section</span>
                      <span className="meta-value">#{ele.section.id}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Course ID</span>
                      <span className="meta-value">{ele.section.course.id}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-column">
            <div className="column-header">
              <div className="column-title">
                <span className="column-icon"><FaClipboardList /></span>
                <div>
                  <h2>Course Requests</h2>
                  <p>Enrollment request tracking</p>
                </div>
              </div>
              <span className="column-count">{requests.length}</span>
            </div>

            <div className="column-content request-list">
              {requests.map((request) => (
                <article key={request.id} className="request-card">
                  <div className="request-main">
                    <div className="request-code">{request.course.code}</div>
                    <h3>{request.course.title}</h3>
                    <p>{request.course.credit} credit course</p>
                  </div>
                  <span className={`status-badge ${STATUS_STYLES[request.status] || "status-pending"}`}>
                    {request.status}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-column">
            <div className="column-header">
              <div className="column-title">
                <span className="column-icon"><FaCircleCheck /></span>
                <div>
                  <h2>Completed Courses</h2>
                  <p>Past performance overview</p>
                </div>
              </div>
              <span className="column-count">{completed.length}</span>
            </div>

            <div className="column-content completed-grid">
              {completed.map((course) => (
                <article key={`${course.courseId}-${course.sectionId}`} className="completed-card">
                  <div className="completed-topline">
                    <span className="card-chip chip-muted">
                      <FaLayerGroup />
                      Section {course.sectionId}
                    </span>
                    <span className={`grade-badge ${getGradeClassName(course.grade)}`}>{course.grade || "N/A"}</span>
                  </div>
                  <h3>{course.courseName}</h3>
                  <div className="completed-meta">
                    <div className="meta-row">
                      <span className="meta-label">Completed</span>
                      <span className="meta-value">{formatDate(course.completedAt)}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Credits</span>
                      <span className="meta-value">{course.credit}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default MyCoursesRequests;
