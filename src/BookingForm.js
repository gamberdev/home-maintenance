import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "./config";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [dateTime, setDateTime] = useState(null);
  const [issue, setIssue] = useState("");
  const [address, setAddress] = useState("");
  const [reservedSlots, setReservedSlots] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/bookings/month`);
        const bookedTimes = res.data.map((booking) =>
          moment(booking.date_time)
        );
        setReservedSlots(bookedTimes);
      } catch (err) {
        console.error("Error fetching reservations:", err.message);
      }
    };

    fetchReservations();
  }, []);

  const isValidDateTime = (current) => {
    if (!current || !current.isValid()) return false;

    const now = moment();
    if (current.isBefore(now)) return false;

    for (let reserved of reservedSlots) {
      const diff = Math.abs(current.diff(reserved, "minutes"));
      if (diff < 120) return false; // must be at least 2 hours apart
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateTime || !isValidDateTime(moment(dateTime))) {
      alert(
        "Invalid time selected. Must be at least 2 hours from existing bookings."
      );
      return;
    }

    const bookingData = {
      name,
      contact,
      email,
      date_time: moment(dateTime).toISOString(),
      specific_issues: issue,
      address,
    };

    try {
      const response = await axios.post(`${apiUrl}/api/bookings`, bookingData);
      console.log("Booking successful:", response.data);
      alert(response.data.message || "Booking confirmed!");

      // Reset form
      setName("");
      setContact("");
      setEmail("");
      setDateTime(null);
      setIssue("");
      setAddress("");

      // Refresh reserved slots
      setReservedSlots((prev) => [...prev, moment(dateTime)]);
    } catch (error) {
      console.error(
        "Error booking service:",
        error.response?.data || error.message
      );
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="form-row">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="contact">Mobile No:</label>
        <input
          id="contact"
          type="text"
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="email">Email Address:</label>
        <input
          id="email"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="dateTime">Date & Time:</label>
        <input
          id="dateTime"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />
      </div>

      {dateTime &&
        reservedSlots.includes(
          new Date(dateTime).toISOString().slice(0, 16)
        ) && (
          <div className="form-row" style={{ gridColumn: "span 2" }}>
            <p style={{ color: "red", margin: 0 }}>
              This time slot is already reserved. Please select another.
            </p>
          </div>
        )}

      <div className="form-row">
        <label htmlFor="issue">Issue:</label>
        <input
          id="issue"
          type="text"
          placeholder="Issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="address">Address:</label>
        <input
          id="address"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div
        className="form-row"
        style={{ gridColumn: "span 2", textAlign: "center" }}
      >
        <button type="submit">Book Service</button>
        <div
          className="form-row"
          style={{ gridColumn: "span 2", textAlign: "center" }}
        >
          <button type="button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
