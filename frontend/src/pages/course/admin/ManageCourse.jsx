
import { useEffect, useState } from "react"
import getCourses from "../../../api/getCourses"

const ManageCourse = () => {

  const [courses, setCourses] = useState([])

  const fetchCourses = async () => {
    try {
      const resp = await getCourses()
      if (resp.error) {
        throw new Error(resp.error)
      }
      setCourses(resp)
    } catch (e) {
      console.error(e.message)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div>
      <h3>Manage Courses</h3>

      <br />
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Credit</th>
            <th>Department</th>
            <th>Advisor</th>
            <th>Available Seat</th>
            <th>Total Seat</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(e =>
            <tr key={e.code}>
              <td>{e?.code}</td>
              <td>{e?.title}</td>
              <td>{e?.credit}</td>
              <td>{e?.department?.name}</td>
              <td>{e?.advisor?.user?.firstName} {e?.advisor?.user?.lastName}</td>
              <td>{e?.availableSeat ?? "None"}</td>
              <td>{e?.totalSeat}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  )
}


export default ManageCourse;