import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isAdminLoggedIn: false,
  setIsAdminLoggedIn: () => {},
  user: null,
  setUser: () => {},
  isUserLoggedIn: false,
  login: () => {},
  logout: () => {},
  logoutUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAdminLoggedIn(true);
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        user,
        setUser,
        isUserLoggedIn: !!user,
        login,
        logout,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
