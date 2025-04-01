// src/pages/Report.js
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các module của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Report = () => {
  // Dữ liệu cho biểu đồ doanh thu theo tháng
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [1200, 1500, 1800, 2200, 2500, 2800],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn cho biểu đồ doanh thu theo tháng
  const revenueOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Revenue Report',
        font: { size: 20 },
      },
    },
  };

  // Dữ liệu cho biểu đồ cột (doanh thu theo sản phẩm)
  const productData = {
    labels: ['Room A', 'Room B', 'Room C', 'Room D'],
    datasets: [
      {
        label: 'Revenue from Rooms ($)',
        data: [5000, 4000, 3000, 7000],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn cho biểu đồ cột
  const productOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue by Room Type',
        font: { size: 20 },
      },
    },
  };

  return (
    <div className="report-container">
      <h2>Admin Dashboard - Revenue Report</h2>
      <div className="charts-container">
        <div className="chart">
          <h3>Monthly Revenue</h3>
          <Line data={revenueData} options={revenueOptions} />
        </div>
        <div className="chart">
          <h3>Revenue by Room Type</h3>
          <Bar data={productData} options={productOptions} />
        </div>
      </div>
    </div>
  );
};

export default Report;
