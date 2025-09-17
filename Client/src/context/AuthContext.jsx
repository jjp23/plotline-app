import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("plotline_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (username) => {
    const fakeUser = { username }; 
    setUser(fakeUser);
    localStorage.setItem("plotline_user", JSON.stringify(fakeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("plotline_user");
  };

  const register = (username) => {
    login(username);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
