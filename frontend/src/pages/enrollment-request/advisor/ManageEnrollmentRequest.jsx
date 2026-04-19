import { useEffect, useState, useCallback } from "react";
import getEnrollmentRequests from "../../../api/enrollment-request/getEnrollmentRequests";
import useUserDetails from "../../../hooks/useUserDetails";
import ERTakeActionModal from "./ERTakeAction.Modal";

const ManageEnrollmentRequest = () => {
  const { userDetails } = useUserDetails();

  const [pendingData, setPendingData] = useState([]);
  const [approvedData, setApprovedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);

  const [selectedEnrollmentRequest, setSelectedEnrollmentRequest] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const filterByStatus = (resp, status) =>
    resp.filter((ele) => ele.status === status);

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
    setSelectedEnrollmentRequest(ele)
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedEnrollmentRequest(null);
  };

  const renderTable = (data, showAction = false) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Student</th>
          <th style={styles.th}>Email</th>
          <th style={styles.th}>Course</th>
          <th style={styles.th}>Code</th>
          <th style={styles.th}>Department</th>
          {showAction && <th style={styles.th}>Action</th>}
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((e, index) => (
            <tr
              key={e.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#1f1f1f" : "#262626"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#333")
              }
              onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                index % 2 === 0 ? "#1f1f1f" : "#262626")
              }
            >
              <td style={styles.td}>
                {e?.student?.user?.firstName}{" "}
                {e?.student?.user?.lastName}
              </td>
              <td style={styles.td}>{e?.student?.user?.email}</td>
              <td style={styles.td}>{e?.course?.title}</td>
              <td style={styles.td}>{e?.course?.code}</td>
              <td style={styles.td}>
                {e?.course?.department?.name}
              </td>

              {showAction && (
                <td style={styles.td}>
                  <button
                    style={styles.actionBtn}
                    onClick={() =>
                      handleClick(e)
                    }
                  >
                    Take Action
                  </button>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={styles.empty}>
              No data found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Enrollment Requests</h2>

      {/* Pending */}
      <div style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, color: "#ff6b6b" }}>
          Pending Requests
        </h3>
        {renderTable(pendingData, true)}
      </div>

      {/* Approved */}
      <div style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, color: "#51cf66" }}>
          Approved Requests
        </h3>
        {renderTable(approvedData)}
      </div>

      {/* Rejected */}
      <div style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, color: "#f03e3e" }}>
          Rejected Requests
        </h3>
        {renderTable(rejectedData)}
      </div>

      {selectedEnrollmentRequest && isOpen && (
        <ERTakeActionModal
          selectedEnrollmentRequest={selectedEnrollmentRequest}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "25px",
    color: "white",
    background: "#121212",
    minHeight: "100vh"
  },

  title: {
    marginBottom: "20px",
    color: "#ddd"
  },

  card: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "25px",
    boxShadow: "0 0 10px rgba(0,0,0,0.4)"
  },

  sectionTitle: {
    marginBottom: "10px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #333",
    borderRadius: "8px",
    overflow: "hidden"
  },

  th: {
    padding: "12px",
    backgroundColor: "#2c2c2c",
    borderBottom: "1px solid #444",
    textAlign: "left",
    fontSize: "14px"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #333",
    fontSize: "14px"
  },

  empty: {
    padding: "15px",
    textAlign: "center",
    color: "#888"
  },

  actionBtn: {
    background: "linear-gradient(135deg, #1971c2, #1864ab)",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s"
  }
};

export default ManageEnrollmentRequest;