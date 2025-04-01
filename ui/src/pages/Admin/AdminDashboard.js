// src/pages/Admin/AdminDashboard.js
import React from 'react';
import HeaderAdmin from '../../components/HeaderAdmin';
import FooterAdmin from '../../components/FooterAdmin';
import '../../styles/admin.css';

function AdminDashboard() {
  return (
    <>
      <HeaderAdmin />
      <div className="admin-dashboard-container">
        <h2>Admin Dashboard</h2>
        <div className="statistics">
          <div className="stat-item">
            <h3>Total Rooms</h3>
            <p>50</p>
          </div>
          <div className="stat-item">
            <h3>Total Users</h3>
            <p>120</p>
          </div>
          <div className="stat-item">
            <h3>Total Bookings</h3>
            <p>30</p>
          </div>
        </div>
        {/* Add charts here, e.g., using Chart.js */}
      </div>
      <FooterAdmin />
    </>
  );
}

export default AdminDashboard;
