import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import roomsData from "../roomsData";
import "../styles/style.css";
import Footer from "../components/Footer";
import "../styles/RoomDetail.css";

function RoomDetail() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const foundRoom = roomsData.find(
      (room) => room.RoomId === parseInt(roomId)
    );
    if (foundRoom) {
      setRoom(foundRoom);
      setMainImage(foundRoom.ThumbnailUrl);
    } else {
      setError("Room not found");
    }
    setLoading(false);
  }, [roomId]);

  const handleThumbnailClick = (image) => {
    setMainImage(null);
    setTimeout(() => {
      setMainImage(image);
      const index = room.Images ? room.Images.indexOf(image) : 0;
      setCurrentSlide(index >= 0 ? index : 0);
    }, 100);
  };

  if (loading) return <div className="loading">Loading room details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!room) return <div>No room data found</div>;

  return (
    <div>
      <div className="room-detail-container">
        <div className="room-detail">
          <div className="room-images">
            <div className="image-container">
              <img src={mainImage} alt={room.RoomType} className="main-image" />
            </div>
            {room.Images && room.Images.length > 0 ? (
              <div className="image-slider">
                {room.Images.map((image, index) => (
                  <div className="thumbnail-container" key={index}>
                    <img
                      src={image}
                      alt={`Thumbnail ${index}`}
                      className={`thumbnail ${
                        mainImage === image ? "active" : ""
                      }`}
                      onClick={() => handleThumbnailClick(image)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#555",
                }}
              >
                No additional images available.
              </p>
            )}
          </div>
          <div className="room-info">
            <h2>{room.RoomType}</h2>
            <p className="price">Price: ${room.Price} per night</p>
            <p>{room.FullDescription}</p>
            <div className="room-detail-row">
              <span className="detail-label">Area (sq ft)</span>
              <span className="detail-value">{room.Area || "N/A"} sq ft</span>
            </div>
            <div className="room-detail-row">
              <span className="detail-label">Bed Type</span>
              <span className="detail-value">
                {room.BedType || "Not specified"}
              </span>
            </div>
            <div className="room-detail-row">
              <span className="detail-label">Max Occupancy</span>
              <span className="detail-value">
                {room.MaxOccupancy || "N/A"} people
              </span>
            </div>
            <div className="room-detail-row">
              <span className="detail-label">Amenities</span>
              <span className="detail-value">
                {room.Amenities.join(", ") || "N/A"}
              </span>
            </div>
            <div className="room-detail-row">
              <span className="detail-label">Cancellation Policy</span>
              <span className="detail-value">
                {room.CancellationPolicy || "Flexible cancellation"}
              </span>
            </div>
            <div className="room-actions">
              <button className="book-now-btn">Book Now</button>
              <button className="payment-btn">Online Payment</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RoomDetail;