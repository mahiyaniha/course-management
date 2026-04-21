import { REGISTER_API } from "./apiUrls";

  const postNewAccount = async ({ data }) => {
    try {
      const registerAPI = await fetch(REGISTER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const respData = await registerAPI.json();
      if (respData.error) {
        return null;
      }
      return respData;
    } catch (e) {
      console.error(e.message)
    }
  }

  export default postNewAccount;