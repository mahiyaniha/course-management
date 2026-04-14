import { useEffect, useState } from "react"

const AdminDashboard = () => {

    const [students, setStudents] = useState([])
    const [advisors, setAdvisors] = useState([])

    const fetchStudents = async () => {
        try {
            const resp = await fetch("http://localhost:8080/api/student/all");
            const respData = await resp.json()
            if (respData) {
                setStudents(respData)
            }
        } catch (e) {
            console.error(e.message)
        }
    }

    const fetchAdvisors = async () => {
        try {
            const resp = await fetch("http://localhost:8080/api/advisor/all");
            const respData = await resp.json()
            if (respData) {
                setAdvisors(respData)
            }
        } catch (e) {
            console.error(e.message)
        }
    }

    useEffect(() => {
        fetchStudents()
        fetchAdvisors()
    }, [])

    return (
        <div>
            <div>Admin Dashboard</div>
            <div>Number of total active users: {students.length + advisors.length}</div>
            <div>Number of active students: {students.length}</div>
            <div>Number of active advisors: {advisors.length}</div>

            <br />
            <div>Manage Advisors (Table)</div>
            <br />
            <table>
                <thead>
                <tr>
                    <th>Photo</th>
                    <th>Full Name</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Level</th>
                </tr>
                </thead>
                <tbody>
                {advisors.map(e =>
                    <tr key={e.email}>
                        <td>{e.photo}</td>
                        <td>{e.name}</td>
                        <td>{e.firstName}</td>
                        <td>{e.lastName}</td>
                        <td>{e.email}</td>
                        <td>{e.description ?? "None"}</td>
                        <td>{e.address}</td>
                        <td>{e.phone}</td>
                        <td>{e.level}</td>
                    </tr>
                )}
                </tbody>
            </table>


            <br />
            <div>Manage Student (Table)</div>
            <br />
            <table>
                <thead>
                <tr>
                    <th>Photo</th>
                    <th>Full Name</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Department</th>
                </tr>
                </thead>
                <tbody>
                {students.map(e =>
                    <tr key={e.email}>
                        <td>{e.photo}</td>
                        <td>{e.name}</td>
                        <td>{e.firstName}</td>
                        <td>{e.lastName}</td>
                        <td>{e.email}</td>
                        <td>{e.description ?? "None"}</td>
                        <td>{e.address}</td>
                        <td>{e.phone}</td>
                        <td>{e.department}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>

    )
}

export default AdminDashboard