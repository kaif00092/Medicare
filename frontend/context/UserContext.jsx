import React from "react";
import { createContext } from "react";
export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:4001";

  const value = { serverUrl };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
