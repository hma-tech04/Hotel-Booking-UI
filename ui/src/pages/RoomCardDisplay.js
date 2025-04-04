// src/pages/RoomCardDisplay.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import roomsData from "../roomsData";
import "../styles/style.css";

function RoomCardDisplay() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRooms, setFilteredRooms] = useState(roomsData);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const results = roomsData.filter((room) =>
      room.RoomType.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRooms(results);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const results = roomsData.filter((room) =>
        room.RoomType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRooms(results);
    }
  };

  if (!roomsData || roomsData.length === 0) {
    return (
      <div className="container">
        <h2>No Rooms Available</h2>
        <Link to="/">
          <button className="book-now-btn">Back to Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="room top" id="room">
        <div className="search-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by room type..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
          </div>
        </div>

        <div className="heading_top flex1">
          <div className="heading">
            <h5>RAISING COMFORT TO THE HIGHEST LEVEL</h5>
            <h2>All Rooms & Suites</h2>
          </div>
        </div>

        <div className="content grid">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div key={room.RoomId} className="room-card">
                <div className="img">
                  <img src={room.ThumbnailUrl} alt={room.RoomType} />
                </div>
                <div className="text">
                  <h3>{room.RoomType}</h3>
                  <p>
                    <span>${room.Price}</span> per night
                  </p>
                  <p>{room.Description}</p>
                  <p>Status: {room.IsAvailable ? "Available" : "Not Available"}</p>
                  <div className="button-group">
                    <Link to={`/booking-page/${room.RoomId}`}>
                      <button className="book-now-btn">Book Now</button>
                    </Link>
                    <Link to={`/room/${room.RoomId}`}>
                      <button className="book-now-btn">Show Detail</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No rooms match your search.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default RoomCardDisplay;