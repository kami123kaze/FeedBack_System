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
        const onlyEmployees = data.filter(u => u.role === "employee");
        setEmployees(onlyEmployees);
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
        prev.map(e => e.id === employeeId ? { ...e, manager_id: user.id } : e)
      );
    } catch (err) {
      console.error("Failed to assign manager:", err);
    }
  };


  const unassigned = employees.filter(e => !e.manager_id);


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
   
      <header className="sticky top-0 flex items-center gap-4 px-6 py-4 bg-white shadow-sm">
        <button
          onClick={() => navigate("/manager")}
          className="rounded bg-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-300"
        >
          ⬅ Back
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          Manage Employees
        </h1>
      </header>

   
      <main className="p-6 space-y-10">

   
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Unassigned</h2>

          {unassigned.length === 0 ? (
            <p className="text-slate-600">Everyone already has a manager 🎉</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {unassigned.map(emp => (
                <div
                  key={emp.id}
                  className="relative rounded-xl bg-white p-5 shadow border border-slate-200"
                >
                  <h3 className="text-lg font-bold text-slate-800">
                    {emp.name}
                  </h3>
                  <p className="text-slate-600 text-sm">{emp.email}</p>

                  <button
                    onClick={() => handleAddToTeam(emp.id)}
                    className="absolute bottom-4 right-4 rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                  >
                    Add&nbsp;to&nbsp;Team
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

  
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">All Employees</h2>

          {employees.length === 0 ? (
            <p className="text-slate-600">No employees found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {employees.map(emp => (
                <div
                  key={emp.id}
                  className="rounded-xl bg-white p-5 shadow border border-slate-200"
                >
                  <h3 className="text-lg font-bold text-slate-800">
                    {emp.name}
                  </h3>
                  <p className="text-slate-600 text-sm">{emp.email}</p>
                  <p className="text-slate-500 text-sm mt-2">
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