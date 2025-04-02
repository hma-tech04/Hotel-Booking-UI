import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Để lấy ID từ URL
import roomsData from '../roomsData'; // Import dữ liệu mock từ roomsData.js
import '../styles/style.css'; // Đảm bảo bạn có CSS đẹp\
import Footer from '../components/Footer'; // Import Footer
import '../styles/RoomDetail.css';

function RoomDetail() {
  const { roomId } = useParams();  // Lấy roomId từ URL
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tìm phòng từ dữ liệu mock (roomsData.js) dựa trên roomId
  useEffect(() => {
    const foundRoom = roomsData.find(room => room.RoomId === parseInt(roomId));  // Tìm phòng dựa trên RoomId

    if (foundRoom) {
      setRoom(foundRoom);
    } else {
      setError('Room not found');
    }

    setLoading(false); // Đặt trạng thái loading là false khi kết thúc
  }, [roomId]);

  if (loading) return <div className="loading">Loading room details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!room) return <div>No room data found</div>;

  return (
    <div className="room-detail-container">
      <div className="room-detail">
        <div className="room-images">
          <img src={room.ThumbnailUrl} alt={room.RoomType} />
        </div>
        <div className="room-info">
          <h2>{room.RoomType}</h2>
          <p className="price">Price: ${room.Price} per night</p>
          <p>{room.Description}</p>
          <div className="room-actions">
            <button className="book-now-btn">Book Now</button>
            <button className="payment-btn">Online Payment</button>
          </div>
        </div>
      </div>

      <Footer />

    </div>
  );
}

export default RoomDetail;
