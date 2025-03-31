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
        BookingId: 1,
        UserId: 1,
        TotalPrice: 500,
        rooms: [
          { RoomType: "Superior Single Room", CheckInDate: "2023-04-01", CheckOutDate: "2023-04-05", Price: 200 }
        ],
      },
      {
        BookingId: 2,
        UserId: 1,
        TotalPrice: 750,
        rooms: [
          { RoomType: "Luxury Suite", CheckInDate: "2023-05-10", CheckOutDate: "2023-05-15", Price: 750 }
        ],
      }
    ];

    const usersData = [
      { UserId: 1, FullName: "Nguyễn Văn A", Email: "nguyenvana@gmail.com", Phone: "0123456789" }
    ];

    const foundBooking = bookingsData.find((b) => b.BookingId === parseInt(bookingId));
    if (foundBooking) {
      setBooking(foundBooking);
      setUser(usersData.find((u) => u.UserId === foundBooking.UserId));
    }
  }, [bookingId]);

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  if (!booking || !user) return <p className="error-message">Đơn đặt phòng không tồn tại.</p>;

  return (
    <div>
      <h2 className="title">Chi tiết đơn đặt phòng #{booking.BookingId}</h2>

      {/* Thông tin khách hàng */}
      <h3 className="room-title">Thông tin khách hàng</h3>
      <div className="card">
        
        <p><strong>Họ và tên:</strong> {user.FullName}</p>
        <p><strong>Email:</strong> {user.Email}</p>
        <p><strong>Số điện thoại:</strong> {user.Phone}</p>
        
      </div>

      {/* Danh sách phòng */}
      <h3 className="room-title">Thông tin phòng</h3>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Loại phòng</th>
              <th>Ngày nhận</th>
              <th>Ngày trả</th>
              <th>Số đêm</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            {booking.rooms.map((room, index) => (
              <tr key={index}>
                <td>{room.RoomType}</td>
                <td>{room.CheckInDate}</td>
                <td>{room.CheckOutDate}</td>
                <td>{calculateNights(room.CheckInDate, room.CheckOutDate)}</td>
                <td>${room.Price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nút quay lại */}
      <button 
        className="btn-back" 
        onClick={() => navigate(-1)} 
        style={{ position: "absolute", right: "20px", bottom: "20px" }}
      >
        Quay lại
      </button>
    </div>
  );
}

export default BookingDetails;
