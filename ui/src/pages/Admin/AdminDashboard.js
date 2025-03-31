// src/pages/Admin/AdminDashboard.js
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../styles/style.css';

function AdminDashboard() {
  // Dữ liệu thống kê mẫu, có thể gọi API để lấy dữ liệu thực tế
  return (
    <>
      <Header />
      <div className="admin-dashboard-container">
        <h2>Dashboard Admin</h2>
        <div className="statistics">
          <div className="stat-item">
            <h3>Số phòng</h3>
            <p>50</p>
          </div>
          <div className="stat-item">
            <h3>Số người dùng</h3>
            <p>120</p>
          </div>
          <div className="stat-item">
            <h3>Số đặt phòng</h3>
            <p>30</p>
          </div>
        </div>
        {/* Có thể tích hợp biểu đồ thống kê bằng thư viện Chart.js hoặc Recharts */}
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
