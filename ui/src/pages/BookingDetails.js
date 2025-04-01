import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/booking-detail.css";

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
    <div className="booking-details">
      <h2 className="title">Chi tiết đơn đặt phòng #{booking.BookingId}</h2>
      
      {booking.rooms.map((room, index) => (
        <div key={index} className="room-card">
          <div className="room-header">
            <h4>{room.RoomType}</h4>
          </div>
          <div className="room-details">
            <div className="detail-item">
              <span className="label">Ngày nhận phòng:</span>
              <span className="value">{room.CheckInDate}</span>
            </div>
            <div className="detail-item">
              <span className="label">Ngày trả phòng:</span>
              <span className="value">{room.CheckOutDate}</span>
            </div>
            <div className="detail-item">
              <span className="label">Số đêm:</span>
              <span className="value">{calculateNights(room.CheckInDate, room.CheckOutDate)}</span>
            </div>
            <div className="detail-item price">
              <span className="label">Giá phòng:</span>
              <span className="value">{room.Price}vnđ</span>
            </div>
            <div className="total-price">
              <span className="label">Tổng tiền:</span>
              <span className="value">{booking.TotalPrice}vnđ</span>
            </div>
          </div>
        </div>
      ))}
      {/* Nút quay lại */}
      <button 
        className="btn-back" 
        onClick={() => navigate(-1)} 
      >
        Quay lại
      </button>
    </div>
  );
}

export default BookingDetails;