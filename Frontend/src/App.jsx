import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManagerDashboard from "./pages/ManagerDashboard";
import ManageEmployees from './pages/ManageEmployees';
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CreateFeedback from './pages/CreateFeedback';
import  AuthContext  from "./context/AuthContext";
import { useContext } from 'react';


export default function App() {
    const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/Manager" element={user?.role === "manager" ? <ManagerDashboard /> : <Navigate to="/" />} />
      <Route path="/Manager/employees" element={<ManageEmployees />}/>
      <Route path="/feedback/new" element={user?.role === "manager" ? <CreateFeedback /> : <Navigate to="/login" />}/>


      <Route path="/Employee" element={<EmployeeDashboard />} />
    </Routes>
  );
}
