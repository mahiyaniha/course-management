import { GET_ENROLLMENTS_API } from "./apiUrls";

  const getEnrollments = async (userId) => {
    try {
      const enrollmentsAPI= await fetch(GET_ENROLLMENTS_API + "/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const respData = await enrollmentsAPI.json();
      if (respData.error) {
        return null;
      }
      return respData;
    } catch (e) {
      console.error(e.message)
    }
  }

  export default getEnrollments;