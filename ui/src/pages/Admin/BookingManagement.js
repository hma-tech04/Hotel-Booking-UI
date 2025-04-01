// src/pages/Admin/BookingManagement.js
import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/HeaderAdmin';
import FooterAdmin from '../../components/FooterAdmin';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Giả sử có API hoặc dữ liệu mẫu
    const dummyBookings = [
      { id: 1, roomName: 'Deluxe Suite', user: 'John Doe', status: 'Confirmed' },
      { id: 2, roomName: 'Standard Room', user: 'Jane Smith', status: 'Pending' },
    ];
    setBookings(dummyBookings);
  }, []);

  return (
    <>
      <HeaderAdmin />
      <div className="container">
        <h2>Booking Management</h2>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Room Name</th>
              <th>User</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.roomName}</td>
                <td>{booking.user}</td>
                <td>{booking.status}</td>
                <td>
                  <button onClick={() => alert(`View booking ${booking.id}`)}>View</button>
                  <button onClick={() => alert(`Delete booking ${booking.id}`)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FooterAdmin />
    </>
  );
}

export default BookingManagement;
