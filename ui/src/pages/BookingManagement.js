import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/booking.css";

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.nameid; // Lấy userId từ token
        if (!userId) {
          throw new Error("User ID not found in token");
        }

        const response = await fetch(`http://localhost:5053/api/bookings/user/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        const transformedBookings = data.data.map((booking) => ({
          BookingId: booking.bookingId,
          UserId: booking.userId,
          TotalPrice: booking.totalPrice,
          BookingStatus: booking.bookingStatus, // Thêm BookingStatus
          rooms: [
            {
              RoomType: `Room ${booking.roomId}`, // Có thể thay bằng API trả về RoomType thực tế nếu có
              CheckInDate: booking.checkInDate,
              CheckOutDate: booking.checkOutDate,
              Price: booking.totalPrice, // Giả sử giá phòng bằng tổng giá
              actualCheckInTime: booking.actualCheckInTime || null,
              actualCheckOutTime: booking.actualCheckOutTime || null,
            },
          ],
          Status: booking.bookingStatus, // Giữ đồng bộ với API
        }));

        setBookings(transformedBookings);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const calculateNights = (checkInDate, checkOutDate) => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Lịch sử đặt phòng</h2>
      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã phòng</th>
              <th>Ngày nhận dự kiến</th>
              <th>Ngày trả dự kiến</th>
              <th>Số đêm dự kiến</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) =>
              booking.rooms.map((room, roomIndex) => (
                <tr key={`${booking.BookingId}-${roomIndex}`}>
                  {roomIndex === 0 && <td rowSpan={booking.rooms.length}>{index + 1}</td>}
                  <td>{room.RoomType}</td>
                  <td>{formatDate(room.CheckInDate)}</td>
                  <td>{formatDate(room.CheckOutDate)}</td>
                  <td>{calculateNights(room.CheckInDate, room.CheckOutDate)}</td>
                  <td>{booking.TotalPrice}vnđ</td>
                  {roomIndex === 0 && <td rowSpan={booking.rooms.length}>{booking.Status}</td>}
                  <td className="actions">
                    <Link
                      to={`/booking-details/${booking.BookingId}`}
                      state={{
                        booking: {
                          BookingId: booking.BookingId,
                          UserId: booking.UserId,
                          TotalPrice: booking.TotalPrice,
                          BookingStatus: booking.Status, // Truyền trạng thái
                          rooms: [
                            {
                              RoomType: room.RoomType,
                              CheckInDate: room.CheckInDate,
                              CheckOutDate: room.CheckOutDate,
                              actualCheckInTime: room.actualCheckInTime,
                              actualCheckOutTime: room.actualCheckOutTime,
                              Price: room.Price,
                            },
                          ],
                        },
                      }}
                      className="btn view"
                    >
                      Xem
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingManagement;