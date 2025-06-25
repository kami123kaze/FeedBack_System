import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import client from "../api/clinet";

const EmployeeDashboard = () => {
  const { user, token, setToken, setUser } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!token || !user?.id) return;
      try {
        const { data } = await client.get(`/feedbacks/employee/${user.id}`);
        setFeedbacks(data);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [token, user?.id]);


  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const acknowledgeFeedback = async (id) => {
    try {
      await client.put(`/feedbacks/acknowledge/${id}`);
      setFeedbacks(prev =>
        prev.map(fb =>
          fb.id === id ? { ...fb, acknowledged: true } : fb
        )
      );
    } catch (err) {
      console.error("Failed to acknowledge:", err);
    }
  };


  const sentimentBorder = (s) =>
    s === "positive"
      ? "border-emerald-500"
      : s === "negative"
      ? "border-rose-500"
      : "border-gray-400";


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <span className="animate-pulse text-xl font-semibold text-slate-600">
          Loading…
        </span>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">

      <header className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">
          Welcome, {user?.name || user?.email}
        </h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-indigo-600 px-4 py-1 text-white hover:bg-indigo-700"
        >
          Log&nbsp;out
        </button>
      </header>

      {/* Content */}
      <main className="p-6">
        {feedbacks.length === 0 ? (
          <p className="text-slate-600">You have no feedback yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className={`relative rounded-xl bg-white p-6 shadow-lg border-l-4 ${sentimentBorder(
                  fb.sentiment
                )}`}
              >

                <p className="text-sm text-slate-500 mb-1">
                  <strong>Manager:</strong>{" "}
                  {fb.manager_name || `#${fb.manager_id}`}
                </p>

                <p className="mb-2 text-slate-700">{fb.text}</p>


                <ul className="mb-3 space-y-1 text-sm text-slate-600">
                  <li>
                    <strong>Sentiment:</strong> {fb.sentiment}
                  </li>
                  {fb.comment && (
                    <li>
                      <strong>Comment:</strong> {fb.comment}
                    </li>
                  )}
                  {fb.tags?.length > 0 && (
                    <li>
                      <strong>Tags:</strong>{" "}
                      {fb.tags.map((t) => t.name).join(", ")}
                    </li>
                  )}
                  <li>
                    <strong>Acknowledged:</strong>{" "}
                    {fb.acknowledged ? "Yes" : "No"}
                  </li>
                </ul>

                {!fb.acknowledged && (
                  <button
                    onClick={() => acknowledgeFeedback(fb.id)}
                    className="absolute bottom-4 right-4 rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
