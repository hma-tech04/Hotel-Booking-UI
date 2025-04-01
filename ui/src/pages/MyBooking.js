// src/pages/BookingManagement.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/style.css';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Gọi API /api/bookings/user/{userId} để lấy danh sách đặt phòng của người dùng
    // Dữ liệu mẫu:
    setBookings([
      { id: 1, roomType: "Superior Single Room", checkIn: "2023-04-01", checkOut: "2023-04-05", total: 500, status: "Chưa thanh toán" },
      { id: 2, roomType: "Deluxe Double Room", checkIn: "2023-05-10", checkOut: "2023-05-15", total: 750, status: "Đã thanh toán" }
    ]);
  }, []);

  const handleCancel = (id) => {
    // Gọi API /api/bookings/{id}/cancel để hủy đặt phòng
    console.log("Hủy đặt phòng:", id);
  };

  const handlePayment = (id) => {
    // Gọi API /api/payments/online để thanh toán online
    console.log("Thanh toán đặt phòng:", id);
  };

  return (
    <>
      <div className="booking-management-container">
        <h2>Quản lý đặt phòng</h2>
        <table>
          <thead>
            <tr>
              <th>Loại phòng</th>
              <th>Ngày nhận</th>
              <th>Ngày trả</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.roomType}</td>
                <td>{booking.checkIn}</td>
                <td>{booking.checkOut}</td>
                <td>${booking.total}</td>
                <td>{booking.status}</td>
                <td>
                  {booking.status === "Chưa thanh toán" && (
                    <>
                      <button onClick={() => handlePayment(booking.id)}>Thanh toán online</button>
                      <button onClick={() => handleCancel(booking.id)}>Hủy đặt phòng</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

export default BookingManagement;
