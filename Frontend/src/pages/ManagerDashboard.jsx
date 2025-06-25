import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import client from "../api/clinet";

const ManagerDashboard = () => {
  const { user, setToken, setUser } = useContext(AuthContext);
  const [employees, setEmployees]   = useState([]);
  const [feedbacks, setFeedbacks]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

      const deleteFeedback = async (id) => {
        try {
          await client.delete(`/feedbacks/${id}`);
          setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
          setSuccessMsg("✅ Feedback deleted successfully!");

          setTimeout(() => setSuccessMsg(""), 3000); // clear after 3s
        } catch (err) {
          console.error("Failed to delete feedback:", err);
        }
 };

const editFeedback = (id) => {
  navigate(`/feedback/edit/${id}`);
};

const removeFromTeam = async (emp) => {
      try {
        await client.put(`/users/${emp.id}/unassign`);
        setEmployees(prev =>
          prev.map(e =>
            e.id === emp.id ? { ...e, manager_id: null } : e
          )
        );
      } catch (err) {
        console.error("Failed to unassign:", err);
      }
  };
  
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
       
        const { data: users }   = await client.get("/users/");
        const onlyEmployees     = users.filter(u => u.role === "employee");
        setEmployees(onlyEmployees);

      
        const { data: fbacks }  = await client.get(`/feedbacks/manager/${user.id}`);
        setFeedbacks(fbacks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);


  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  


  const teamEmployees = employees.filter(e => e.manager_id === user.id);


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
          Manager: {user?.name || user?.email}
        </h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-rose-600 px-4 py-1 text-white hover:bg-rose-700"
        >
          Log&nbsp;out
        </button>
      </header>

    
      <main className="p-6 space-y-10">

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-700">Your Team</h2>
            <button
              onClick={() => navigate("/manager/employees")}
              className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
            >
              Manage Employees
            </button>
          </div>

          {teamEmployees.length === 0 ? (
            <p className="text-slate-600">You haven’t added anyone yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teamEmployees.map(emp => (
                      <div
                        key={emp.id}
                        className="relative overflow-hidden rounded-xl bg-white p-5 shadow
                                  border border-slate-200"
                      >
                        {/* X button */}
                        <button
                          onClick={() => removeFromTeam(emp)}
                          title="Remove from team"
                          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center
                                    rounded-full border border-rose-300 bg-rose-50 text-rose-600
                                    hover:bg-rose-600 hover:text-white transition"
                        >
                          &times;
                        </button>

                        {/* Employee info */}
                        <h3 className="mt-1 text-lg font-bold text-slate-800">{emp.name}</h3>
                        <p className="text-slate-600 text-sm">{emp.email}</p>
                      </div>
                    ))}
</div>
          )}
        </section>


        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-700">Your Feedback</h2>
            <button
              onClick={() => navigate("/feedback/new")}
              className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
            >
              Create Feedback
            </button>
          </div>
          {successMsg && (
                      <div className="mx-6 my-4 rounded bg-green-100 border border-green-300 text-green-800 px-4 py-2 text-sm shadow">
                        {successMsg}
                      </div>
                    )}
          {feedbacks.length === 0 ? (
            <p className="text-slate-600">No feedback sent yet.</p>
          ) : (
           <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="relative rounded-xl bg-white p-4 shadow border border-slate-200"
                >
                  {/* Edit / Delete buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => editFeedback(fb.id)}
                      title="Edit"
                      className="h-8 w-8 flex items-center justify-center rounded-full
                                border border-indigo-300 bg-indigo-50 text-indigo-600
                                hover:bg-indigo-600 hover:text-white transition"
                    >
                      ✎
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => deleteFeedback(fb.id)}
                      title="Delete"
                      className="h-8 w-8 flex items-center justify-center rounded-full
                                border border-rose-300 bg-rose-50 text-rose-600
                                hover:bg-rose-600 hover:text-white transition"
                    >
                      🗑
                    </button>
                  </div>
                    
                  {/* Main content (unchanged) */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        To: employee #{fb.employee_id}
                      </h3>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Feedback:</span> {fb.text}
                      </p>
                      <p className="text-sm text-slate-700 mt-1">
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
                        <p className="text-sm text-slate-700 mt-1">
                          <span className="font-medium">Comment:</span> {fb.comment}
                        </p>
                      )}
                      <p className="text-sm text-slate-700 mt-1">
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
                    <span className="text-xs italic text-slate-500">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                  </div>
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
