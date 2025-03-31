// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomList from './components/RoomList'; // Import RoomList để hiển thị danh sách phòng
import RoomDetail from './pages/RoomDetail';
import BookingManagement from './pages/BookingManagement';
import BookingDetails from './pages/BookingDetails';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<RoomList />} /> {/* Cập nhật Route này để sử dụng RoomList */}
        <Route path="/room/:roomId" element={<RoomDetail />} /> {/* Đây là Route để hiển thị chi tiết từng phòng */}
        <Route path="/booking-management" element={<BookingManagement />} />
        <Route path="/booking-details/:bookingId" element={<BookingDetails />} /> {/* Route để xem chi tiết đơn đặt phòng */}
        <Route path="/booking-page/:roomId" element={<BookingPage />} /> {/* Route để đặt phòng */}
      </Routes>
    </div>
  );
}

export default App;
