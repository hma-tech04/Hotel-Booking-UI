import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/booking.css";

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Dữ liệu giả lập
    setBookings([
      {
        BookingId: 1,
        UserId: 1,
        TotalPrice: 1000,
        rooms: [
          { RoomType: "Superior Single Room", CheckInDate: "2023-04-01", CheckOutDate: "2023-04-05", Price: 200 }
        ],
      },
      {
        BookingId: 2,
        UserId: 1,
        TotalPrice: 3750,
        rooms: [
          { RoomType: "Luxury Suite", CheckInDate: "2023-05-10", CheckOutDate: "2023-05-15", Price: 750 }
        ],
      }
    ]);

    setUsers([
      { UserId: 1, FullName: "Nguyễn Văn A", Phone: "0123456789" }
    ]);
  }, []);

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="container">
      <h2 className="title">Lịch sử đặt phòng</h2>
      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Kiểu phòng</th>
              <th>Số đêm</th>
              <th>Tổng tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              const user = users.find((u) => u.UserId === booking.UserId);
              return booking.rooms.map((room, roomIndex) => (
                <tr key={`${booking.BookingId}-${roomIndex}`}>
                  {roomIndex === 0 && <td rowSpan={booking.rooms.length}>{index + 1}</td>}
                  <td>{room.RoomType}</td>
                  <td>{calculateNights(room.CheckInDate, room.CheckOutDate)}</td>
                  <td>{booking.TotalPrice}vnđ</td>
                  {roomIndex === 0 && (
                    <td rowSpan={booking.rooms.length} className="actions">
                      <Link to={`/booking-details/${booking.BookingId}`} className="btn view">Xem</Link>
                    </td>
                  )}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingManagement;
