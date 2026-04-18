import { useState } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;