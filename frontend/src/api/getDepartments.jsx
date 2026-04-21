import { GET_DEPARTMNET_API } from "./apiUrls";

  const getDepartments = async () => {
    try {
      const departentAPI = await fetch(GET_DEPARTMNET_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const respData = await departentAPI.json();
      if (respData.error) {
        return null;
      }
      return respData;
    } catch (e) {
      console.error(e.message)
    }
  }

  export default getDepartments;