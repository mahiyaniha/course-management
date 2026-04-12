import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/student/Dashboard";
import Courses from "./pages/Courses";
import MyCoursesRequests from "./pages/MyCoursesRequests";
import Schedule from "./pages/Schedule";
import AdvisorDashboard from "./pages/dashboard/advisor/index";
import { useEffect } from "react";

// 🔐 Protected Route
function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// 🚀 App Content
function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (window.location.pathname === "/") {
      if (role === "student") {
        navigate("/dashboard", { replace: true });
      } else if (role === "advisor") {
        navigate("/advisor-dashboard", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ✅ STUDENT DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="requests" element={<MyCoursesRequests />} />
        <Route path="schedule" element={<Schedule />} />
      </Route>

      {/* ADVISOR */}
      <Route
        path="/advisor-dashboard"
        element={
          <ProtectedRoute allowedRole="advisor">
            <AdvisorDashboard />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Root App
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;