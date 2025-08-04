// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, setUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");

  // Fetch users and auto-login first user with role "user"
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        const defaultUser = data.find((u) => u.role === "admin");
        if (defaultUser) {
          setUser(defaultUser);
          setSelectedEmail(defaultUser.email);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [setUser]);

  const handleLogin = () => {
    const selectedUser = users.find((u) => u.email === selectedEmail);
    if (selectedUser && selectedUser.role === "user") {
      setUser(selectedUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedEmail("");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">🏠 HomeFix</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/booking" className="nav-link">
            Book a Service
          </Link>
        </div>

        <div className="auth-section">
          {!user ? (
            <>
              <select
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
              >
                <option value="">Select user</option>
                {users
                  .filter((u) => u.role === "user")
                  .map((u, index) => (
                    <option key={index} value={u.email}>
                      {u.email} ({u.role})
                    </option>
                  ))}
              </select>

              <button onClick={handleLogin}>Login</button>
            </>
          ) : (
            <>
              <span className="user-role">
                Logged in as: {user.email} ({user.role})
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>

      <div className="hero">
        <div className="bg-green-500 text-white p-2 rounded">
          Tailwind Works!
        </div>
        <h1>Welcome to Home Maintenance Services</h1>
        <p>Your trusted solution for all home repairs & maintenance</p>
        <Link to="/booking" className="cta-button">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
