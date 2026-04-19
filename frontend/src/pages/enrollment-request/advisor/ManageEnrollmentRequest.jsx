import { useEffect, useState, useCallback } from "react";
import getEnrollmentRequests from "../../../api/enrollment-request/getEnrollmentRequests";
import useUserDetails from "../../../hooks/useUserDetails";
import ERTakeActionModal from "./ERTakeAction.Modal";
import "./ManageEnrollmentRequest.css";

const statusConfig = {
  PENDING: {
    title: "Pending Requests",
    description: "Enrollment requests waiting for your decision.",
    badgeClass: "er-status-badge er-status-pending",
    countClass: "er-count er-count-pending",
  },
  APPROVED: {
    title: "Approved Requests",
    description: "Requests you have already approved.",
    badgeClass: "er-status-badge er-status-approved",
    countClass: "er-count er-count-approved",
  },
  REJECTED: {
    title: "Rejected Requests",
    description: "Requests that were declined.",
    badgeClass: "er-status-badge er-status-rejected",
    countClass: "er-count er-count-rejected",
  },
};

const ManageEnrollmentRequest = () => {
  const { userDetails } = useUserDetails();

  const [pendingData, setPendingData] = useState([]);
  const [approvedData, setApprovedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);

  const [selectedEnrollmentRequest, setSelectedEnrollmentRequest] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const filterByStatus = (resp, status) => resp.filter((ele) => ele.status === status);

  const fetchEnrollmentRequests = useCallback(async () => {
    try {
      const resp = await getEnrollmentRequests(userDetails?.userId);
      if (resp?.error) throw new Error(resp.error);

      setPendingData(filterByStatus(resp, "PENDING"));
      setApprovedData(filterByStatus(resp, "APPROVED"));
      setRejectedData(filterByStatus(resp, "REJECTED"));
    } catch (e) {
      console.error(e.message);
    }
  }, [userDetails?.userId]);

  useEffect(() => {
    if (userDetails) fetchEnrollmentRequests();
  }, [fetchEnrollmentRequests, userDetails]);

  const handleClick = (ele) => {
    setSelectedEnrollmentRequest(ele);
    setIsOpen(true);
  };

  const onClose = (actionTaken) => {
    if (actionTaken) {
      fetchEnrollmentRequests();
    }
    setIsOpen(false);
    setSelectedEnrollmentRequest(null);
  };

  const renderTable = (data, status, showAction = false) => {
    const config = statusConfig[status];

    return (
      <section className="er-card">
        <div className="er-card-header">
          <div>
            <h3>{config.title}</h3>
            <p>{config.description}</p>
          </div>
          <span className={config.countClass}>{data.length}</span>
        </div>

        <div className="er-table-wrap">
          <table className="er-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Code</th>
                <th>Department</th>
                <th>Status</th>
                {showAction ? <th>Action</th> : null}
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td>{item?.student?.user?.firstName} {item?.student?.user?.lastName}</td>
                    <td>{item?.student?.user?.email}</td>
                    <td>{item?.course?.title}</td>
                    <td>{item?.course?.code}</td>
                    <td>{item?.course?.department?.name}</td>
                    <td>
                      <span className={config.badgeClass}>{item.status}</span>
                    </td>
                    {showAction ? (
                      <td>
                        <button className="er-action-btn" onClick={() => handleClick(item)}>
                          Take Action
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showAction ? 7 : 6} className="er-empty">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <div className="er-page">
      <div className="er-shell">
        <header className="er-hero">
          <div>
            <span className="er-kicker">Advisor workspace</span>
            <h2>Manage Enrollment Requests</h2>
            <p>Review student requests, compare course details, and approve the best-fit section.</p>
          </div>

          <div className="er-summary">
            <div className="er-summary-card">
              <strong>{pendingData.length}</strong>
              <span>Pending</span>
            </div>
            <div className="er-summary-card">
              <strong>{approvedData.length}</strong>
              <span>Approved</span>
            </div>
            <div className="er-summary-card">
              <strong>{rejectedData.length}</strong>
              <span>Rejected</span>
            </div>
          </div>
        </header>

        <div className="er-grid">
          {renderTable(pendingData, "PENDING", true)}
          {renderTable(approvedData, "APPROVED")}
          {renderTable(rejectedData, "REJECTED")}
        </div>

        {selectedEnrollmentRequest && isOpen ? (
          <ERTakeActionModal
            selectedEnrollmentRequest={selectedEnrollmentRequest}
            isOpen={isOpen}
            onClose={onClose}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ManageEnrollmentRequest;
