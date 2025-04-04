// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { CssBaseline } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomCardDisplay from './pages/RoomCardDisplay';
import RoomDetail from './pages/RoomDetail';
import BookingManagement from './pages/BookingManagement';
import BookingDetails from './pages/BookingDetails';
import BookingPage from './pages/BookingPage';
import ForgotPassword from './pages/ForgotPassword';
import HotelManagement from './HotelManagement';
import EditProfile from './components/EditProfile'; // Add this import

function App() {
  const [isAdmin, setIsAdmin] = useState(null);

  const updateAdminStatus = (token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role.toLowerCase() === 'admin');
      } catch (error) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="403757915006-h5db3tft1bmon6g7tsopr02gculscv2d.apps.googleusercontent.com">
      <div className="page-wrapper">
        <CssBaseline />
        <Header isAdmin={isAdmin} updateAdminStatus={updateAdminStatus} />
        <main
          style={{
            flex: '1 0 auto',
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            width: '100%',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login updateAdminStatus={updateAdminStatus} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rooms" element={<RoomCardDisplay />} />
              <Route path="/room/:roomId" element={<RoomDetail />} />
              <Route path="/booking-details/:bookingId" element={<BookingDetails />} />
              <Route path="/booking-page/:roomId" element={<BookingPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/booking-management"
                element={isAdmin ? <BookingManagement /> : <Navigate to="/" />}
              />
              <Route
                path="/admin"
                element={isAdmin ? <HotelManagement /> : <Navigate to="/" />}
              />
              <Route 
                path="/edit-profile" 
                element={<EditProfile />} 
              /> {/* Added EditProfile route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;