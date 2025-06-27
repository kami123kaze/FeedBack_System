import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/clinet";

const UpdateFeedbackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("neutral");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await client.get(`/feedbacks/${id}`);
        setFeedback(data);
        setText(data.text);
        setSentiment(data.sentiment);
        setComment(data.comment || "");
      } catch (err) {
        console.error("Failed to load feedback:", err);
      }
    };
    fetchFeedback();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await client.put(`/feedbacks/${id}`, { text, sentiment, comment });
      navigate("/manager");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!feedback) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
        <p className="text-gray-300 animate-pulse">Loading feedback…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#0d0d0d] text-white px-4 py-10">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-xl p-8 rounded-xl backdrop-blur-md bg-white/5 border border-white/20 shadow-2xl space-y-6"
      >
        <h1 className="text-2xl font-bold tracking-wide">Update Feedback</h1>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Feedback&nbsp;Text
          </label>
          <textarea
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Sentiment</label>
          <select
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
          >
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Comment&nbsp;(optional)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition-colors"
        >
          Update Feedback
        </button>
      </form>
    </div>
  );
};

export default UpdateFeedbackPage;
