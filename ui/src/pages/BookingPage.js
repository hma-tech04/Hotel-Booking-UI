import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/booking-page.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function BookingPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  
  const [roomData, setRoomData] = useState(null);
  const [formData, setFormData] = useState({
    UserId: "",
    FullName: "",
    Email: "",
    Phone: "",
    CheckInDate: "",
    CheckOutDate: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.nameid;
        if (!userId) {
          throw new Error("Không tìm thấy nameid trong token");
        }
        fetchUserInfo(userId);
      } catch (error) {
        console.error("Error decoding token in BookingPage:", error.message);
        setError("Không thể giải mã token. Vui lòng đăng nhập lại.");
      }
    } else {
      setError("Không tìm thấy token. Vui lòng đăng nhập.");
    }
  }, []);

  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5053/api/rooms/${roomId}`);
        const data = response.data.data;
        if (data) {
          setRoomData({
            RoomId: data.roomId,
            RoomType: data.roomType || "Unknown Room Type",
            Price: data.price || 129.0,
            ImageUrl: data.thumbnailUrl 
              ? `http://localhost:5053${data.thumbnailUrl.replace(/\\/g, "/")}` 
              : "/images/placeholder-room.jpg"
          });
        } else {
          throw new Error("Room data not found");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
        setError("Không thể tải thông tin phòng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomData();
  }, [roomId]);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5053/api/user/id/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.code === 200 && response.data.data) {
        const userData = response.data.data;
        setFormData((prev) => ({
          ...prev,
          UserId: userId,
          FullName: userData.fullName || "",
          Email: userData.email || "",
          Phone: userData.phoneNumber || "",
        }));
      } else {
        throw new Error(response.data.message || "Dữ liệu người dùng không hợp lệ");
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error.message);
      setError(`Không thể tải thông tin người dùng: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Phone") {
      const numericValue = value.replace(/\D/g, "");
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

  const nights = formData.CheckInDate && formData.CheckOutDate 
    ? calculateNights(formData.CheckInDate, formData.CheckOutDate) 
    : 0;
  const totalAmount = roomData ? roomData.Price * nights : 0;

  const checkPaymentStatus = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:5053/api/payment/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Payment status response:", JSON.stringify(response.data, null, 2));
      if (response.data.code === 200 && response.data.data.length > 0) {
        const payment = response.data.data[0];
        // Kiểm tra paymentStatus thay vì isSuccess
        const isSuccess = payment.paymentStatus === "Success";
        console.log(`Payment status: ${payment.paymentStatus}, isSuccess: ${isSuccess}`);
        return isSuccess;
      }
      console.log("No payment data found or code !== 200");
      return false;
    } catch (error) {
      console.error("Error checking payment status:", error.response ? error.response.data : error.message);
      return false;
    }
  };

  const handlePayment = async () => {
    if (!formData.FullName || !formData.Phone || !formData.Email || !formData.CheckInDate || !formData.CheckOutDate) {
      alert("Vui lòng nhập đầy đủ thông tin khách hàng và ngày nhận/trả phòng!");
      return;
    }
    if (formData.Phone.length !== 10) {
      alert("Vui lòng nhập số điện thoại hợp lệ!");
      return;
    }

    const bookingRequest = {
      userId: parseInt(formData.UserId),
      roomId: parseInt(roomId),
      checkInDate: formData.CheckInDate + ":00",
      checkOutDate: formData.CheckOutDate + ":00",
      PhoneNumber: formData.Phone
    };

    console.log("Booking Request JSON:", JSON.stringify(bookingRequest, null, 2));

    setLoading(true);

    try {
      const bookingResponse = await axios.post("http://localhost:5053/api/bookings", bookingRequest, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Booking Response JSON:", JSON.stringify(bookingResponse.data, null, 2));

      if (bookingResponse.data.code === 200) {
        const bookingId = bookingResponse.data.data.bookingId;
        setBookingId(bookingId);

        const paymentRequest = {
          amount: totalAmount,
          orderId: bookingId.toString()
        };

        console.log("Payment Request JSON:", JSON.stringify(paymentRequest, null, 2));

        const paymentResponse = await axios.post("http://localhost:5053/api/vnpay/create-payment", paymentRequest, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Payment Response JSON:", JSON.stringify(paymentResponse.data, null, 2));

        if (paymentResponse.data.code === 200) {
          const paymentUrl = paymentResponse.data.data;
          window.open(paymentUrl, "_blank");

          // Polling trạng thái thanh toán
          const interval = setInterval(async () => {
            const paid = await checkPaymentStatus(bookingId);
            setIsPaid(paid);
            console.log(`Polling payment status for booking ${bookingId}: ${paid}`);
            if (paid) {
              clearInterval(interval);
              navigate(`/payment-result?paymentStatus=Payment%20successfully&orderId=${bookingId}`);
            }
          }, 2000);

          // Dừng polling sau 5 phút
          setTimeout(() => {
            clearInterval(interval);
            if (!isPaid) {
              console.log("Polling timeout - payment not completed");
              alert("Hết thời gian chờ thanh toán! Vui lòng kiểm tra lại trạng thái.");
            }
          }, 300000);
        } else {
          alert("Tạo thanh toán thất bại: " + paymentResponse.data.message);
        }
      } else {
        alert("Đặt phòng thất bại: " + bookingResponse.data.message);
      }
    } catch (error) {
      console.error("Error during booking or payment creation:", error);
      alert("Đã xảy ra lỗi khi xử lý đặt phòng hoặc thanh toán. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!roomData) {
    return <div>Loading room data...</div>;
  }

  return (
    <div>
      <h2 className="titles">Xác nhận đặt phòng</h2>
      <div className="booking-content">
        <div className="booking-left-column">
          <h3>Phòng đã chọn</h3>
          <div className="room-detail-card">
            <div className="room-image">
              <img
                src={roomData.ImageUrl}
                alt={roomData.RoomType}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder-room.jpg";
                }}
              />
            </div>
            <div className="room-details-list">
              <div className="room-detail-row">
                <span className="detail-label">Kiểu phòng</span>
                <span className="detail-value">{roomData.RoomType}</span>
              </div>
              <div className="room-detail-row">
                <span className="detail-label">Giá / Đêm</span>
                <span className="detail-value prices">{roomData.Price.toFixed(2)}vnđ</span>
              </div>
            </div>
            <Link to={`/room/${roomData.RoomId}`} className="btn room-detail-btn">
              Xem chi tiết
            </Link>
          </div>
        </div>

        <div className="booking-right-column">
          <div className="customer-section">
            <h3>Thông tin khách hàng</h3>
            <input
              type="text"
              name="FullName"
              placeholder="Họ và tên"
              value={formData.FullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="Email"
              placeholder="Email"
              value={formData.Email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="Phone"
              placeholder="Số điện thoại"
              value={formData.Phone}
              onChange={handleChange}
              required
              maxLength={10}
            />
            <div className="date-selection">
              <div className="box">
                <label>Check-in:</label>
                <input
                  type="datetime-local"
                  name="CheckInDate"
                  value={formData.CheckInDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="box">
                <label>Check-out:</label>
                <input
                  type="datetime-local"
                  name="CheckOutDate"
                  value={formData.CheckOutDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="payment-section">
            <h3>Thông tin thanh toán</h3>
            <p>
              <strong>Số đêm: </strong>
              <span className="nights-count">{nights}</span>
            </p>
            <p>
              <strong>Tổng tiền: </strong>
              <span className="total-prices">{totalAmount.toFixed(2)}vnđ</span>
            </p>
            <button className="btn pay-btn" onClick={handlePayment} disabled={loading}>
              {loading ? "Đang xử lý..." : "Thanh toán"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;