import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/booking-detail.css";

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const bookingsData = [
      {
        BookingId: 1,
        UserId: 1,
        TotalPrice: 500,
        BookingStatus: "Đã xác nhận",
        payments: [
          { PaymentId : 1,BookingId: 1, PaymentMethod: "VNPay", PaymentAmount: 200, PaymentDate: "2023-03-20", PaymentStatus: "Đã thanh toán" },
          { PaymentId: 2,BookingId: 1, PaymentMethod: "VNPay", PaymentAmount: 300, PaymentDate: "2023-03-25", PaymentStatus: "Chưa thanh toán" }
        ],
        rooms: [
          { RoomType: "Superior Single Room", CheckInDate: "2023-04-01", CheckOutDate: "2023-04-05", Price: 200 }
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
              <span className="value ">{room.Price}vnđ</span>
            </div>

            <div className="payment-section">
              <h3>Thông tin thanh toán</h3>
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Hình thức thanh toán</th>
                    <th>Số tiền</th>
                    <th>Ngày thanh toán</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.payments.map((payment) => (
                    <tr key={payment.PaymentId}>
                      <td>{payment.PaymentMethod}</td>
                      <td>{payment.PaymentAmount} vnđ</td>
                      <td>{payment.PaymentDate}</td>
                      <td className={payment.PaymentStatus === "Đã thanh toán" ? "status-paid" : "status-unpaid"}>{payment.PaymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="detail-item">
              <span className="label">Trạng thái đặt phòng:</span>
              <span className="value">{booking.BookingStatus}</span>
            </div>

            <div className="total-price">
              <span className="label">Tổng tiền:</span>
              <span className="value">{booking.TotalPrice}vnđ</span>
            </div>
          </div>
        </div>
      ))}
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