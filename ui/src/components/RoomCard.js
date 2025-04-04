import { Link } from 'react-router-dom';

function RoomCard({ room }) {
  return (
    <div className="room-card">
      <Link to={`/room/${room.RoomId}`}>
        <div className="img">
          <img src={room.ThumbnailUrl} alt={room.RoomType} />
        </div>
      </Link>
      <div className="text">
        <h3>{room.RoomType}</h3>
        <p><span>${room.Price}</span> per night</p>
        <p>{room.Description}</p>
        <p>Status: {room.IsAvailable ? 'Available' : 'Not Available'}</p>
        <Link to={`/booking-page/${room.RoomId}`}><button className="book-now-btn">Book Now</button></Link>
        <Link to={`/room/${room.RoomId}`}><button className="book-now-btn">Show Detail</button></Link>
      </div>
    </div>

  );
}

export default RoomCard;
