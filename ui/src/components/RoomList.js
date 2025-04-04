import React, { useState, useEffect } from "react";
import RoomCard from "./RoomCard";
import roomsData from "../roomsData"; // Import dữ liệu mock từ roomsData.js
import "../styles/style.css";
import Footer from "./Footer";
function RoomList() {
  const [rooms, setRooms] = useState(roomsData); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    setLoading(true);
    setRooms(roomsData); 
    setLoading(false);
  }, []); 

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div>
      <section className="room top" id="room">
        <div className="container">
          <div className="heading_top flex1">
            <div className="heading">
              <h5>RAISING COMFORT TO THE HIGHEST LEVEL</h5>
              <h2>Rooms & Suites</h2>
            </div>
          </div>
          <div className="content grid">
            {rooms.length > 0 ? (
              rooms.map((room) => <RoomCard key={room.RoomId} room={room} />)
            ) : (
              <div>No rooms available.</div>
            )}
          </div>
        </div>
      </section>
    </div>

  );
}

export default RoomList;
