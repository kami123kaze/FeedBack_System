import React, { useEffect, useState, useContext,useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import client from "../api/clinet";
import { exportNodeToPdf } from "../utils/exportPdf";

const ManagerDashboard = () => {
  const { user, setToken, setUser } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const pdfRefs = useRef({});

  const deleteFeedback = async (id) => {
    try {
      await client.delete(`/feedbacks/${id}`);
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
      setSuccessMsg("✅ Feedback deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to delete feedback:", err);
    }
  };

  const editFeedback = (id) => navigate(`/feedback/${id}/edit`);

  const removeFromTeam = async (emp) => {
    try {
      await client.put(`/users/${emp.id}/unassign`);
      setEmployees((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, manager_id: null } : e))
      );
    } catch (err) {
      console.error("Failed to unassign:", err);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const { data: users } = await client.get("/users/");
        setEmployees(users.filter((u) => u.role === "employee"));

        const { data: fbacks } = await client.get(
          `/feedbacks/manager/${user.id}`
        );
        setFeedbacks(fbacks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, location.key]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const teamEmployees = employees.filter((e) => e.manager_id === user.id);

  /* ----------  UI  ---------- */

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
      {/* Header */}
      <header className="sticky top-0 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/5 border-b border-white/20 shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">
          Manager&nbsp;&middot;&nbsp;{user?.name || user?.email}
        </h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-rose-600 px-4 py-1 text-sm font-medium text-white hover:bg-rose-700 transition"
        >
          Log&nbsp;out
        </button>
      </header>

      <main className="p-6 space-y-12">
        {/* === Team Section === */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-wide">
              Your&nbsp;Team
            </h2>
            <button
              onClick={() => navigate("/manager/employees")}
              className="rounded-md bg-amber-500 px-3 py-1 text-sm font-medium text-black hover:bg-amber-600 transition-colors"
            >
              Manage Employees
            </button>
          </div>

          {teamEmployees.length === 0 ? (
            <p className="text-gray-400">You haven’t added anyone yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teamEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="relative overflow-hidden rounded-xl backdrop-blur-md bg-white/5 border border-white/20 p-5 shadow-lg"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromTeam(emp)}
                    title="Remove from team"
                    className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-300 bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                  >
                    &times;
                  </button>

                  {/* Employee info */}
                  <h3 className="mt-1 text-lg font-bold">{emp.name}</h3>
                  <p className="text-sm text-gray-300">{emp.email}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* === Feedback Section === */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-wide">
              Your&nbsp;Feedback
            </h2>
            <button
              onClick={() => navigate("/feedback/new")}
              className="rounded-md bg-amber-500 px-3 py-1 text-sm font-medium text-black hover:bg-amber-600 transition-colors"
            >
              Create Feedback
            </button>
          </div>

          {successMsg && (
            <div className="mx-6 my-4 rounded-md bg-green-600/10 border border-green-400/40 text-green-300 px-4 py-2 text-sm shadow">
              {successMsg}
            </div>
          )}

          {feedbacks.length === 0 ? (
            <p className="text-gray-400">No feedback sent yet.</p>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  ref={(el) => (pdfRefs.current[fb.id] = el)}
                  className="relative rounded-xl backdrop-blur-md bg-white/5 border border-white/20 p-4 shadow-lg"
                >
                  {/* Edit / Delete buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => editFeedback(fb.id)}
                      title="Edit"
                      className="h-8 w-8 flex items-center justify-center rounded-full
                                 border border-amber-300 bg-amber-600/10 text-amber-400
                                 hover:bg-amber-500 hover:text-black transition"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteFeedback(fb.id)}
                      title="Delete"
                      className="h-8 w-8 flex items-center justify-center rounded-full
                                 border border-rose-300 bg-rose-600/10 text-rose-400
                                 hover:bg-rose-600 hover:text-white transition"
                    >
                      🗑
                    </button>
                  </div>

                 <div className="flex flex-col justify-between h-full">
                      <div>
                        <h3 className="font-semibold text-amber-50 mb-1">
                          To: employee #{fb.employee_id}
                        </h3>
                        <p className="text-sm text-shadow-amber-50">
                          <span className="font-medium">Feedback:</span> {fb.text}
                        </p>
                        <p className="text-sm text-amber-50 mt-1">
                          <span className="font-medium">Sentiment:</span>{" "}
                          <span
                            className={
                              fb.sentiment === "positive"
                                ? "text-green-600"
                                : fb.sentiment === "negative"
                                ? "text-rose-600"
                                : "text-yellow-600"
                            }
                          >
                            {fb.sentiment}
                          </span>
                        </p>
                        {fb.comment && (
                          <p className="text-sm text-amber-50 mt-1">
                            <span className="font-medium">Comment:</span> {fb.comment}
                          </p>
                        )}
                        <p className="text-sm text-amber-50 mt-1">
                          <span className="font-medium">Acknowledged:</span>{" "}
                          {fb.acknowledged ? (
                            <span className="text-green-600">Yes</span>
                          ) : (
                            <span className="text-rose-600">No</span>
                          )}
                        </p>
                        {fb.tags?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {fb.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="text-xs bg-slate-200 text-slate-700 rounded-full px-2 py-0.5"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom-right date */}
                      <div className="text-right mt-4">
                        <span className="text-xs italic text-slate-500">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                       {/* Download PDF button */}
                  <button
                    onClick={() =>
                      exportNodeToPdf(pdfRefs.current[fb.id], `feedback-${fb.id}`)
                    }
                    className="absolute bottom-4 left-4 rounded-md bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-600 transition"
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManagerDashboard;
