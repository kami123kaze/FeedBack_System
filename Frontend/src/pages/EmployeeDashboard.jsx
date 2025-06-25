
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const EmployeeDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/feedbacks/employee/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      }
    };

    if (user?.id) fetchFeedbacks();
  }, [user, token]);
  console.log("User in context:", user);
console.log("Token:", token);

  const acknowledgeFeedback = async (feedbackId) => {
    try {
      await axios.put(
        `http://localhost:8000/feedbacks/${feedbackId}`,
        { acknowledged: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === feedbackId ? { ...fb, acknowledged: true } : fb
        )
      );
    } catch (err) {
      console.error("Failed to acknowledge:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      {feedbacks.length === 0 ? (
        <p>No feedbacks yet.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="p-4 bg-white rounded shadow">
              <p><strong>Text:</strong> {fb.text}</p>
              <p><strong>Sentiment:</strong> {fb.sentiment}</p>
              <p><strong>Comment:</strong> {fb.comment}</p>
              <p><strong>Tags:</strong> {fb.tags.map((tag) => tag.name).join(", ")}</p>
              <p><strong>Acknowledged:</strong> {fb.acknowledged ? "Yes" : "No"}</p>

              {!fb.acknowledged && (
                <button
                  onClick={() => acknowledgeFeedback(fb.id)}
                  className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
