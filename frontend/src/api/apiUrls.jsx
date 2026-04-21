const REGISTER_API = "http://localhost:8080/api/register"

const GET_COURSES_API= "http://localhost:8080/api/admin/courses"
const GET_SECTIONS_API = "http://localhost:8080/api/admin/sections"
const GET_ENROLLMENTS_API = "http://localhost:8080/api/advisor/enrollments"
const GET_ENROLLMENT_REQUESTS_API = "http://localhost:8080/api/advisor/enrollment-requests"
const GET_AVAILABLE_COURSES_FOR_STUDENT_API = "http://localhost:8080/api/student/courses"
const GET_DEPARTMNET_API = "http://localhost:8080/api/admin/departments"
const GET_ADVISORS_API = "http://localhost:8080/api/advisor/all"

const POST_COURSES_API = "http://localhost:8080/api/admin/course/create"
const POST_ENROLLMENT_REQUESTS_ACTION_API = "http://localhost:8080/api/advisor/enrollment-requests/action"

export {
    REGISTER_API,

    GET_COURSES_API,
    GET_SECTIONS_API,
    GET_ENROLLMENTS_API,
    GET_ENROLLMENT_REQUESTS_API,
    GET_AVAILABLE_COURSES_FOR_STUDENT_API,
    GET_DEPARTMNET_API,
    GET_ADVISORS_API,

    POST_ENROLLMENT_REQUESTS_ACTION_API,
    POST_COURSES_API
}