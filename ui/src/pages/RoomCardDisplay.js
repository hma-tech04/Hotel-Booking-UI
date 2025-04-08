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
  const roomsPerPage = 6;

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5053/api/rooms?pageNumber=${currentPage}&pageSize=${roomsPerPage}`
        );

        const responseData = response.data.data;
        if (responseData && Array.isArray(responseData.data)) {
          setRooms(responseData.data);
          setFilteredRooms(responseData.data);
          setTotalPages(responseData.totalPages || 1);
        } else {
          throw new Error("Định dạng dữ liệu từ API không hợp lệ");
        }
      } catch (err) {
        setError("Không thể tải danh sách phòng. Vui lòng kiểm tra API hoặc console để biết chi tiết.");
        console.error("Error fetching rooms:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5053/api/rooms/type/${encodeURIComponent(searchTerm)}`
        );

        const responseData = response.data.data;
        if (Array.isArray(responseData)) {
          setFilteredRooms(responseData);
        } else {
          throw new Error("Định dạng dữ liệu từ API không hợp lệ");
        }
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Không tìm thấy phòng nào phù hợp với loại này."
            : "Không thể tìm kiếm phòng. Vui lòng thử lại."
        );
        setFilteredRooms([]);
        console.error("Error searching rooms:", err.response || err);
      } finally {
        setLoading(false);
      }
    } else if (e.key === "Enter" && !searchTerm.trim()) {
      setFilteredRooms(rooms);
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
            filteredRooms.map((room) => (
              <div key={room.roomId} className="room-card">
                <div className="img">
                  <img
                    src={
                      room.thumbnailUrl
                        ? `http://localhost:5053${room.thumbnailUrl.replace(
                            /\\/g,
                            "/"
                          )}`
                        : "https://via.placeholder.com/300x200?text=Không+Có+Hình"
                    }
                    alt={room.roomType || "Hình Ảnh Phòng"}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Không+Có+Hình";
                      console.error(
                        "Image load failed for:",
                        room.thumbnailUrl
                      );
                    }}
                  />
                </div>
                <div className="text">
                  <h3>{room.roomType || "Loại Phòng Không Xác Định"}</h3>
                  <p>
                    <span>${room.price || 0}</span> mỗi đêm
                  </p>
                  <p>
                    Trạng thái: {room.isAvailable ? "Còn Trống" : "Đã Đặt"}
                  </p>
                  <div className="button-group">
                    <Link to={`/booking-page/${room.roomId}`}>
                      <button className="book-now-btn">Đặt Ngay</button>
                    </Link>
                    <Link to={`/room/${room.roomId}`}>
                      <button className="book-now-btn">Xem Chi Tiết</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Không có phòng nào khớp với tìm kiếm của bạn.</div>
          )}
        </div>

        {filteredRooms.length > 0 && (
          <div
            className="pagination"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
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
                backgroundColor:
                  currentPage === totalPages ? "#ccc" : "#007bff",
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