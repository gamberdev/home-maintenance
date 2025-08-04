import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";
import "./Servicelist.css"; // Keep styles separate
import { useAuth } from "../context/AuthContext";

const ServiceList = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
     if (!user || user.role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/");
      return;
    }
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/bookings`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err.message);
      }
    };
    fetchBookings();
  }, [navigate, user]);
    if (!user || user.role !== "admin") return null;
  return (
    <div className="service-list-container">
      <h2>All Booked Services</h2>

      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="service-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Date & Time</th>
              <th>Issue</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr key={b.id || b._id}>
                <td>{index + 1}</td>
                <td>{b.name}</td>
                <td>{b.contact}</td>
                <td>{b.email}</td>
                <td>{new Date(b.date_time).toLocaleString()}</td>
                <td>{b.specific_issues}</td>
                <td>{b.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServiceList;
