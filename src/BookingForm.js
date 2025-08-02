// src/components/BookingForm.js
import React, { useState } from "react";
import axios from "axios";
import { apiUrl } from "./config";

const BookingForm = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [issue, setIssue] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      name,
      contact,
      email,
      date_time: dateTime,
      specific_issues: issue,
      address,
    };

    try {
      const response = await axios.post(`${apiUrl}/api/bookings`, bookingData);
      console.log("API URL:", apiUrl);
      console.log(response.data);
      alert(response.data.message || "Booking confirmed!");

      // Reset form
      setName("");
      setContact("");
      setEmail("");
      setDateTime("");
      setIssue("");
      setAddress("");
    } catch (error) {
      console.error(
        "Error booking service:",
        error.response?.data || error.message
      );
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="contact">Mobile No:</label>
      <input
        id="contact"
        type="text"
        placeholder="Contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
      />

        <label htmlFor="email">Email Address:</label>
        <input
          id="email"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

      <label htmlFor="dateTime">Date & Time:</label>
      <input
        id="dateTime"
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        required
      />

      <label htmlFor="issue">Issue:</label>
      <input
        id="issue"
        type="text"
        placeholder="Issue"
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        required
      />

      <label htmlFor="address">Address:</label>
      <input
        id="address"
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />

      <button type="submit">Book Service</button>
    </form>
  );
};

export default BookingForm;
