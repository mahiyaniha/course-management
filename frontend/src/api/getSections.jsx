import { GET_SECTIONS_API } from "./apiUrls";

  const getSections = async () => {
    try {
      console.log("getting courses...")
      const sectionsAPI = await fetch(GET_SECTIONS_API, {
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

  export default getSections;