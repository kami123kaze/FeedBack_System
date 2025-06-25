import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import client from "../api/clinet";

const CreateFeedback = () => {
  const { user } = useContext(AuthContext);          
  const navigate   = useNavigate();

  
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    text: "",
    sentiment: "positive",
    comment: "",
    tag_ids: "",          
  });
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await client.get("/users/");
        const onlyTeam = data.filter(
          (u) => u.role === "employee" && u.manager_id === user.id
        );
        setEmployees(onlyTeam);
      } catch (err) {
        console.error(err);
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [user.id]);


  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await client.post("/feedbacks/", {
        manager_id: user.id,
        employee_id: Number(form.employee_id),
        text: form.text,
        sentiment: form.sentiment,
        comment: form.comment || null,
        tag_ids: form.tag_ids
          ? form.tag_ids.split(",").map((id) => Number(id.trim()))
          : [],
      });
      navigate("/manager");              
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to create feedback");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="animate-pulse text-lg text-slate-500">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="sticky top-0 flex items-center gap-4 px-6 py-4 bg-white shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="rounded bg-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-300"
        >
          ⬅ Back
        </button>
        <h1 className="text-xl font-bold text-slate-800">Create Feedback</h1>
      </header>

      <main className="p-6 max-w-xl mx-auto">
        {error && (
          <div className="mb-4 rounded bg-rose-100 p-3 text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee select */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Employee <span className="text-rose-600">*</span>
            </label>
            <select
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              required
              className="w-full rounded border border-slate-300 p-2"
            >
              <option value="">— Select employee —</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.email})
                </option>
              ))}
            </select>
          </div>

          {/* Text */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Feedback <span className="text-rose-600">*</span>
            </label>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded border border-slate-300 p-2"
            />
          </div>

  
          <div>
            <label className="block text-sm font-medium mb-1">
              Sentiment
            </label>
            <div className="flex items-center gap-4">
              {["positive", "neutral", "negative"].map((s) => (
                <label key={s} className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="sentiment"
                    value={s}
                    checked={form.sentiment === s}
                    onChange={handleChange}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

       
          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <input
              type="text"
              name="comment"
              value={form.comment}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tag IDs (comma-separated, optional)
            </label>
            <input
              type="text"
              name="tag_ids"
              value={form.tag_ids}
              onChange={handleChange}
              placeholder="e.g. 1, 3, 7"
              className="w-full rounded border border-slate-300 p-2"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Create Feedback"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateFeedback;
