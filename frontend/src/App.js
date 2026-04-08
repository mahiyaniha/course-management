import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./pages/dashboard/student";
import AdvisorDashboard from "./pages/dashboard/advisor";
import { useEffect } from "react";

function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on auth pages only
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  useEffect(() => {

    const role = localStorage.getItem("role");
    if (role !== "") {
      if (role === "student") {
        navigate("/dashboard/student")
      }
      else if (role === "advisor") {
        navigate("/dashboard/advisor")
      }
      else if (role === "admin") {
        navigate("/dashboard/admin")
      }
    }

  }, [])

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ================= HOME ================= */}
        <Route path="/" element={<Home />} />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= STUDENT DASHBOARD ================= */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRole="student">
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* ================= ADVISOR DASHBOARD ================= */}
        <Route
          path="/dashboard/advisor"
          element={
            <ProtectedRoute allowedRole="advisor">
              <AdvisorDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;