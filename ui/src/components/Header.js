import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/style.css';

function Header({ isAdmin, updateAdminStatus }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Header useEffect: token=', token);
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    console.log('Header handleLogout: Logging out');
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    updateAdminStatus(null);
    navigate('/');
  };

  const handleAdminAccess = () => {
    const token = localStorage.getItem('token');
    console.log('Header handleAdminAccess: token=', token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Header handleAdminAccess: decoded=', decoded);
        if (decoded.permissions === 'admin' || decoded.role === 'Admin') {
          console.log('Header handleAdminAccess: Navigating to /admin');
          navigate('/admin');
        } else {
          console.log('Header handleAdminAccess: No admin rights');
          alert('Bạn không có quyền truy cập khu vực quản lý.');
          navigate('/');
        }
      } catch (error) {
        console.error('Header handleAdminAccess: Error decoding token:', error);
        navigate('/login');
      }
    } else {
      console.log('Header handleAdminAccess: No token, redirecting to /login');
      navigate('/login');
    }
  };

  console.log('Header render: isAdmin=', isAdmin, 'isLoggedIn=', isLoggedIn);

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
                <button onClick={handleAdminAccess} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  Quản lý
                </button>
              </li>
            )}
          </ul>
          <div
            className="nav-link-dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="dropdown-toggle">
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
                    <li>
                      <Link
                        to="/booking-management"
                        className="nav-link"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Booking Management
                      </Link>
                    </li>
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