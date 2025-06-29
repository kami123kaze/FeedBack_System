import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import client from "../api/clinet";
import { exportNodeToPdf } from "../utils/exportPdf";      

const EmployeeDashboard = () => {
  const { user, token, setToken, setUser } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("latest");
  const pdfRefs = useRef({});                               
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
      setFeedbacks((prev) =>
        prev.map((fb) => (fb.id === id ? { ...fb, acknowledged: true } : fb))
      );
    } catch (err) {
      console.error("Failed to acknowledge:", err);
    }
  };

  const sentimentBorder = (s) =>
    s === "positive"
      ? "border-emerald-400"
      : s === "negative"
      ? "border-rose-400"
      : "border-gray-400";

  const displayedFeedbacks = React.useMemo(() => {
    const copy = [...feedbacks];
    switch (sortOption) {
      case "ack":
        return copy.filter((fb) => fb.acknowledged);
      case "unack":
        return copy.filter((fb) => !fb.acknowledged);
      case "sent_pos":
        return copy.filter((fb) => fb.sentiment === "positive");
      case "sent_neg":
        return copy.filter((fb) => fb.sentiment === "negative");
      case "latest":
      default:
        return copy.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
    }
  }, [sortOption, feedbacks]);

 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
        <span className="animate-pulse text-xl font-semibold text-gray-300">
          Loading…
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">


      <header className="sticky top-0 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/5 border-b border-white/20 shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">
          Welcome,&nbsp;{user?.name || user?.email}
        </h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-rose-600 px-4 py-1 text-sm font-medium text-white hover:bg-rose-700 transition"
        >
          Log&nbsp;out
        </button>
      </header>

      <main className="p-6 space-y-6">

        <div className="flex justify-left">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white/10 border border-white/20 text-blue-400 text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="latest">Latest</option>
            <option value="ack">Acknowledged</option>
            <option value="unack">Not Acknowledged</option>
            <option value="sent_pos">Sentiment Positive</option>
            <option value="sent_neg">Sentiment Negative</option>
          </select>
        </div>

        {displayedFeedbacks.length === 0 ? (
          <p className="text-gray-400">No feedback matches this filter.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedFeedbacks.map((fb) => (
              <div
                key={fb.id}
                ref={(el) => (pdfRefs.current[fb.id] = el)}      /* NEW */
                className={`relative rounded-xl backdrop-blur-md bg-white/5 border border-white/20 p-6 shadow-lg border-l-4 ${sentimentBorder(
                  fb.sentiment
                )}`}
              >

                <p className="text-sm text-gray-300 mb-1">
                  <strong>Manager:</strong>{" "}
                  {fb.manager_name || `#${fb.manager_id}`}
                </p>

                <p className="mb-2 text-gray-200">{fb.text}</p>

                <ul className="mb-3 space-y-1 text-sm text-gray-300">
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


                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  {!fb.acknowledged && (
                    <button
                      onClick={() => acknowledgeFeedback(fb.id)}
                      className="rounded-md bg-amber-500 px-3 py-1 text-sm font-medium text-black hover:bg-amber-600 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() =>
                      exportNodeToPdf(
                        pdfRefs.current[fb.id],
                        `feedback-${fb.id}`
                      )
                    }
                    className="rounded-md bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-600 transition"
                  >
                    Download&nbsp;PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
