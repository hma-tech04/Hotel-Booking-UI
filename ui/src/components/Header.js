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
    console.log('Header useEffect, path:', location.pathname, 'token:', !!localStorage.getItem('token'));
    const token = localStorage.getItem('token');
    if (token && !isLoggedIn) {
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        const userId = decodedToken.id || decodedToken.sub || 1; // Lấy userId từ token hoặc mặc định là 1
        fetchUserInfo(userId); // Gọi API để lấy thông tin đầy đủ
        const userName = decodedToken.name || decodedToken.username || decodedToken.email || 'Unknown';
        setUsername(isAdmin ? 'Admin' : userName);
        setUserInfo(decodedToken); // Dữ liệu tạm từ token trong khi chờ API
        if (typeof updateAdminStatus === 'function') {
          updateAdminStatus(token);
        } else {
          console.error('updateAdminStatus is not a function in Header');
        }
      } catch (error) {
        console.error('Error decoding token in Header:', error);
        setIsLoggedIn(false);
        setUsername('');
        setUserInfo(null);
      }
    } else if (!token && isLoggedIn) {
      setIsLoggedIn(false);
      setUsername('');
      setUserInfo(null);
      if (typeof updateAdminStatus === 'function') {
        updateAdminStatus(null);
      } else {
        console.error('updateAdminStatus is not a function in Header');
      }
    }
  }, [isAdmin, isLoggedIn, location.pathname, updateAdminStatus]);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5053/api/user/id/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.code === 200) {
        setUserInfo(result.data); // Cập nhật userInfo từ API
        setUsername(isAdmin ? 'Admin' : result.data.fullName); // Cập nhật username từ API
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
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
    } else {
      console.error('updateAdminStatus is not a function in handleLogout');
    }
    navigate('/', { replace: true });
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
            <li><Link to="/" className="nav-link" onClick={() => console.log('Home clicked in Header')}>Home</Link></li>
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
                      {isProfileDropdownOpen && userInfo && (
                        <ul className="profile-dropdown">
                          <li>User ID: {userInfo.userId || 'Not available'}</li>
                          <li>Full Name: {userInfo.fullName || 'Not available'}</li>
                          <li>Email: {userInfo.email}</li>
                          <li>Phone: {userInfo.phoneNumber || userInfo.phone || 'Not set'}</li>
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