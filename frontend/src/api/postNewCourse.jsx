import { POST_COURSES_API } from "./apiUrls";

  const postNewCourse = async ({ data }) => {
    try {
      const coursesAPI = await fetch(POST_COURSES_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
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

  export default postNewCourse;