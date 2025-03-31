import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/booking-page.css";

function BookingPage() {
  const navigate = useNavigate();

  // Dữ liệu mẫu: Một đơn đặt phòng có nhiều phòng với ngày nhận và ngày trả
  const bookingData = {
    id: 101,
    customer: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
      email: "nguyenvana@example.com",
    },
    rooms: [
      { 
        id: 1, 
        name: "Superior Single Room", 
        price: 129.00, 
        checkIn: "2024-04-10", 
        checkOut: "2024-04-12",
        image: "/images/superior-single.jpg" // Đường dẫn tới ảnh phòng 
      },
    ],
  };

  const [customerInfo, setCustomerInfo] = useState(bookingData.customer);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Hàm tính số ngày thuê dựa trên checkIn và checkOut
  const calculateNights = (checkIn, checkOut) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    return Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 1);
  };

  // Tính tổng tiền (giá phòng * số ngày thuê)
  const calculateRoomTotal = (price, nights) => {
    return price * nights;
  };

  // Tính tổng tiền của tất cả phòng
  const totalAmount = bookingData.rooms.reduce(
    (total, room) => total + calculateRoomTotal(room.price, calculateNights(room.checkIn, room.checkOut)),
    0
  );

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      alert("Vui lòng nhập đầy đủ thông tin khách hàng!");
      return;
    }

    alert(`Thanh toán thành công! \nTổng tiền: $${totalAmount.toFixed(2)}`);
    navigate("/");
  };

  return (
    <div className="booking-container">
      <h2>Xác nhận đặt phòng</h2>

      <div className="booking-content">
        {/* Left column: Customer info and payment */}
        <div className="booking-left-column">
          {/* Form nhập thông tin khách hàng */}
          <div className="customer-info">
            <h3>Thông tin khách hàng</h3>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={customerInfo.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={customerInfo.phone}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={customerInfo.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Thông tin thanh toán */}
          <div className="payment-info">
            <h3>Thông tin thanh toán</h3>
            <div className="payment-room-list">
              {bookingData.rooms.map((room) => (
                <p key={room.id} className="payment-room-item">
                  {room.name} - <span className="price">${room.price.toFixed(2)} / đêm</span>
                </p>
              ))}
            </div>
            <p><strong>Tổng tiền:</strong> <span className="total-price">${totalAmount.toFixed(2)}</span></p>
            
            <label>Chọn phương thức thanh toán:</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="credit-card">Thẻ tín dụng</option>
              <option value="momo">Momo</option>
              <option value="bank-transfer">Chuyển khoản ngân hàng</option>
            </select>
          </div>

          {/* Nút thanh toán */}
          <button className="btn pay-btn" onClick={handlePayment}>Thanh toán</button>
        </div>

        {/* Right column: Selected rooms */}
        <div className="booking-right-column">
          <div className="selected-rooms">
            <h3>Phòng đã chọn</h3>
            
            {bookingData.rooms.map((room) => {
              const nights = calculateNights(room.checkIn, room.checkOut);
              const roomTotal = calculateRoomTotal(room.price, nights);
              
              return (
                <div key={room.id} className="room-detail-card">
                  {/* Room image */}
                  <div className="room-image">
                    <img src={room.image} alt={room.name} onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder-room.jpg";
                    }} />
                  </div>
                  
                  {/* Room details list */}
                  <div className="room-details-list">
                    <div className="room-detail-row">
                      <span className="detail-label">Tên phòng</span>
                      <span className="detail-value">{room.name}</span>
                    </div>
                    
                    <div className="room-detail-row">
                      <span className="detail-label">Giá / Đêm</span>
                      <span className="detail-value price">${room.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="room-detail-row">
                      <span className="detail-label">Ngày nhận</span>
                      <span className="detail-value">{room.checkIn}</span>
                    </div>
                    
                    <div className="room-detail-row">
                      <span className="detail-label">Ngày trả</span>
                      <span className="detail-value">{room.checkOut}</span>
                    </div>
                    
                    <div className="room-detail-row">
                      <span className="detail-label">Số ngày</span>
                      <span className="detail-value">{nights}</span>
                    </div>
                    
                    <div className="room-detail-row total-row">
                      <span className="detail-label">Thành tiền</span>
                      <span className="detail-value total-price">${roomTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;