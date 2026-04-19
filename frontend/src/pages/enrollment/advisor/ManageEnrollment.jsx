
import { useEffect, useState, useCallback } from "react"
import getEnrollments from "../../../api/getEnrollments"
import useUserDetails from "../../../hooks/useUserDetails";


const ManageEnrollment = () => {
  const { userDetails } = useUserDetails();
  const [enrollments, setEnrollments] = useState([])


  const fetchEnrollments = useCallback(async () => {
    try {
      const resp = await getEnrollments(userDetails?.userId)
      if (resp.error) {
        throw new Error(resp.error)
      }
      setEnrollments(resp)
    } catch (e) {
      console.error(e.message)
    }
  }, [userDetails?.userId])

  useEffect(() => {
    if (userDetails) {
      fetchEnrollments()
    }
  }, [fetchEnrollments, userDetails])

  return (
    <div>
      <h3>Manage Enrollments</h3>

      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Course Title</th>
            <th>Course Code</th>
            <th>Department</th>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map(e =>
            <tr key={e.code}>
              <td>{e?.student?.user?.firstName}</td>
              <td>{e?.student?.user?.lastName}</td>
              <td>{e?.student?.user?.email}</td>
              <td>{e?.section?.course?.title}</td>
              <td>{e?.section?.course?.code}</td>
              <td>{e?.section?.course?.department?.name}</td>
              <td>{e?.section?.day ?? "None"}</td>
              <td>{e?.section?.startTime}</td>
              <td>{e?.section?.endTime}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  )
}


export default ManageEnrollment;