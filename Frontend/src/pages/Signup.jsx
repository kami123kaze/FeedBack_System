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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
            required
          />

          <input
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition-colors"
          >
            Create Account
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-400 font-medium hover:underline hover:text-amber-300 transition"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
