import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/booking.css";

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setBookings([
      {
        id: 1,
        userId: 1,
        total: 500,
        rooms: [
          { roomType: "Superior Single Room", checkIn: "2023-04-01", checkOut: "2023-04-05",price: 200 },
          { roomType: "Deluxe Double Room", checkIn: "2023-04-01", checkOut: "2023-04-05",price: 300 }
        ],
      },
      {
        id: 2,
        userId: 2,
        total: 750,
        rooms: [
          { roomType: "Luxury Suite", checkIn: "2023-05-10", checkOut: "2023-05-15",price: 750 }
        ],
      }
    ]);

    setUsers([
      { id: 1, name: "Nguyễn Văn A", phone: "0123456789" },
      { id: 2, name: "Trần Thị B", phone: "0987654321" }
    ]);
  }, []);

  return (
    <div className="container">
      <h2 className="title">Quản lý đặt phòng</h2>
      <div className="table-container">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Tên Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Mã đơn</th>
              <th>Tổng tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const user = users.find((u) => u.id === booking.userId);
              return (
                <tr key={booking.id}>
                  <td>{user ? user.name : "Không xác định"}</td>
                  <td>{user ? user.phone : "Không xác định"}</td>
                  <td>{booking.id}</td>
                  <td className="price">${booking.total}</td>
                  <td className="actions">
                    <Link to={`/booking-details/${booking.id}`} className="btn view">Xem</Link>
                    {/*<button className="btn edit">Sửa</button>*/}
                    {/*<button className="btn delete">Xóa</button>*/}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingManagement
