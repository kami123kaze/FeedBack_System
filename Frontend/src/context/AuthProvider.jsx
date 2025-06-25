import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  // token comes from localStorage on first load
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser]   = useState(null);

  // whenever token changes, keep localStorage updated
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else       localStorage.removeItem("token");
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
