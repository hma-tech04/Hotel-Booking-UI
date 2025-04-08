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
    if (token && !isLoggedIn) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
        const exp = decodedToken.exp * 1000; // Chuyển sang milliseconds
        if (Date.now() >= exp) {
          throw new Error('Token đã hết hạn');
        }
        setIsLoggedIn(true);
        const userId = decodedToken.nameid;
        if (!userId) {
          throw new Error('Không tìm thấy nameid trong token');
        }
        if (!userInfo) { // Chỉ gọi API nếu chưa có userInfo
          fetchUserInfo(userId);
        }
        const userName = decodedToken.given_name || decodedToken.username || decodedToken.email || 'Unknown';
        setUsername(isAdmin ? 'Admin' : userName);
        setUserInfo(decodedToken);
        if (typeof updateAdminStatus === 'function') {
          updateAdminStatus(token);
        }
      } catch (error) {
        console.error('Error decoding token in Header:', error.message);
        setIsLoggedIn(false);
        setUsername('');
        setUserInfo(null);
        localStorage.removeItem('token'); // Xóa token không hợp lệ
      }
    } else if (!token && isLoggedIn) {
      setIsLoggedIn(false);
      setUsername('');
      setUserInfo(null);
      if (typeof updateAdminStatus === 'function') {
        updateAdminStatus(null);
      }
    }
  }, [isAdmin, isLoggedIn, updateAdminStatus]); // Xóa location.pathname khỏi dependencies nếu không cần

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5053/api/user/id/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Không thể lấy thông tin người dùng';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
      const result = await response.json();
      if (result.code === 200 && result.data) {
        setUserInfo(result.data);
        setUsername(isAdmin ? 'Admin' : result.data.fullName);
      } else {
        throw new Error(result.message || 'Dữ liệu trả về không hợp lệ');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error.message);
      setUserInfo(null); // Đặt lại userInfo nếu API thất bại
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
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    if (typeof updateAdminStatus === 'function') {
      updateAdminStatus(null);
    }
    navigate('/', { replace: true });
  };

  const isAdminRoute = location.pathname.startsWith('/admin');
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
            <li><Link to="/" className="nav-link" onClick={() => console.log('Home clicked in Header')}>Home</Link></li>
            <li><Link to="/rooms" className="nav-link">Rooms</Link></li>
            {isAdmin && (
              <li>
                <Link to="/admin" className="nav-link">Admin</Link>
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
                      {isProfileDropdownOpen && userInfo && (
                        <ul className="profile-dropdown">
                          <li>User ID: {userInfo.userId || 'Not available'}</li>
                          <li>Full Name: {userInfo.fullName || 'Not available'}</li>
                          <li>Email: {userInfo.email}</li>
                          <li>Phone: {userInfo.phoneNumber || 'Not set'}</li>
                          <li>Role: {userInfo.role || 'Not available'}</li>
                          <li>Created: {userInfo.createdDate ? new Date(userInfo.createdDate).toLocaleDateString() : 'Not available'}</li>
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