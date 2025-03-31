import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/booking.css";

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Dữ liệu giả lập
    const bookingsData = [
      {
        id: 1,
        userId: 1,
        total: 500,
        rooms: [
          { roomType: "Superior Single Room", checkIn: "2023-04-01", checkOut: "2023-04-05",price: 200 },
          { roomType: "Deluxe Double Room", checkIn: "2023-04-01", checkOut: "2023-04-05",price: 300 }
        ],
      },
      {
        id: 2,
        userId: 2,
        total: 750,
        rooms: [
          { roomType: "Luxury Suite", checkIn: "2023-05-10", checkOut: "2023-05-15",price: 750 }
        ],
      }
    ];

    const usersData = [
      { id: 1, name: "Nguyễn Văn A", phone: "0123456789" },
      { id: 2, name: "Trần Thị B", phone: "0987654321" }
    ];

    const foundBooking = bookingsData.find((b) => b.id === parseInt(bookingId));
    if (foundBooking) {
      setBooking(foundBooking);
      setUser(usersData.find((u) => u.id === foundBooking.userId));
    }
  }, [bookingId]);

  if (!booking || !user) return <p className="error-message">Đơn đặt phòng không tồn tại.</p>;

  return (
    <div className="booking-details-container">
      <button className="btn-back" onClick={() => navigate(-1)}>
         Quay lại
      </button>

      <h2 className="title">Chi tiết đơn đặt phòng #{booking.id}</h2>

      {/* Thông tin khách hàng */}
      <div className="card">
        <h3>Thông tin khách hàng</h3>
        <p><strong>Khách hàng:</strong> {user.name}</p>
        <p><strong>Số điện thoại:</strong> {user.phone}</p>
        <p><strong>Tổng tiền:</strong> ${booking.total}</p>
      </div>

      {/* Danh sách phòng */}
      <h3 className="room-title">Danh sách phòng</h3>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Loại phòng</th>
              <th>Ngày nhận</th>
              <th>Ngày trả</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            {booking.rooms.map((room, index) => (
              <tr key={index}>
                <td>{room.roomType}</td>
                <td>{room.checkIn}</td>
                <td>{room.checkOut}</td>
                <td>${room.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingDetails;
