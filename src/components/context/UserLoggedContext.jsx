// src/components/Context/UserLoggedContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile } from "../services/userServices";
import { authContext } from "./AuthContext";

export const UserLoggedInfoContext = createContext();

export default function UserLoggedInfoProvider({ children }) {
  const { token } = useContext(authContext);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      (async()=>setUserData(null))
      return;
    }
    (async()=>setIsLoading(true))
    getMyProfile()
      .then((user) => setUserData(user))
      .catch(() => setUserData(null))
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <UserLoggedInfoContext.Provider value={{ userData, setUserData, isLoading }}>
      {children}
    </UserLoggedInfoContext.Provider>
  );
}