import { GET_ENROLLMENT_REQUESTS_API } from "../apiUrls";

  const getEnrollmentRequests = async (userId) => {
    try {
      const enrollmentRequestAPI = await fetch(GET_ENROLLMENT_REQUESTS_API + "/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
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

  export default getEnrollmentRequests;