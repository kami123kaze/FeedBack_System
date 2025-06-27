import React, { useEffect, useState, } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
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
      await client.put(`/feedbacks/${id}`, {
        text,
        sentiment,
        comment,
      });
      navigate("/manager");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!feedback) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <p className="text-slate-600 animate-pulse">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-xl font-semibold mb-4 text-slate-800">Update Feedback</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-slate-700">Feedback Text</label>
          <textarea
            className="w-full mt-1 border p-2 rounded"
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-slate-700">Sentiment</label>
          <select
            className="w-full mt-1 border p-2 rounded"
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
          >
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700">Comment (optional)</label>
          <input
            className="w-full mt-1 border p-2 rounded"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Update Feedback
        </button>
      </form>
    </div>
  );
};

export default UpdateFeedbackPage;
