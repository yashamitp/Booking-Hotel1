import React, { createContext, useContext } from "react";
import { useUser } from "@clerk/clerk-react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const isAdmin = isLoaded && user?.publicMetadata?.role === "admin";

  return (
    <AppContext.Provider value={{ isAdmin, isLoaded, user }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => useContext(AppContext);
