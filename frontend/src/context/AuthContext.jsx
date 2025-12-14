import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fitplanhub_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() =>
    localStorage.getItem("fitplanhub_token")
  );

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("fitplanhub_user", JSON.stringify(userData));
    localStorage.setItem("fitplanhub_token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fitplanhub_user");
    localStorage.removeItem("fitplanhub_token");
  };

  const value = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
