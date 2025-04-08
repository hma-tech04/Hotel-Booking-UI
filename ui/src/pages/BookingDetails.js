import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/booking-detail.css";
import { useAuthToken } from "../useAuthToken"; // Import useAuthToken với đường dẫn đúng

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuthToken(); // Sử dụng useAuthToken
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await fetch(`http://localhost:5053/api/payment/booking/${bookingId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, // Sử dụng accessToken
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again.");
          } else if (response.status === 403) {
            throw new Error("Forbidden: You do not have permission to view this booking.");
          } else if (response.status === 404) {
            throw new Error("Payment data not found for this booking.");
          }
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch payment data");
        }

        const paymentData = await response.json();
        setPayments(paymentData.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const bookingFromState = location.state?.booking;
    if (bookingFromState) {
      setBooking(bookingFromState);
      setUser({ UserId: bookingFromState.UserId, FullName: "Nguyễn Văn A", Email: "nguyenvana@gmail.com", Phone: "0123456789" });
    } else {
      setError("Không tìm thấy thông tin đơn đặt phòng.");
    }

    fetchPaymentData();
  }, [bookingId, navigate, location.state, accessToken]); // Thêm accessToken vào dependencies

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    const datePart = date.toISOString().split("T")[0];
    const timePart = date.toTimeString().split(" ")[0].slice(0, 5);
    return `${datePart} ${timePart}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "Không xác định";
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const formatPaymentStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Chưa thanh toán";
      case "Completed":
        return "Đã thanh toán";
      default:
        return status;
    }
  };

  const formatPaymentMethod = (method) => {
    if (method.toUpperCase() === "VNPAY") {
      return "VNPay";
    }
    return method;
  };

  if (loading) return <p className="loading-message">Đang tải...</p>;
  if (error) return <p className="error-message">Lỗi: {error}</p>;
  if (!booking || !user) return <p className="error-message">Đơn đặt phòng không tồn tại.</p>;

  return (
    <div className="booking-details">
      <h2 className="title">Chi tiết đơn đặt phòng #{booking.BookingId}</h2>

      {booking.rooms.map((room, index) => (
        <div key={index} className="room-card">
          <div className="room-details">
            <div className="detail-item">
              <span className="label">Thời gian nhận phòng thực tế:</span>
              <span className="value">{formatDateTime(room.actualCheckInTime)}</span>
            </div>

            <div className="detail-item">
              <span className="label">Thời gian trả phòng thực tế:</span>
              <span className="value">{formatDateTime(room.actualCheckOutTime)}</span>
            </div>

            <div className="detail-item">
              <span className="label">Số đêm:</span>
              <span className="value">{calculateNights(room.actualCheckInTime, room.actualCheckOutTime)}</span>
            </div>

            <div className="detail-item price">
              <span className="label">Giá phòng:</span>
              <span className="value">{room.Price}vnđ</span>
            </div>

            <div className="payment-section">
              <h3>Thông tin thanh toán</h3>
              {payments.length === 0 ? (
                <p>Không có thông tin thanh toán.</p>
              ) : (
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
                    {payments.map((payment) => (
                      <tr key={payment.paymentId}>
                        <td>{formatPaymentMethod(payment.paymentMethod)}</td>
                        <td>{payment.paymentAmount} vnđ</td>
                        <td>{formatDate(payment.paymentDate)}</td>
                        <td
                          className={
                            formatPaymentStatus(payment.paymentStatus) === "Đã thanh toán"
                              ? "status-paid"
                              : "status-unpaid"
                          }
                        >
                          {formatPaymentStatus(payment.paymentStatus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="total-price">
              <span className="label">Tổng tiền:</span>
              <span className="value">{booking.TotalPrice}vnđ</span>
            </div>

            <div className="detail-item">
              <span className="label">Trạng thái đặt phòng:</span>
              <span className="value">{booking.BookingStatus}</span>
            </div>
          </div>
        </div>
      ))}
      <button className="btn-back" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </div>
  );
}

export default BookingDetails;