import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import ForgotPassword from './pages/ForgotPassword'; // Giữ nếu bạn có file này
import ResetPassword from './pages/ResetPassword'; // Thêm import cho ResetPassword
import HotelManagement from './HotelManagement';
import EditProfile from './components/EditProfile';

function App() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const updateAdminStatus = (token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role?.toLowerCase() === 'admin');
        setIsAuthenticated(true);
        if (location.pathname === '/login' || location.pathname === '/register') {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error decoding token in App.js:', error);
        setIsAdmin(false);
        setIsAuthenticated(false);
      }
    } else {
      setIsAdmin(false);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    updateAdminStatus(token);
  }, [location.pathname]);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
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
              <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Giữ nếu cần */}
              <Route path="/reset-password" element={<ResetPassword />} /> {/* Thêm route mới */}
              <Route
                path="/booking-details/:bookingId"
                element={<ProtectedRoute><BookingDetails /></ProtectedRoute>}
              />
              <Route
                path="/booking-page/:roomId"
                element={<ProtectedRoute><BookingPage /></ProtectedRoute>}
              />
              <Route
                path="/edit-profile"
                element={<ProtectedRoute><EditProfile /></ProtectedRoute>}
              />
              <Route
                path="/booking-management"
                element={<ProtectedRoute><BookingManagement /></ProtectedRoute>}
              />
              <Route
                path="/admin"
                element={<AdminRoute><HotelManagement /></AdminRoute>}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;