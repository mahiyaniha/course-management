import { GET_ADVISORS_API } from "./apiUrls";

  const getAdvisors = async () => {
    try {
      const advisorAPI = await fetch(GET_ADVISORS_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const respData = await advisorAPI.json();
      if (respData.error) {
        return null;
      }
      return respData;
    } catch (e) {
      console.error(e.message)
    }
  }

  export default getAdvisors;