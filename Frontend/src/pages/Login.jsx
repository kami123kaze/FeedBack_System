import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, fetchMe } from "../api/auth";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken, setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { access_token } = await loginRequest(email, password);
      localStorage.setItem("token", access_token);
      setToken(access_token);

      const me = await fetchMe();
      setUser(me);

      if (me.role === "manager") navigate("/manager");
      else navigate("/employee");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-xl backdrop-blur-md bg-white/5 border border-white/20 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Welcome Back 👋
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition-colors"
          >
            Log In
          </button>
        </div>

        <div className="mt-6 text-sm flex justify-center items-center text-gray-400">
          <span>Don&apos;t have an account?</span>
          <span
            onClick={() => navigate("/signup")}
            className="ml-2 text-amber-400 font-medium hover:underline hover:text-amber-300 cursor-pointer transition"
          >
            Sign up
          </span>
        </div>
      </form>
    </div>
  );
}
