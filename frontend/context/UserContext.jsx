import React from "react";
import { createContext } from "react";
export const userDataContext = createContext();

function UserContext({ children }) {
<<<<<<< HEAD
  const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:4001";
=======
  const serverUrl = "https://medicare-backend-l1op.onrender.com";
>>>>>>> 2e51eff68e3be7dc09944cb4d7bd425b91e25173

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
