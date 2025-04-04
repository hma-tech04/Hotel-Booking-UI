import React, { useState, useEffect } from "react";
import RoomCard from "./RoomCard";
import roomsData from "../roomsData"; // Import dữ liệu mock từ roomsData.js
import "../styles/style.css";
import Footer from "./Footer";
function RoomList() {
  const [rooms, setRooms] = useState(roomsData); // Trạng thái lưu trữ phòng, khởi tạo từ roomsData
  const [loading, setLoading] = useState(false); // Trạng thái loading, dù không cần thiết nhưng vẫn giữ để dễ quản lý

  useEffect(() => {
    // Giả sử bạn có thể thực hiện các hành động khác trong useEffect nếu cần
    // Nhưng ở đây bạn chỉ cần lấy dữ liệu từ roomsData trực tiếp
    setLoading(true);
    setRooms(roomsData); // Dữ liệu phòng được lấy trực tiếp từ roomsData.js
    setLoading(false);
  }, []); // Chạy khi component được render lần đầu

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
      <Footer />
    </div>
  );
}

export default RoomList;
