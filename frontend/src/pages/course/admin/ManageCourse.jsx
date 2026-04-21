import { useEffect, useMemo, useState } from "react";
import getCourses from "../../../api/getCourses";
import "../../dashboard/admin/style.css";
import CreateCourseModal from "./CreateCourseModal";

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false)

  const onClose = (val) => {
    setIsOpen(val)
  }

  const fetchCourses = async () => {
    try {
      const resp = await getCourses();
      if (resp?.error) {
        throw new Error(resp.error);
      }
      setCourses(Array.isArray(resp) ? resp : []);
    } catch (e) {
      console.error(e.message);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const stats = useMemo(() => {
    const departments = new Set(courses.map((course) => course?.department?.name).filter(Boolean)).size;
    const advisorCount = new Set(courses.map((course) => course?.advisor?.id).filter(Boolean)).size;
    const totalSeats = courses.reduce((sum, course) => sum + (course?.totalSeat || 0), 0);

    return {
      totalCourses: courses.length,
      departments,
      advisorCount,
      totalSeats,
    };
  }, [courses]);

  const handleCreateCourse = () => {
    setIsOpen(true)
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-hero">
          <div>
            <span className="admin-kicker">Admin workspace</span>
            <h2>Manage Courses</h2>
            <p>Review course catalog details, advisor assignments, department mapping, and seat capacity.</p>
          </div>

          <div className="admin-summary">
            <div className="admin-summary-card">
              <strong>{stats.totalCourses}</strong>
              <span>Total Courses</span>
            </div>
            <div className="admin-summary-card">
              <strong>{stats.departments}</strong>
              <span>Departments</span>
            </div>
            <div className="admin-summary-card">
              <strong>{stats.advisorCount}</strong>
              <span>Advisors</span>
            </div>
          </div>
        </header>

        <div className="admin-create-card">
          <div className="admin-create-content">
            <div>
              <h3>Create New Course</h3>
              <p>Add new courses to the catalog with department and advisor assignment.</p>
            </div>
            <button
              className="admin-create-btn"
              onClick={handleCreateCourse}
            >
              Create Course
            </button>
          </div>
        </div>

        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Course Table</h3>
              <p>{stats.totalSeats} total seats configured across all courses.</p>
            </div>
            <span className="admin-count">{courses.length}</span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Credit</th>
                  <th>Department</th>
                  <th>Advisor</th>
                  <th>Available Seat</th>
                  <th>Total Seat</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course?.id || course?.code}>
                      <td>{course?.code}</td>
                      <td>{course?.title}</td>
                      <td>{course?.credit}</td>
                      <td>{course?.department?.name}</td>
                      <td>{course?.advisor?.user?.firstName} {course?.advisor?.user?.lastName}</td>
                      <td>{course?.availableSeat ?? "None"}</td>
                      <td>{course?.totalSeat}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-danger-btn"
                          onClick={() => window.alert(`Delete action for ${course?.title} is not wired to a backend endpoint yet.`)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="admin-empty">No courses found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {isOpen ? <CreateCourseModal isOpen={isOpen} onClose={onClose} courses={courses} /> : null}
    </div>
  );
};

export default ManageCourse;

