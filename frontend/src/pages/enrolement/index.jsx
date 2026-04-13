import { useEffect } from "react"

const Enrolement = () => {

    const fetchCourseById = async () => {
        try {
            const resp = await fetch("http://localhost:8080/api/courses/id")
            const res = await resp.json()
            if (res) {
                console.log(res)
            }
        } catch (e) {
            console.error(e.message)
        }
    }

    useEffect(() => {

        getCourseById()

    }, [])


    return (
    <div>
        <h3>Enrolement Form</h3>
        <p>Student Name</p>
        <input value="student name" readOnly></input>
        <input value="department name" readOnly></input>
        <input value="Advisor name" readOnly></input>
        <input value="available seat" readOnly></input>
        <button type="submit">Request</button>"
    </div>

    )
}