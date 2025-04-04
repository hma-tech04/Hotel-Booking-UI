// src/App.js
import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomList from './components/RoomList'; // Import RoomList để hiển thị danh sách phòng
import RoomDetail from './pages/RoomDetail';
import BookingManagement from './pages/BookingManagement';
import BookingDetails from './pages/BookingDetails';
import BookingPage from './pages/BookingPage';
import ForgotPassword from './pages/ForgotPassword';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  // Kiểm tra quyền Admin từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <GoogleOAuthProvider clientId="403757915006-h5db3tft1bmon6g7tsopr02gculscv2d.apps.googleusercontent.com">
      <div>
        <Header />
        <Routes>
          {/* Routes cho User */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/room/:roomId" element={<RoomDetail />} />
          <Route path="/booking-management" element={<BookingManagement />} />
          <Route path="/booking-details/:bookingId" element={<BookingDetails />} /> {/* Route để xem chi tiết đơn đặt phòng */}
          <Route path="/booking-page/:roomId" element={<BookingPage />} /> {/* Route để đặt phòng */}

          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
