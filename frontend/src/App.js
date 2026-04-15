import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/student/Dashboard";
import StudentLayout from "./components/sidebar/student/Layout";
import Courses from "./pages/Courses";
import MyCoursesRequests from "./pages/MyCoursesRequests";
import Schedule from "./pages/Schedule";
import AdvisorDashboard from "./pages/dashboard/advisor/index";
import { useEffect } from "react";
import AdminDashboard from "./pages/dashboard/admin";
import StudentProfile from "./pages/profile/student";

import AdminLayout from "./components/sidebar/admin/Layout";
import AdminProfile from "./pages/profile/admin";

import AdvisorLayout from "./components/sidebar/advisor/Layout";
import AdvisorProfile from "./pages/profile/advisor";

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
        navigate("/admin-dashboard", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={ <AdminProfile /> } />
      </Route>


      {/* ✅ STUDENT DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="requests" element={<MyCoursesRequests />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* ADVISOR */}
      <Route
        path="/advisor-dashboard"
        element={
          <ProtectedRoute allowedRole="advisor">
            <AdvisorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdvisorDashboard />} />
        <Route path="profile" element={<AdvisorProfile />} />
      </Route>

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