import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/booking-page.css";

function BookingPage() {
  const navigate = useNavigate();

  const HotelBookingContext = {
    BookingId: 101,
    customer: {
      UserId: 1,
      FullName: "Nguyễn Văn A",
      Email: "nguyenvana@example.com",
    },
    rooms: [
      {
        RoomId: 1,
        RoomType: "Superior Single Room",
        Price: 129.0,
        ImageUrl: "/images/superior-single.jpg",
      },
    ],
  };

  const [formData, setFormData] = useState({
    ...HotelBookingContext.customer,
    CheckInDate: "",
    CheckOutDate: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateNights = (checkIn, checkOut) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    return Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 1);
  };

  const nights = formData.CheckInDate && formData.CheckOutDate ? calculateNights(formData.CheckInDate, formData.CheckOutDate) : 0;
  const totalAmount = HotelBookingContext.rooms.reduce((total, room) => total + room.Price * nights, 0);

  const handlePayment = () => {
    if (!formData.FullName || !formData.Phone || !formData.Email || !formData.CheckInDate || !formData.CheckOutDate) {
      alert("Vui lòng nhập đầy đủ thông tin khách hàng và ngày nhận/trả phòng!");
      return;
    }
    alert(`Thanh toán thành công! \nTổng tiền: $${totalAmount.toFixed(2)}`);
    navigate("/");
  };

  return (
    <div>
      <h2>Xác nhận đặt phòng</h2>
      <div className="booking-content">
        <div className="booking-left-column">
          <h3>Phòng đã chọn</h3>
          {HotelBookingContext.rooms.map((room) => (
            <div key={room.RoomId} className="room-detail-card">
              <div className="room-image">
                <img src={room.ImageUrl} alt={room.RoomType} onError={(e) => { e.target.onerror = null; e.target.src = "src/images/placeholder-room.jpg"; }} />
              </div>
              <div className="room-details-list">
                <div className="room-detail-row">
                  <span className="detail-label">Kiểu phòng</span>
                  <span className="detail-value">{room.RoomType}</span>
                </div>
                <div className="room-detail-row">
                  <span className="detail-label">Giá / Đêm</span>
                  <span className="detail-value price">${room.Price.toFixed(2)}</span>
                </div>
              </div>
              <button className="btn room-detail-btn">Xem chi tiết</button>
            </div>
          ))}
        </div>

        <div className="booking-right-column">
          <h3>Thông tin khách hàng</h3>
          <input type="text" name="Phone" placeholder="Số điện thoại" value={formData.Phone} onChange={handleChange} required />

          <div className="date-selection">
            <div className="box">
              <label>Check-in:</label>
              <input type="date" name="CheckInDate" value={formData.CheckInDate} onChange={handleChange} required />
            </div>
            <div className="box">
              <label>Check-out:</label>
              <input type="date" name="CheckOutDate" value={formData.CheckOutDate} onChange={handleChange} required />
            </div>
          </div>

          <h3>Thông tin thanh toán</h3>
          <p><strong>Số đêm: </strong><span className="nights-count">{nights}</span></p>
          <p><strong>Tổng tiền: </strong><span className="total-price">${totalAmount.toFixed(2)}</span></p>

          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="momo">VNPay</option>
            <option value="credit-card">Thẻ tín dụng</option>
            <option value="bank-transfer">Chuyển khoản ngân hàng</option>
          </select>
          <button className="btn pay-btn" onClick={handlePayment}>Thanh toán</button>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;