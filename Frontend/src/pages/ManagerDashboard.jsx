import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const ManagerDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/feedbacks/manager/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };

    if (user?.id) fetchFeedbacks();
  }, [user, token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>

      {feedbacks.length === 0 ? (
        <p>No feedbacks yet.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="p-4 bg-white rounded shadow">
              <p><strong>Employee ID:</strong> {fb.employee_id}</p>
              <p><strong>Name:</strong> {fb.name}</p>
             
              <p><strong>Sentiment:</strong> {fb.sentiment}</p>
              <p><strong>Text:</strong> {fb.text}</p>
              <p><strong>Comment:</strong> {fb.comment}</p>
              <p><strong>Acknowledged:</strong> {fb.acknowledged ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
