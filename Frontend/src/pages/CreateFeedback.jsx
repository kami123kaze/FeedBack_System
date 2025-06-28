import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import TagMultiSelect from "../components/TagMultiSelect";
import client from "../api/clinet";

const CreateFeedback = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
   const [allTags, setAllTags]     = useState([]); 

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    text: "",
    sentiment: "positive",
    comment: "",
    tag_ids: [],
  });
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    client.get("/tags/")
      .then(res => setAllTags(res.data))
      .catch(err => console.error("Failed to fetch tags", err));
  }, []);
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
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d] text-white">
        <span className="animate-pulse text-lg">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4">
      <header className="sticky top-0 flex items-center gap-4 px-6 py-4 bg-black/30 backdrop-blur border-b border-white/10 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20 transition"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Create Feedback</h1>
      </header>

      <main className="p-6 max-w-xl mx-auto">
        <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg space-y-6">
          {error && (
            <div className="rounded bg-red-500/10 border border-red-400/30 p-3 text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Employee */}
            <div>
              <label className="block text-sm mb-1 font-medium text-white/90">
                Employee <span className="text-red-400">*</span>
              </label>
              <select
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#3a3636] text-white border border-white/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                >
                  <option value="" className="text-amber-50">— Select employee —</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id} className="text-amber-50">
                      {e.name} ({e.email})
                    </option>
                  ))}
                </select>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm mb-1 font-medium text-white/90">
                Feedback <span className="text-red-400">*</span>
              </label>
              <textarea
                name="text"
                value={form.text}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-white/10 border border-white/20 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Sentiment */}
            <div>
              <label className="block text-sm mb-1 font-medium text-white/90">
                Sentiment
              </label>
              <div className="flex gap-4 text-white/80">
                {["positive", "neutral", "negative"].map((s) => (
                  <label key={s} className="inline-flex items-center gap-2">
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

            {/* Comment */}
            <div>
              <label className="block text-sm mb-1 font-medium text-white/90">
                Comment
              </label>
              <input
                type="text"
                name="comment"
                value={form.comment}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Tags */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-white/90">
                      Tags
                    </label>
                    <TagMultiSelect
                      value={form.tag_ids}
                      onChange={(ids) => setForm(prev => ({ ...prev, tag_ids: ids }))}
                      options={allTags}
                    />
                  </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Create Feedback"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateFeedback;
