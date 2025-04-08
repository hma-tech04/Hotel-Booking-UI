import { Link } from "react-router-dom";

function RoomCard({ room }) {
  // Kiểm tra và cung cấp giá trị mặc định nếu dữ liệu thiếu
  const thumbnailUrl = room.thumbnailUrl
    ? `http://localhost:5053${room.thumbnailUrl.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/300x200?text=Không+Có+Ảnh";
  const roomType = room.roomType || "Loại Phòng Không Xác Định";
  const price = room.price || 0;
  const isAvailable = room.isAvailable || false;

  // Tạo đối tượng thông tin phòng để truyền qua state
  const roomInfo = {
    roomId: room.roomId,
    thumbnailUrl: thumbnailUrl,
    roomType: roomType,
    price: price,
    isAvailable: isAvailable,
  };

  return (
    <div className="room-card">
      <Link to={`/room/${room.roomId}`}>
        <div className="img">
          <img
            src={thumbnailUrl}
            alt={roomType}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x200?text=Không+Có+Ảnh";
              console.error("Tải ảnh thất bại cho:", room.thumbnailUrl);
            }}
          />
        </div>
      </Link>
      <div className="text">
        <h3>{roomType}</h3>
        <p>
          <h4>{price} VNĐ / Đêm.</h4>
        </p>
        <p>Trạng thái: {isAvailable ? "Còn trống" : "Đã đặt"}</p>
        <div className="button-group">
          {/* Chuyển hướng đến /booking-page và truyền roomData */}
          <Link to={`/booking-page/${room.roomId}`} state={{ roomData: [roomInfo] }}>
            <button className="book-now-btn">Đặt Ngay</button>
          </Link>
          <Link to={`/room/${room.roomId}`}>
            <button className="book-now-btn">Xem Chi Tiết</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;