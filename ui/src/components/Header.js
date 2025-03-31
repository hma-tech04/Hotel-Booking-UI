import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate to redirect after login/logout
import '../styles/style.css';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown menu state
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login status
  const navigate = useNavigate(); // Hook for navigation after logout

  // Toggle the dropdown menu when button is clicked
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);  // Toggle the dropdown state
  };

  // Handle logout and clear the user token
  const handleLogout = () => {
    setIsLoggedIn(false);  // Logout user
    localStorage.removeItem('userToken');  // Example of clearing token (if you're using it for authentication)
    navigate('/'); // Redirect to Home after logout
  };

  return (
    <header className="header">
      <div className="container">
        <nav>
          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Hotel Logo" />
          </Link>

          {/* Navbar Links (Home and Rooms always visible) */}
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/rooms" className="nav-link">Rooms</Link></li>
            <li><Link to="/booking-management" className='nav-link'>Book</Link></li>
          </ul>

          {/* Dropdown Menu for other links (Login, Register, Booking Management) */}
          <div
            className="nav-link-dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}  // Open dropdown when mouse enters
            onMouseLeave={() => setIsDropdownOpen(false)} // Close dropdown when mouse leaves
          >
            <button className="dropdown-toggle">
              {isLoggedIn ? 'Account' : 'More'} {/* Show Account when logged in */}
            </button>

            {isDropdownOpen && (
              <ul className="dropdown-menu">
                {!isLoggedIn ? (
                  <>
                    <li><Link to="/login" className="nav-link" onClick={() => setIsDropdownOpen(false)}>Login</Link></li>
                    <li><Link to="/register" className="nav-link" onClick={() => setIsDropdownOpen(false)}>Register</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/booking-management" className="nav-link" onClick={() => setIsDropdownOpen(false)}>Booking Management</Link></li>
                    <li><Link to="/" className="nav-link" onClick={() => { handleLogout(); setIsDropdownOpen(false); }}>Logout</Link></li>
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
