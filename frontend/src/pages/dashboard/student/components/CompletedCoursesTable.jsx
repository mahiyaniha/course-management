import React from "react";

const formatCompletedDate = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CompletedCoursesTable = ({ courses }) => {
  const safeCourses = Array.isArray(courses) ? courses : [];

  if (!safeCourses.length) {
    return (
      <div className="dashboard-empty-state">
        No completed courses available yet.
      </div>
    );
  }

  return (
    <div className="completed-table">
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Credit</th>
            <th>Grade</th>
            <th>Completed Date</th>
          </tr>
        </thead>
        <tbody>
          {safeCourses.map((course, index) => {
            const safeCourse = course && typeof course === "object" ? course : {};
            const courseName =
              typeof safeCourse.courseName === "string" && safeCourse.courseName.trim()
                ? safeCourse.courseName
                : "Unnamed Course";
            const credit = Number(safeCourse.credit) || 0;
            const grade =
              typeof safeCourse.grade === "string" && safeCourse.grade.trim()
                ? safeCourse.grade
                : "N/A";
            const completedAt = safeCourse.completedAt || "";
            const key = `${safeCourse.courseId ?? index}-${completedAt || index}`;

            return (
            <tr key={key}>
              <td>{courseName}</td>
              <td>{credit}</td>
              <td>
                <span className="grade-pill">{grade}</span>
              </td>
              <td>{formatCompletedDate(completedAt)}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedCoursesTable;
