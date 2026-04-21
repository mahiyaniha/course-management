import { useEffect, useMemo, useState } from "react";
import getSections from "../../../api/getSections";
import "../../dashboard/admin/style.css";
import CreateSectionModal from "./CreateSectionModa";

const ManageSection = () => {
  const [sections, setSections] = useState([]);
  const [isOpen, setIsOpen] = useState(false)

  const fetchSections = async () => {
    try {
      const resp = await getSections();
      if (resp?.error) {
        throw new Error(resp.error);
      }
      setSections(Array.isArray(resp) ? resp : []);
    } catch (e) {
      console.error(e.message);
      setSections([]);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const stats = useMemo(() => {
    const days = new Set(sections.map((section) => section?.day).filter(Boolean)).size;
    const totalSeatLimit = sections.reduce((sum, section) => sum + (section?.seatLimit || 0), 0);
    const totalSeatTaken = sections.reduce((sum, section) => sum + (section?.seatTaken || 0), 0);

    return {
      totalSections: sections.length,
      days,
      totalSeatLimit,
      totalSeatTaken,
    };
  }, [sections]);

  const onClose = (val) => {
    setIsOpen(val)
  }

  const handleCreateSection = () => {
    setIsOpen(true)
  };


  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-hero">
          <div>
            <span className="admin-kicker">Admin workspace</span>
            <h2>Manage Sections</h2>
            <p>Monitor section schedules, advisor assignments, and seat usage across the timetable.</p>
          </div>



          <div className="admin-summary">
            <div className="admin-summary-card">
              <strong>{stats.totalSections}</strong>
              <span>Total Sections</span>
            </div>
            <div className="admin-summary-card">
              <strong>{stats.days}</strong>
              <span>Teaching Days</span>
            </div>
            <div className="admin-summary-card">
              <strong>{stats.totalSeatTaken}</strong>
              <span>Seats Taken</span>
            </div>
          </div>
        </header>

        <div className="admin-create-card">
          <div className="admin-create-content">
            <div>
              <h3>Create New Section</h3>
              <p>Add new section to the catalog with department and advisor assignment.</p>
            </div>
            <button
              className="admin-create-btn"
              onClick={handleCreateSection}
            >
              Create Section
            </button>
          </div>
        </div>

        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Section Table</h3>
              <p>{stats.totalSeatLimit} total seats allocated across all sections.</p>
            </div>
            <span className="admin-count">{sections.length}</span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Instructor</th>
                  <th>Department</th>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Seat Limit</th>
                  <th>Seat Taken</th>
                </tr>
              </thead>
              <tbody>
                {sections.length > 0 ? (
                  sections.map((section, index) => (
                    <tr key={`${section?.id || section?.course?.code}-${index}`}>
                      <td>{section?.course?.title}</td>
                      <td>{section?.course?.advisor?.user?.firstName} {section?.course?.advisor?.user?.lastName}</td>
                      <td>{section?.course?.department?.name}</td>
                      <td>{section?.day}</td>
                      <td>{section?.startTime}</td>
                      <td>{section?.endTime}</td>
                      <td>{section?.seatLimit ?? "None"}</td>
                      <td>{section?.seatTaken}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="admin-empty">No sections found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <CreateSectionModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default ManageSection;
