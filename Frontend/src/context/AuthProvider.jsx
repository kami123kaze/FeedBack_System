import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { fetchMe } from "../api/auth";

const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser]   = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else       localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const me = await fetchMe();     
        setUser(me);                    
      } catch (err) {
        console.error("Failed to hydrate user", err);
        setToken(null);
        setUser(null);
      }
    };

    if (token) hydrate();               
  }, [token]);
  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
