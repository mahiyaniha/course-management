import { GET_AVAILABLE_COURSES_FOR_STUDENT_API } from "./apiUrls";

  const getAvailbaleCoursesForStudent = async (userId) => {
    try {
      const coursesAPI = await fetch(GET_AVAILABLE_COURSES_FOR_STUDENT_API + "/" + userId, {
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

  export default getAvailbaleCoursesForStudent;