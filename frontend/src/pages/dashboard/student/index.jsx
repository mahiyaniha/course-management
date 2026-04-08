import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Dashboard from "./Dashboard";
import Courses from "../../Courses";
import MyCoursesRequests from "../../MyCoursesRequests";
import Schedule from "../../Schedule";

const DashboardLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;

    if (!hash) {
      document.getElementById("dashboard")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      document.getElementById(hash.replace("#", ""))?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [location]);

  return (
    <div className="dashboard-layout">

      <section id="dashboard">
        <Dashboard />
      </section>

      <section id="courses">
        <Courses />
      </section>

      <section id="my-courses-requests">
        <MyCoursesRequests />
      </section>

      <section id="schedule">
        <Schedule />
      </section>

    </div>
  );
};

export default DashboardLayout;