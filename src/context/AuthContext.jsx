import { createContext } from "react";

export const AuthContext = createContext({
  isAdminLoggedIn: false,
  setIsAdminLoggedIn: () => {},
  useCheckAdminAuth: () => false,
});
