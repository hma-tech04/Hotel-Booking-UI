import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { CssBaseline } from '@mui/material';
import { useAuthToken } from './useAuthToken'; // Trỏ đúng đến src/AuthContext.js
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
import ResetPassword from './pages/ResetPassword';
import HotelManagement from './HotelManagement';
import EditProfile from './components/EditProfile';
import PaymentResult from './pages/PaymentResult';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuthToken();

  const updateAdminStatus = (token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role || decoded.Role || 'user';
        setIsAdmin(role.toLowerCase() === 'admin');
        setIsAuthenticated(true);
        console.log('Admin status updated:', role.toLowerCase() === 'admin');
        if (location.pathname === '/login' || location.pathname === '/register') {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error decoding token in App.js:', error);
        setIsAdmin(false);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    } else {
      setIsAdmin(false);
      setIsAuthenticated(false);
      console.log('Admin status reset');
    }
  };

  useEffect(() => {
    console.log('App useEffect - accessToken:', accessToken);
    if (accessToken) {
      updateAdminStatus(accessToken);
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [accessToken]);

  const ProtectedRoute = ({ children }) => {
    if (!accessToken || !isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!accessToken || !isAuthenticated || !isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <GoogleOAuthProvider clientId="297963829947-t0gnsrpfcauqlh6dumpi5dph8q27k5ug.apps.googleusercontent.com">
      <div className="page-wrapper">
        <CssBaseline />
        <Header isAdmin={isAdmin} updateAdminStatus={updateAdminStatus} />
        <main className="main-content">
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login updateAdminStatus={updateAdminStatus} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rooms" element={<RoomCardDisplay />} />
              <Route path="/room/:roomId" element={<RoomDetail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
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
              <Route path="/payment-result" element={<PaymentResult />} />
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