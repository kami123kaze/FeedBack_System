import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import client from "../api/clinet";

const ManageEmployees = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const fetchEmployees = async () => {
      try {
        const { data } = await client.get("/users/");
        setEmployees(data.filter(u => u.role === "employee"));
      } catch (err) {
        console.error("Failed to load employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user?.id]);

  const handleAddToTeam = async (employeeId) => {
    try {
      await client.put(`/users/${employeeId}/assign-manager/${user.id}`);
      setEmployees(prev =>
        prev.map(e =>
          e.id === employeeId ? { ...e, manager_id: user.id } : e
        )
      );
    } catch (err) {
      console.error("Failed to assign manager:", err);
    }
  };

  const unassigned = employees.filter(e => !e.manager_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d] text-white">
        <span className="animate-pulse text-xl font-semibold">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4">
      <header className="sticky top-0 flex items-center gap-4 px-6 py-4 bg-black/30 backdrop-blur border-b border-white/10 shadow-md">
        <button
          onClick={() => navigate("/manager")}
          className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20 transition"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Manage Employees</h1>
      </header>

      <main className="p-6 space-y-12 max-w-6xl mx-auto">
        {/* Unassigned Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white/90">Unassigned</h2>

          {unassigned.length === 0 ? (
            employees.length === 0 ? (
              <p className="text-white/60">There are no employees.</p>
            ) : (
              <p className="text-white/60">Everyone already has a manager </p>
            )
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {unassigned.map(emp => (
                <div
                  key={emp.id}
                  className="relative rounded-xl p-5 bg-white/5 border border-white/10 backdrop-blur-md shadow hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-bold text-white">{emp.name}</h3>
                  <p className="text-white/70 text-sm">{emp.email}</p>

                  <button
                    onClick={() => handleAddToTeam(emp.id)}
                    className="absolute bottom-4 right-4 rounded bg-amber-500 px-3 py-1 text-sm text-black font-semibold hover:bg-amber-600 transition"
                  >
                    Add&nbsp;to&nbsp;Team
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>


            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-white/90">All Employees</h2>

              {employees.length === 0 ? (
                <p className="text-white/60">There are no employees.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {employees.map(emp => (
                    <div
                      key={emp.id}
                      className="rounded-xl p-5 bg-white/5 border border-white/10 backdrop-blur-md shadow hover:shadow-lg transition"
                    >
                      {/* 👇 name turns emerald if this employee is on your team */}
                      <h3
                        className={`text-lg font-bold ${
                          emp.manager_id === user.id ? "text-emerald-400" : "text-white"
                        }`}
                      >
                        {emp.name}
                      </h3>

                      <p className="text-white/70 text-sm">{emp.email}</p>

                      <p className="text-white/60 text-sm mt-2">
                        <strong>Manager:</strong>{" "}
                        {emp.manager_id
                          ? emp.manager_id === user.id
                            ? "You"
                            : `Manager ID ${emp.manager_id}`
                          : "Not Assigned"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
          </section>

      </main>
    </div>
  );
};

export default ManageEmployees;
