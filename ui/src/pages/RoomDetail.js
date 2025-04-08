// src/pages/RoomDetail.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";
import "../styles/RoomDetail.css";

function RoomDetail() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5053/api/rooms/${roomId}`);
        const roomData = response.data.data; // Lấy dữ liệu từ response.data.data

        if (roomData) {
          // Chuẩn hóa dữ liệu từ API và bổ sung giá trị mặc định nếu thiếu
          const defaultRoomData = {
            roomId: roomData.roomId,
            roomType: roomData.roomType || "Unknown Room Type",
            price: roomData.price || 129, // Giá trị mặc định từ Superior Single Room
            description: roomData.description || "Phòng đơn Superior mang đến sự thoải mái tối đa cho một người. Với không gian rộng rãi, phòng được trang bị đầy đủ tiện nghi hiện đại.",
            thumbnailUrl: roomData.thumbnailUrl 
              ? `http://localhost:5053${roomData.thumbnailUrl.replace(/\\/g, "/")}` 
              : "https://via.placeholder.com/300x200?text=No+Image",
            images: roomData.roomImages && Array.isArray(roomData.roomImages) 
              ? roomData.roomImages.map(img => `http://localhost:5053${img.replace(/\\/g, "/")}`)
              : ["https://via.placeholder.com/300x200?text=No+Image"], // Mặc định 1 ảnh nếu không có
            isAvailable: roomData.isAvailable || false,
            area: roomData.area || 250, // Giá trị mặc định từ Superior Single Room
            bedType: roomData.bedType || "Single Bed", // Giá trị mặc định
            maxOccupancy: roomData.maxOccupancy || 1, // Giá trị mặc định
            amenities: roomData.amenities || ["Wi-Fi miễn phí", "Điều hòa", "Minibar", "TV màn hình phẳng"], // Giá trị mặc định
            cancellationPolicy: roomData.cancellationPolicy || "Chính sách hủy linh hoạt với thông báo trước 24 giờ", // Giá trị mặc định
          };

          setRoom(defaultRoomData);
          setMainImage(defaultRoomData.thumbnailUrl);
        } else {
          throw new Error("Room data not found in response");
        }
      } catch (err) {
        setError(err.response?.status === 404 ? "Room not found" : "Failed to load room details. Please try again.");
        console.error("Error fetching room details:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [roomId]);

  const handleThumbnailClick = (image) => {
    setMainImage(null);
    setTimeout(() => {
      setMainImage(image);
      const index = room.images ? room.images.indexOf(image) : 0;
      setCurrentSlide(index >= 0 ? index : 0);
    }, 100);
  };

  if (loading) return <div className="loading">Loading room details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!room) return <div>No room data found</div>;

  return (
    <div className="page-wrapper">
      <main>
        <div className="room-detail-container">
          <div className="room-detail">
            {/* Phần hình ảnh */}
            <div className="room-images">
              <div className="image-container">
                <img 
                  src={mainImage} 
                  alt={room.roomType} 
                  className="main-image" 
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              </div>
              {room.images.length > 0 ? (
                <div className="image-slider">
                  {room.images.map((image, index) => (
                    <div className="thumbnail-container" key={index}>
                      <img
                        src={image}
                        alt={`Thumbnail ${index}`}
                        className={`thumbnail ${mainImage === image ? "active" : ""}`}
                        onClick={() => handleThumbnailClick(image)}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: "center", marginTop: "20px", color: "#555" }}>
                  No additional images available.
                </p>
              )}
            </div>

            {/* Phần thông tin phòng */}
            <div className="room-info">
              <h2>{room.roomType}</h2>
              <p className="price">Price: ${room.price} per night</p>
              <p className="description">{room.description}</p>
              <p className="availability">Status: {room.isAvailable ? "Available" : "Not Available"}</p>

              {/* Thông tin chi tiết */}
              <div className="room-details-grid">
                <div className="room-detail-row">
                  <span className="detail-label">Area</span>
                  <span className="detail-value">{room.area} sq ft</span>
                </div>
                <div className="room-detail-row">
                  <span className="detail-label">Bed Type</span>
                  <span className="detail-value">{room.bedType}</span>
                </div>
                <div className="room-detail-row">
                  <span className="detail-label">Max Occupancy</span>
                  <span className="detail-value">{room.maxOccupancy} people</span>
                </div>
                <div className="room-detail-row">
                  <span className="detail-label">Amenities</span>
                  <span className="detail-value">{room.amenities.join(", ")}</span>
                </div>
                <div className="room-detail-row">
                  <span className="detail-label">Cancellation Policy</span>
                  <span className="detail-value">{room.cancellationPolicy}</span>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="room-actions">
                <Link to={`/booking-page/${room.roomId}`}>
                  <button className="book-now-btn">Book Now</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoomDetail;