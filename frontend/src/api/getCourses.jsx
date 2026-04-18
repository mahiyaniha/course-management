import { GET_COURSES_API } from "./apiUrls";

  const getCourses = async () => {
    try {
      console.log("getting courses...")
      const coursesAPI = await fetch(GET_COURSES_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const respData = await coursesAPI.json();
      if (respData.error) {
        return null;
      }
      return respData;
    } catch (e) {
      console.error(e.message)
    }
  }

  export default getCourses;