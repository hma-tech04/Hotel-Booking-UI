import { Link } from "react-router-dom";

function RoomCard({ room }) {
  // Kiểm tra và cung cấp giá trị mặc định nếu dữ liệu thiếu
  const thumbnailUrl = room.thumbnailUrl
    ? `http://localhost:5053${room.thumbnailUrl.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/300x200?text=No+Image";
  const roomType = room.roomType || "Unknown Room Type";
  const price = room.price || 0;
  const description = room.description || "No description available";
  const isAvailable = room.isAvailable || false;

  return (
    <div className="room-card">
      <Link to={`/room/${room.roomId}`}>
        <div className="img">
          <img
            src={thumbnailUrl}
            alt={roomType}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
              console.error("Image load failed for:", room.thumbnailUrl);
            }}
          />
        </div>
      </Link>
      <div className="text">
        <h3>{roomType}</h3>
        <p>
          <span>${price}</span> per night
        </p>
        <p>{description}</p>
        <p>Status: {isAvailable ? "Available" : "Not Available"}</p>
        <div className="button-group">
          <Link to={`/booking-page/${room.roomId}`}>
            <button className="book-now-btn">Book Now</button>
          </Link>
          <Link to={`/room/${room.roomId}`}>
            <button className="book-now-btn">Show Detail</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;