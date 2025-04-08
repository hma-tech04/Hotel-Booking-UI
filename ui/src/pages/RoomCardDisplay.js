import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";

function RoomCardDisplay() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const roomsPerPage = 6;
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5053";

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/api/rooms`;

      if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
          throw new Error("Ngày không hợp lệ.");
        }
        if (checkIn < today) {
          throw new Error("Ngày check-in không được trong quá khứ.");
        }
        if (checkOut <= checkIn) {
          throw new Error("Ngày check-out phải sau ngày check-in.");
        }

        url = `${API_BASE_URL}/api/rooms/available/all?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
      } else if (searchTerm.trim()) {
        url = `${API_BASE_URL}/api/rooms/type/${encodeURIComponent(searchTerm)}`;
      }

      console.log("Fetching URL:", url);
      const response = await axios.get(url);
      const responseData = response.data;
      console.log("API Response:", responseData);

      let allRooms;
      if (responseData.data && Array.isArray(responseData.data.data)) {
        allRooms = responseData.data.data;
      } else if (Array.isArray(responseData.data)) {
        allRooms = responseData.data;
      } else {
        throw new Error("Định dạng dữ liệu từ API không hợp lệ");
      }

      console.log("Rooms data:", allRooms);
      if (allRooms.length === 0) {
        setRooms([]);
        setFilteredRooms([]);
        setTotalPages(0);
      } else {
        setRooms(allRooms);
        const startIndex = (currentPage - 1) * roomsPerPage;
        const endIndex = startIndex + roomsPerPage;
        const pagedRooms = allRooms.slice(startIndex, endIndex);
        setFilteredRooms(pagedRooms);
        setTotalPages(Math.ceil(allRooms.length / roomsPerPage));
        console.log("Filtered rooms after update:", pagedRooms);
      }
    } catch (err) {
      let errorMessage = "Không thể tải danh sách phòng. Vui lòng thử lại.";
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = "Yêu cầu không hợp lệ. Vui lòng kiểm tra ngày.";
        } else if (err.response.status === 404) {
          errorMessage = "Không tìm thấy phòng nào.";
        } else if (err.response.status === 500) {
          errorMessage = "Lỗi server. Vui lòng liên hệ quản trị viên.";
        }
        console.error("API Error Response:", JSON.stringify(err.response.data, null, 2));
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setFilteredRooms([]);
      console.error("Error fetching rooms:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [checkInDate, checkOutDate, searchTerm, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      fetchRooms();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <div>Đang tải danh sách phòng...</div>;
  if (error) return <div>{error}</div>;
  if (!rooms || rooms.length === 0) {
    return (
      <div className="container">
        <h2>Không Có Phòng Nào</h2>
        <Link to="/">
          <button className="book-now-btn">Quay Về Trang Chủ</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="room top" id="room">
        <div className="search-bar">
          <div className="date-picker-container" style={{ marginBottom: "20px" }}>
            <div style={{ marginRight: "20px", display: "inline-block" }}>
              <label htmlFor="checkInDate">Check-in: </label>
              <input
                type="date"
                id="checkInDate"
                value={checkInDate}
                onChange={(e) => {
                  setCheckInDate(e.target.value);
                  setCurrentPage(1);
                }}
                min={new Date().toISOString().split("T")[0]}
                style={{ padding: "8px", marginLeft: "10px" }}
              />
            </div>
            <div style={{ display: "inline-block" }}>
              <label htmlFor="checkOutDate">Check-out: </label>
              <input
                type="date"
                id="checkOutDate"
                value={checkOutDate}
                onChange={(e) => {
                  setCheckOutDate(e.target.value);
                  setCurrentPage(1);
                }}
                min={checkInDate || new Date().toISOString().split("T")[0]}
                style={{ padding: "8px", marginLeft: "10px" }}
              />
            </div>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm theo loại phòng..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
          </div>
        </div>

        <div className="heading_top flex1">
          <div className="heading">
            <h5>NÂNG TẦM SỰ THOẢI MÁI LÊN CAO NHẤT</h5>
            <h2>Tất Cả Phòng & Suites</h2>
          </div>
        </div>

        <div className="content grid">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => {
              // Tạo đối tượng thông tin phòng để truyền qua state
              const roomInfo = {
                roomId: room.roomId,
                thumbnailUrl: room.thumbnailUrl
                  ? `${API_BASE_URL}${room.thumbnailUrl.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/300x200?text=Không+Có+Hình",
                roomType: room.roomType || "Loại Phòng Không Xác Định",
                price: room.price || 0,
                isAvailable: room.isAvailable || false,
                checkInDate: checkInDate, // Thêm ngày check-in nếu có
                checkOutDate: checkOutDate, // Thêm ngày check-out nếu có
              };

              return (
                <div key={room.roomId} className="room-card">
                  <div className="img">
                    <img
                      src={roomInfo.thumbnailUrl}
                      alt={roomInfo.roomType}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Không+Có+Hình";
                        console.error("Image load failed for:", room.thumbnailUrl);
                      }}
                    />
                  </div>
                  <div className="text">
                    <h3>{roomInfo.roomType}</h3>
                    <p>
                      <h4>{roomInfo.price} VNĐ/ Đêm</h4> 
                    </p>
                    <p>Trạng thái: {roomInfo.isAvailable ? "Còn Trống" : "Đã Đặt"}</p>
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
            })
          ) : (
            <div>Không có phòng nào khớp với tìm kiếm của bạn.</div>
          )}
        </div>

        {rooms.length > 0 && (
          <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{
                padding: "10px 20px",
                margin: "0 5px",
                backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Trước
            </button>
            <span style={{ margin: "0 10px" }}>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: "10px 20px",
                margin: "0 5px",
                backgroundColor: currentPage === totalPages ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Sau
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default RoomCardDisplay;