import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupRequest, loginRequest, fetchMe } from "../api/auth";
import AuthContext from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); 
    try {
      await signupRequest(form);

      const { access_token } = await loginRequest(form.email, form.password);
      localStorage.setItem("token", access_token);
      setToken(access_token);

      const me = await fetchMe();
      setUser(me);

      navigate(me.role === "manager" ? "/manager" : "/employee");
    } catch (err) {
      console.error(err);
      setError("Signup failed – email may already exist");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-xl backdrop-blur-md bg-white/5 border border-white/20 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Create Your Account
        </h2>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={loading} 
            required
          />

          <input
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading} 
            required
          />

          <input
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            disabled={loading} 
            required
          />

          <select
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={loading} 
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading} 
            className={`w-full py-2 rounded-md font-semibold transition-colors ${
              loading
                ? "bg-amber-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-black"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Creating&nbsp;account…
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className={`text-amber-400 font-medium hover:underline hover:text-amber-300 transition ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
