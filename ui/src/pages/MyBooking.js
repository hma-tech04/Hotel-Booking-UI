// src/pages/MyBookings.js
import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import { useAuthToken } from '../useAuthToken'; // Import useAuthToken với đường dẫn đúng
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
  const { accessToken } = useAuthToken(); // Sử dụng useAuthToken
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!accessToken) {
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.nameid;
        if (!userId) {
          throw new Error("User ID not found in token");
        }

        const response = await fetch(`http://localhost:5053/api/bookings/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Sử dụng accessToken
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        // Chuyển đổi dữ liệu từ API thành định dạng tương thích
        const transformedBookings = data.data.map((booking) => ({
          id: booking.bookingId,
          roomType: `Room ${booking.roomId}`, // Giả định roomId thay cho roomType
          checkIn: booking.checkInDate.split('T')[0],
          checkOut: booking.checkOutDate.split('T')[0],
          total: booking.totalPrice,
          status: booking.bookingStatus === 'Pending' ? 'Chưa thanh toán' : 'Đã thanh toán',
        }));

        setBookings(transformedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Dữ liệu mẫu nếu API thất bại
        setBookings([
          { id: 1, roomType: "Superior Single Room", checkIn: "2023-04-01", checkOut: "2023-04-05", total: 500, status: "Chưa thanh toán" },
          { id: 2, roomType: "Deluxe Double Room", checkIn: "2023-05-10", checkOut: "2023-05-15", total: 750, status: "Đã thanh toán" },
        ]);
      }
    };

    fetchBookings();
  }, [accessToken, navigate]); // Thêm accessToken vào dependencies

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`http://localhost:5053/api/bookings/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Sử dụng accessToken
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      console.log("Hủy đặt phòng:", id);
      setBookings(bookings.filter((booking) => booking.id !== id)); // Cập nhật danh sách sau khi hủy
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Hủy đặt phòng thất bại!');
    }
  };

  const handlePayment = async (id) => {
    try {
      const booking = bookings.find((b) => b.id === id);
      const paymentRequest = {
        amount: booking.total,
        orderId: id.toString(),
      };

      const response = await fetch('http://localhost:5053/api/vnpay/create-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Sử dụng accessToken
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      const result = await response.json();
      if (result.code === 200) {
        window.open(result.data, '_blank'); // Mở URL thanh toán trong tab mới
        console.log("Thanh toán đặt phòng:", id);
      } else {
        throw new Error(result.message || 'Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Thanh toán thất bại!');
    }
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
    </>
  );
}

export default MyBookings;