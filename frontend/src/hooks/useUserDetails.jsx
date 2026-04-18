import { useContext } from "react";
import UserContext from "../contexts/user-context/UserContext";


const useUserDetails = () => useContext(UserContext);

export default useUserDetails;