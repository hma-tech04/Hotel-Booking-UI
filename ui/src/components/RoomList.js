// src/components/RoomList.js
import React, { useState, useEffect } from 'react';
import RoomCard from './RoomCard'; // Card cho từng phòng
import '../styles/style.css';

// Giả sử dữ liệu phòng được lấy từ API hoặc dữ liệu mẫu
const roomsData = [
  {
    RoomId: 1,
    RoomType: 'Superior Single Room',
    Price: 129.00,
    Description: 'A comfortable single room with a great view.',
    ThumbnailUrl: '/images/r1.jpg',
    IsAvailable: true,
    RoomImages: ['/images/r1.jpg', '/images/r1-1.jpg', '/images/r1-2.jpg']
  },
  {
    RoomId: 2,
    RoomType: 'Deluxe Double Room',
    Price: 199.00,
    Description: 'A spacious room perfect for couples.',
    ThumbnailUrl: '/images/r2.jpg',
    IsAvailable: false,
    RoomImages: ['/images/r2.jpg', '/images/r2-1.jpg', '/images/r2-2.jpg']
  },
  {
    RoomId: 3,
    RoomType: 'Executive Suite',
    Price: 299.00,
    Description: 'Luxurious suite with premium amenities.',
    ThumbnailUrl: '/images/r3.jpg',
    IsAvailable: true,
    RoomImages: ['/images/r3.jpg', '/images/r3-1.jpg', '/images/r3-2.jpg']
  },
  // Bạn có thể thêm nhiều phòng khác ở đây
];

function RoomList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Đây là nơi bạn có thể gọi API để lấy danh sách phòng thực tế
    setRooms(roomsData);
  }, []);

  return (
    <section className="room top" id="room">
      <div className="container">
        <div className="heading_top flex1">
          <div className="heading">
            <h5>RAISING COMFORT TO THE HIGHEST LEVEL</h5>
            <h2>Rooms & Suites</h2>
          </div>
        </div>
        <div className="content grid">
          {rooms.map((room) => (
            <RoomCard key={room.RoomId} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoomList;
