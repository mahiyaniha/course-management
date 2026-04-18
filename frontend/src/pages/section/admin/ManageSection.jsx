

import { useEffect, useState } from "react"
import getSections from "../../../api/getSections"

const ManageSection = () => {

  const [sections, setSections] = useState([])

  const fetchSections = async () => {
    try {
      const resp = await getSections()
      if (resp.error) {
        throw new Error(resp.error)
      }
      setSections(resp)
    } catch (e) {
      console.error(e.message)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  return (
    <div>
      <h3>Manage Sections</h3>

      <br />
      <table>
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
          {sections.map(e =>
            <tr key={e?.course?.code}>
              <td>{e?.course?.title}</td>
              <td>{e?.course?.advisor?.name}</td>
              <td>{e?.course?.department?.name}</td>
              <td>{e?.day}</td>
              <td>{e?.startTime}</td>
              <td>{e?.endTime}</td>
              <td>{e?.seatLimit ?? "None"}</td>
              <td>{e?.seatTaken}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  )
}


export default ManageSection;