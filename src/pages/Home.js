// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Welcome to Home Maintenance Service</h1>
            <Link to="/booking">Book a Service</Link>
        </div>
    );
};

export default Home;