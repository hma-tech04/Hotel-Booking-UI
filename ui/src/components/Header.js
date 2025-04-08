import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuthToken } from '../useAuthToken';// Lên một cấp để trỏ về src/AuthContext.js
import '../styles/style.css';

function Header({ isAdmin, updateAdminStatus }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const { accessToken, resetToken } = useAuthToken();

  useEffect(() => {
    console.log('Header useEffect - accessToken:', accessToken);

    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const exp = decodedToken.exp * 1000;
        const now = Date.now();

        if (now >= exp) {
          console.log('Token đã hết hạn');
          setIsLoggedIn(false);
          setUsername('');
          setUserInfo(null);
          setIsDropdownOpen(false);
          setIsProfileDropdownOpen(false);
          resetToken();
          return;
        }

        setIsLoggedIn(true);
        const userId = decodedToken.nameid;
        if (!userId) throw new Error('Không tìm thấy nameid trong token');

        if (!userInfo) fetchUserInfo(userId);

        const userName = decodedToken.given_name || decodedToken.username || decodedToken.email || 'Unknown';
        setUsername(isAdmin ? 'Admin' : userName);
        setUserInfo(decodedToken);

        if (typeof updateAdminStatus === 'function') {
          updateAdminStatus(accessToken);
        }
      } catch (error) {
        console.error('Error decoding token:', error.message);
        setIsLoggedIn(false);
        setUsername('');
        setUserInfo(null);
        setIsDropdownOpen(false);
        setIsProfileDropdownOpen(false);
        resetToken();
      }
    } else {
      console.log('No accessToken, resetting state');
      setIsLoggedIn(false);
      setUsername('');
      setUserInfo(null);
      setIsDropdownOpen(false);
      setIsProfileDropdownOpen(false);
      if (typeof updateAdminStatus === 'function') {
        updateAdminStatus(null);
      }
    }
  }, [accessToken, isAdmin, updateAdminStatus]);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5053/api/user/id/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error('Không thể lấy thông tin người dùng');
      const result = await response.json();
      if (result.code === 200 && result.data) {
        setUserInfo(result.data);
        setUsername(isAdmin ? 'Admin' : result.data.fullName);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error.message);
      setUserInfo(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    resetToken();
    setIsLoggedIn(false);
    setUsername('');
    setUserInfo(null);
    setIsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    if (typeof updateAdminStatus === 'function') {
      updateAdminStatus(null);
    }
    navigate('/', { replace: true });
  };

  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  return (
    <header className="header">
      <div className="container">
        <nav>
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Hotel Logo" />
          </Link>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Trang Chủ</Link></li>
            <li><Link to="/rooms" className="nav-link">Xem phòng</Link></li>
            {isAdmin && (
              <li><Link to="/admin" className="nav-link">Admin</Link></li>
            )}
          </ul>
          <div className="nav-link-dropdown" ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <span className="user-icon">
                <i className="fa fa-user"></i>
              </span>
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                {isLoggedIn ? (
                  <>
                    <li className="profile-item">
                      <span className="nav-link greeting" onClick={toggleProfileDropdown}>
                        Hello, {username}
                      </span>
                      {isProfileDropdownOpen && userInfo && (
                        <ul className="profile-dropdown">
                          <li>User ID: {userInfo.userId || 'Not available'}</li>
                          <li>Full Name: {userInfo.fullName || 'Not available'}</li>
                          <li>Email: {userInfo.email}</li>
                          <li>Phone: {userInfo.phoneNumber || 'Not set'}</li>
                          <li>Role: {userInfo.role || 'Not available'}</li>
                          <li>Created: {userInfo.createdDate ? new Date(userInfo.createdDate).toLocaleDateString() : 'Not available'}</li>
                          <li>
                            <Link to="/edit-profile" className="nav-link" onClick={() => setIsDropdownOpen(false)}>
                              Edit Profile
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    {!isAdmin && (
                      <li>
                        <Link to="/booking-management" className="nav-link" onClick={() => setIsDropdownOpen(false)}>
                          Booking Management
                        </Link>
                      </li>
                    )}
                    <li>
                      <button className="nav-link" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="nav-link" onClick={() => setIsDropdownOpen(false)}>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="nav-link" onClick={() => setIsDropdownOpen(false)}>
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;