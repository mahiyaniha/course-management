import { GET_ENROLLMENTS_API } from "./apiUrls";

  const getEnrollments = async (uniqueId) => {
    try {
      console.log("getting courses...")
      const sectionsAPI = await fetch(GET_ENROLLMENTS_API + "/" + uniqueId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const respData = await sectionsAPI.json();
      if (respData.error) {
        return null;
      }
      return respData;
    } catch (e) {
      console.error(e.message)
    }
  }

  export default getEnrollments;