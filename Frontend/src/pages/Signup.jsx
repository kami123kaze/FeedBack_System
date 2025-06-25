import { React,useState,useContext  } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

        <input
          className="w-full mb-3 px-4 py-2 border rounded"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="w-full mb-3 px-4 py-2 border rounded"
          placeholder="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="w-full mb-3 px-4 py-2 border rounded"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        
        <select
          className="w-full mb-4 px-4 py-2 border rounded"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Create Account
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
