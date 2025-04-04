// src/components/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken); // Debug để xem token chứa gì
        setIsLoggedIn(true);
        // Lấy tên người dùng từ token, ưu tiên field 'name' hoặc 'username'
        const userName = decodedToken.name || decodedToken.username || decodedToken.email || 'Unknown';
        setUsername(isAdmin ? 'Admin' : userName); // Nếu là admin thì hiển thị "Admin", nếu không thì lấy từ token
        setUserInfo(decodedToken);
        updateAdminStatus(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsLoggedIn(false);
        setUsername('');
        navigate('/login');
      }
    } else {
      setIsLoggedIn(false);
      setUsername('');
      setUserInfo(null);
      updateAdminStatus(null);
      navigate('/login');
    }
  }, [updateAdminStatus, isAdmin, navigate]);

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
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    updateAdminStatus(null);
    navigate('/');
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/booking-management');
  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <nav>
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Hotel Logo" />
          </Link>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/rooms" className="nav-link">Rooms</Link></li>
            {isAdmin && (
              <li>
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              </li>
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
                {!isLoggedIn ? (
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
                ) : (
                  <>
                    <li className="profile-item">
                      <span className="nav-link greeting" onClick={toggleProfileDropdown}>
                        Hello, {username}
                      </span>
                      {isProfileDropdownOpen && (
                        <ul className="profile-dropdown">
                          <li>Email: {userInfo?.email}</li>
                          <li>Phone: {userInfo?.phone || 'Not set'}</li>
                          <li>
                            <Link
                              to="/edit-profile"
                              className="nav-link"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setIsProfileDropdownOpen(false);
                              }}
                            >
                              Edit Profile
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    {!isAdmin && (
                      <li>
                        <Link
                          to="/booking-management"
                          className="nav-link"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Booking Management
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        to="/"
                        className="nav-link"
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                      >
                        Logout
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