import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "./AuthContext";
import { fetchMe } from "../api/auth";          

const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user,  setUser]  = useState(() =>
    token ? jwtDecode(token) : null
  );
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else       localStorage.removeItem("token");
  }, [token]);


  useEffect(() => {
    const hydrate = async () => {
      if (!token) { setLoading(false); return; }

      try {
        const me = await fetchMe();     
        setUser(me);
      } catch (err) {
        console.error("Hydrate failed ⇒ logging out", err);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, [token]);

 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="animate-pulse text-lg text-slate-500">Loading…</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
