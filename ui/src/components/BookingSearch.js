// src/components/BookingSearch.js
import React, { useState } from 'react';

function BookingSearch() {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 0,
    children: 0
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ideally, you would call an API to search for rooms based on formData
    console.log('Booking Search Submitted:', formData);
    // Example: You can pass formData to an API or handle it accordingly
    console.log('Booking Search Submitted:', formData);
  };

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
            <label>Adults:</label>
            <input
              type="number"/>
            <label>Room Type:</label>
            <input
              type="Roomtype"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>
          <div className="box">
            <label>Sort prices:</label>
            <input
              type="number"
              name="Prices"
              value={formData.Prices}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>
          <div className="search">
            <input type="submit" value="SEARCH" />
          </div>
        </form>
      </div>
    </section>
  );
}

export default BookingSearch;
