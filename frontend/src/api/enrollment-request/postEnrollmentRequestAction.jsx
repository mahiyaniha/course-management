import { POST_ENROLLMENT_REQUESTS_ACTION_API } from "../apiUrls";

  const postEnrollmentRequestAction = async ({ 
    enrollentRequestId, 
    courseId, 
    sectionId, 
    studentId, 
    status }) => {
    try {
      const enrollmentRequestAPI = await fetch(POST_ENROLLMENT_REQUESTS_ACTION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          enrollentRequestId: enrollentRequestId,
          courseId: courseId,
          sectionId: sectionId,
          studentId: studentId,
          status: status
        })
      });
      const respData = await enrollmentRequestAPI.json();
      if (respData.error) {
        return null;
      }
      return respData;
    } catch (e) {
      console.error(e.message)
    }
  }

  export default postEnrollmentRequestAction;