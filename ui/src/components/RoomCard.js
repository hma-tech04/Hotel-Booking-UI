// src/components/RoomCard.js
import React from 'react';
import '../styles/style.css';

function RoomCard({ room }) {
  return (
    <div className="room-card">
      <div className="img">
        <img src={room.ThumbnailUrl} alt={room.RoomType} />
      </div>
      <div className="text">
        <h3>{room.RoomType}</h3>
        <p><span>${room.Price}</span> per night</p>
        <p>{room.Description}</p>
        <p>Status: {room.IsAvailable ? 'Available' : 'Not Available'}</p>
        <div className="room-images">
          {room.RoomImages.map((image, index) => (
            <img key={index} src={image} alt={`Room ${room.RoomId} image ${index}`} />
          ))}
        </div>
        <button className="book-now-btn">Book Now</button>
      </div>
    </div>
  );
}

export default RoomCard;
