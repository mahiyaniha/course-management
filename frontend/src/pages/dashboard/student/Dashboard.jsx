import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faBookOpen,
  faCalendarDays,
  faChartColumn,
  faChartLine,
  faCheckCircle,
  faCircleCheck,
  faClock,
  faExclamationTriangle,
  faGraduationCap,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import StatCard from "./components/StatCard";
import InsightPanel from "./components/InsightPanel";
import CompletedCoursesTable from "./components/CompletedCoursesTable";
import GradeDistributionChart from "./components/GradeDistributionChart";
import "./Dashboard.css";

const API_BASE_URL = "http://localhost:8080";

const defaultOverview = {
  totalCourses: 0,
  totalCredits: 0,
  completedCourses: 0,
  completedCredits: 0,
  completionRate: 0,
  pending: 0,
  approved: 0,
  activeSemester: "Not available",
  cgpa: 0,
};

const defaultDistribution = {
  Aplus: 0,
  A: 0,
  Aminus: 0,
  Bplus: 0,
  B: 0,
  C: 0,
  D: 0,
  F: 0,
};

const resolveStoredStudentId = () => {
  const candidates = [
    localStorage.getItem("uniqueId"),
  ];

  const matchedValue = candidates.find((value) => {
    if (value === null || value === undefined) {
      return false;
    }

    const normalized = String(value).trim().toLowerCase();
    return normalized !== "" && normalized !== "undefined" && normalized !== "null";
  });

  return matchedValue ? String(matchedValue).trim() : "";
};

const sanitizeOverview = (data) => {
  const safeData = data && typeof data === "object" ? data : {};

  return {
    totalCourses: Number(safeData.totalCourses) || 0,
    totalCredits: Number(safeData.totalCredits) || 0,
    completedCourses: Number(safeData.completedCourses) || 0,
    completedCredits: Number(safeData.completedCredits) || 0,
    completionRate: Number(safeData.completionRate) || 0,
    pending: Number(safeData.pending) || 0,
    approved: Number(safeData.approved) || 0,
    activeSemester:
      typeof safeData.activeSemester === "string" && safeData.activeSemester.trim()
        ? safeData.activeSemester
        : defaultOverview.activeSemester,
    cgpa: Number(safeData.cgpa) || 0,
  };
};

const sanitizeCompletedCourses = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((course, index) => {
    const safeCourse = course && typeof course === "object" ? course : {};

    return {
      courseId: safeCourse.courseId ?? `course-${index}`,
      courseName:
        typeof safeCourse.courseName === "string" && safeCourse.courseName.trim()
          ? safeCourse.courseName
          : "Unnamed Course",
      credit: Number(safeCourse.credit) || 0,
      grade:
        typeof safeCourse.grade === "string" && safeCourse.grade.trim()
          ? safeCourse.grade
          : "N/A",
      completedAt: safeCourse.completedAt || "",
    };
  });
};

const sanitizeDistribution = (data) => {
  const safeData = data && typeof data === "object" ? data : {};

  return {
    Aplus: Number(safeData.Aplus) || 0,
    A: Number(safeData.A) || 0,
    Aminus: Number(safeData.Aminus) || 0,
    Bplus: Number(safeData.Bplus) || 0,
    B: Number(safeData.B) || 0,
    C: Number(safeData.C) || 0,
    D: Number(safeData.D) || 0,
    F: Number(safeData.F) || 0,
  };
};

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Student dashboard render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="student-dashboard">
          <div className="student-dashboard__error">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <h2>Dashboard unavailable</h2>
            <p>Something went wrong while rendering the dashboard.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Dashboard = () => {
  const [overview, setOverview] = useState(defaultOverview);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState(defaultDistribution);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [partialWarning, setPartialWarning] = useState("");

  useEffect(() => {
    const studentId = resolveStoredStudentId();
    let isMounted = true;

    if (!studentId) {
      if (isMounted) {
        setError("Student ID was not found. Please login again.");
        setLoading(false);
      }
      return;
    }

    const loadDashboardData = async () => {
      if (isMounted) {
        setLoading(true);
        setError("");
        setPartialWarning("");
      }

      const results = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/student/dashboard/${studentId}`),
        axios.get(`${API_BASE_URL}/api/student/completed_courses/${studentId}`),
        axios.get(`${API_BASE_URL}/api/student/grades/distribution/${studentId}`),
      ]);

      if (!isMounted) {
        return;
      }

      const [dashboardResult, completedResult, distributionResult] = results;

      const dashboardLoaded = dashboardResult.status === "fulfilled";
      const completedLoaded = completedResult.status === "fulfilled";
      const distributionLoaded = distributionResult.status === "fulfilled";

      setOverview(
        dashboardLoaded
          ? sanitizeOverview(dashboardResult.value?.data || defaultOverview)
          : defaultOverview
      );
      setCompletedCourses(
        completedLoaded
          ? sanitizeCompletedCourses(completedResult.value?.data || [])
          : []
      );
      setGradeDistribution(
        distributionLoaded
          ? sanitizeDistribution(distributionResult.value?.data || defaultDistribution)
          : defaultDistribution
      );

      const failedRequests = [dashboardLoaded, completedLoaded, distributionLoaded].filter(
        (loaded) => !loaded
      ).length;

      if (failedRequests === 3) {
        setPartialWarning(
          "Dashboard data could not be loaded from the server right now. Showing empty state for now."
        );
      } else if (failedRequests > 0) {
        setPartialWarning("Some dashboard sections could not be loaded. Showing available data.");
      }

      setLoading(false);
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const completionRate = useMemo(() => {
    const rate = Number(overview.completionRate) || 0;
    return Math.min(Math.max(Math.round(rate), 0), 100);
  }, [overview.completionRate]);

  const cgpa = useMemo(() => {
    const value = Number(overview.cgpa);
    return Number.isFinite(value) ? value.toFixed(2) : "0.00";
  }, [overview.cgpa]);

  const progressMessage = useMemo(() => {
    if (completionRate >= 80) {
      return "Excellent progress. You are moving steadily toward graduation.";
    }

    if (completionRate >= 50) {
      return "Strong momentum. Keep your course planning consistent this semester.";
    }

    return "You are still building momentum. Stay on top of requests and course completion.";
  }, [completionRate]);

  const statusTone =
    overview.pending > overview.approved ? "warning" : "success";

  const statCards = [
    {
      title: "Total Courses",
      value: overview.totalCourses,
      subtitle: "Registered across your program",
      icon: faLayerGroup,
      tone: "slate",
    },
    {
      title: "Total Credits",
      value: overview.totalCredits,
      subtitle: "Credits counted so far",
      icon: faBookOpen,
      tone: "steel",
    },
    {
      title: "Completed Courses",
      value: overview.completedCourses,
      subtitle: "Successfully finished",
      icon: faCircleCheck,
      tone: "success",
    },
    {
      title: "Completed Credits",
      value: overview.completedCredits,
      subtitle: "Credits already secured",
      icon: faGraduationCap,
      tone: "success",
    },
    {
      title: "CGPA",
      value: cgpa,
      subtitle: "Current academic performance",
      icon: faArrowTrendUp,
      tone: "accent",
    },
    {
      title: "Active Semester",
      value: overview.activeSemester || "Not available",
      subtitle: "Current running term",
      icon: faCalendarDays,
      tone: "slate",
    },
  ];

  if (loading) {
    return (
      <div className="student-dashboard">
        <div className="student-dashboard__loading">
          <div className="student-dashboard__spinner" />
          <p>Loading your academic overview...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div className="student-dashboard">
        {error ? (
          <div className="student-dashboard__notice">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{error}</span>
          </div>
        ) : null}

        {partialWarning ? (
          <div className="student-dashboard__notice">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{partialWarning}</span>
          </div>
        ) : null}

        <section className="dashboard-hero">
          <div>
            <div className="dashboard-hero__eyebrow">
              <FontAwesomeIcon icon={faChartLine} />
              <span>Student Overview</span>
            </div>
            <h1>Track your academic progress in one place.</h1>
            <p>
              Monitor credits, graduation progress, request flow, and grade
              performance with a cleaner overview of your student journey.
            </p>
          </div>

          <div className="dashboard-hero__spotlight">
            <div
              className="dashboard-hero__spotlight-ring"
              style={{ "--completion-angle": `${(completionRate / 100) * 360}deg` }}
            >
              <strong>{completionRate}%</strong>
              <span>Completion Rate</span>
            </div>
            <p>{progressMessage}</p>
          </div>
        </section>

        <section className="dashboard-stats">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </section>

        <section className="dashboard-insights">
          <InsightPanel
            title="Program Progress"
            icon={faChartColumn}
            badge={`${completionRate}% completed`}
          >
            <div className="progress-card">
              <div className="progress-card__header">
                <div>
                  <span className="progress-card__label">Degree Completion</span>
                  <strong>{completionRate}%</strong>
                </div>
                <div className="progress-card__meta">
                  <span>{overview.completedCredits} credits earned</span>
                  <span>{overview.totalCredits} total credits</span>
                </div>
              </div>

              <div className="progress-bar" aria-label="Completion progress">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${completionRate}%` }}
                />
              </div>

              <p className="progress-card__message">{progressMessage}</p>
            </div>
          </InsightPanel>

          <InsightPanel
            title="Request Status"
            icon={faClock}
            badge={`${overview.pending + overview.approved} total requests`}
          >
            <div className="request-status">
              <div className={`request-status__card request-status__card--${statusTone}`}>
                <div>
                  <span>Pending Requests</span>
                  <strong>{overview.pending}</strong>
                </div>
                <FontAwesomeIcon icon={faClock} />
              </div>

              <div className="request-status__card request-status__card--success">
                <div>
                  <span>Approved Requests</span>
                  <strong>{overview.approved}</strong>
                </div>
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            </div>
          </InsightPanel>

          <InsightPanel
            title="Grade Distribution"
            icon={faChartColumn}
            badge="Across completed results"
          >
            <GradeDistributionChart distribution={gradeDistribution} />
          </InsightPanel>
        </section>

        <section className="dashboard-table-section">
          <InsightPanel
            title="Completed Courses"
            icon={faGraduationCap}
            badge={`${completedCourses.length} records`}
          >
            <CompletedCoursesTable courses={completedCourses} />
          </InsightPanel>
        </section>
      </div>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;
