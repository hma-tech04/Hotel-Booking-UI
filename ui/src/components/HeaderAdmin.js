// src/components/HeaderAdmin.js
import React from 'react';
import { Link } from 'react-router-dom';

function HeaderAdmin() {
  return (
    <header>
      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/booking-management">Booking Management</Link>
        <Link to="/admin/users-management">Users Management</Link>
        <Link to="/admin/reports">Reports</Link>
        <button onClick={() => { localStorage.removeItem('userToken'); window.location.href = '/'; }}>Logout</button>
      </nav>
    </header>
  );
}

export default HeaderAdmin;
