// src/pages/RoomDetail.js
import React from 'react';
import '../styles/style.css';

function RoomDetail() {
  // Sample room data
  const room = {
    id: 1,
    name: "Superior Single Room",
    price: 129,
    image: "/images/r1.jpg",
    description: "Detailed description of the room and its amenities.",
  };

  return (
    <div className="room-detail-container">
      <h2>Room Detail</h2>
      <div className="room-detail">
        <div className="room-images">
          <img src={room.image} alt="Room" />
        </div>
        <div className="room-info">
          <h3>{room.name}</h3>
          <p>Price: ${room.price} / per night</p>
          <p>{room.description}</p>
          <button>Book Now</button>
          <button>Online Payment</button>
        </div>
      </div>
    </div>
  );
}

export default RoomDetail;
