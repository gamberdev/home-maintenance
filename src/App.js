import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import ServiceList from "./pages/Servicelist";
import logo from "./sanafixlogo.png";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";
import { apiUrl } from "./config"; // Make sure this points to backend (http://localhost:5000)

function App() {
  const [userRole, setUserRole] = useState(null);
  const hardcodedEmail = "user1@example.com"; // Simulate logged-in user

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/users`);
        const user = res.data.find((u) => u.email === hardcodedEmail);
        if (user) setUserRole(user.role);
      } catch (err) {
        console.error("Error fetching user role:", err.message);
      }
    };

    fetchRole();
  }, []);

  if (!userRole) return <p>Loading...</p>;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="text-2xl bg-blue-500 text-white p-4 rounded-xl">
        Tailwind is working!
      </div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            {userRole === "admin" && (
              <Route path="/Servicelist" element={<ServiceList />} />
            )}
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
