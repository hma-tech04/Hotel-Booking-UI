import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/booking-page.css";
import { Link } from "react-router-dom";

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
        ImageUrl: "/images/r1.jpg",
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
    const { name, value } = e.target;
  
    if (name === "Phone") {
      // Chỉ cho phép nhập số và kiểm tra độ dài
      const numericValue = value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    if (formData.Phone.length !== 10) {
      alert("Vui lòng nhập số điện thoại hợp lệ!");
      return;
    }
    alert(`Thanh toán thành công! \nTổng tiền: ${totalAmount.toFixed(2)}vnđ`);
    navigate("/");
  };

  return (
    <div>
      <h2 className="titles">Xác nhận đặt phòng</h2>
      <div className="booking-content">
        <div className="booking-left-column">
          <h3>Phòng đã chọn</h3>
          {HotelBookingContext.rooms.map((room) => (
            <div key={room.RoomId} className="room-detail-card">
              <div className="room-image">
                <img src={room.ImageUrl} alt={room.RoomType} onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder-room.jpg"; }} />
              </div>
              <div className="room-details-list">
                <div className="room-detail-row">
                  <span className="detail-label">Kiểu phòng</span>
                  <span className="detail-value">{room.RoomType}</span>
                </div>
                <div className="room-detail-row">
                  <span className="detail-label">Giá / Đêm</span>
                  <span className="detail-value prices">{room.Price.toFixed(2)}vnđ</span>
                </div>
              </div>
              <Link to={`/room/${room.RoomId}`} className="btn room-detail-btn">Xem chi tiết</Link>
            </div>
          ))}
        </div>

        <div className="booking-right-column">
          <div className="customer-section">
            <h3>Thông tin khách hàng</h3>

            <input type="text" name="Phone" placeholder="Số điện thoại" value={formData.Phone} onChange={handleChange} required maxLength={10}/>

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
          </div>

          <div className="payment-section">
            <h3>Thông tin thanh toán</h3>

            <p><strong>Số đêm: </strong><span className="nights-count">{nights}</span></p>
            <p><strong>Tổng tiền: </strong><span className="total-prices">{totalAmount.toFixed(2)}vnđ</span></p>

            
            <button className="btn pay-btn" onClick={handlePayment}>Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;