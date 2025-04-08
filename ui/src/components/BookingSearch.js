// src/components/BookingSearch.js
import React, { useState } from 'react';

function BookingSearch({ onSearch }) { // Thêm prop onSearch
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 'Standard',
    children: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.checkIn && formData.checkOut && formData.adults) {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `http://localhost:5053/api/rooms/available?checkInDate=${formData.checkIn}&checkOutDate=${formData.checkOut}&roomType=${formData.adults}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch available rooms');
        }

        const data = await response.json();
        const availableRooms = data.data || [];
        onSearch(availableRooms, formData); // Gửi kết quả và formData lên parent
      } catch (err) {
        setError(err.message);
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const roomTypes = [
    'Standard', 'Deluxe', 'Suite', 'Family Room', 'Executive',
    'Penthouse', 'Twin Room', 'Single Room', 'Double Room', 'Studio'
  ];

  return (
    <section className="book">
      <div className="container flex">
        <form className="input grid" onSubmit={handleSubmit}>
          <div className="box">
            <label>Check-in:</label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              placeholder="Check-in Date"
              required
            />
          </div>
          <div className="box">
            <label>Check-out:</label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              placeholder="Check-out Date"
              required
            />
          </div>
          <div className="box">
            <label>Room Type:</label>
            <select
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '15px', marginTop: '10px', borderRadius: '5px', background: '#263760', color: 'white', border: '2px solid rgba(255, 255, 255, 0.1)' }}
            >
              {roomTypes.map((type) => (
                <option key={type} value={type} style={{ background: '#263760', color: 'white' }}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="search">
            <input type="submit" value="SEARCH" disabled={loading} />
          </div>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    </section>
  );
}

export default BookingSearch;