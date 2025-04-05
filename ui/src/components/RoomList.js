// src/components/RoomList.js
import React, { useState, useEffect } from "react";
import RoomCard from "./RoomCard";
import axios from "axios";
import "../styles/style.css";

function RoomList({ searchResults, searchCriteria }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchResults) {
      // Nếu có kết quả tìm kiếm, sử dụng nó
      setRooms(searchResults);
    } else {
      // Nếu không có kết quả tìm kiếm, lấy danh sách mặc định
      const fetchRooms = async () => {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:5053/api/rooms/all");
          const roomData = response.data.data || response.data;
          if (!Array.isArray(roomData)) {
            throw new Error("Unexpected data format from API");
          }
          setRooms(roomData.slice(0, 3)); // Chỉ lấy 3 phòng đầu tiên
        } catch (err) {
          setError(`Failed to load rooms: ${err.message}. Check console for details.`);
          console.error("Error fetching rooms:", err.response ? err.response.data : err);
        } finally {
          setLoading(false);
        }
      };
      fetchRooms();
    }
  }, [searchResults]);

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div>{error}</div>;

  // Tạo tiêu đề động dựa trên searchCriteria
  const getHeader = () => {
    if (searchCriteria) {
      const { checkIn, checkOut, adults } = searchCriteria;
      return {
        subTitle: `AVAILABLE ROOMS FROM ${checkIn} TO ${checkOut}`,
        mainTitle: `${adults} ROOMS`
      };
    }
    return {
      subTitle: "ĐEM LẠI TRẢI NGHIỆM THOẢI MÁI NHẤT",
      mainTitle: "Rooms & Suites"
    };
  };

  const { subTitle, mainTitle } = getHeader();

  return (
    <section className="room top" id="room">
      <div className="container">
        <div className="heading_top flex1">
          <div className="heading">
            <h5>{subTitle}</h5>
            <h2>{mainTitle}</h2>
          </div>
        </div>
        <div className="content grid">
          {rooms.length > 0 ? (
            rooms.map((room) => <RoomCard key={room.roomId} room={room} />)
          ) : (
            <div>No rooms available.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default RoomList;