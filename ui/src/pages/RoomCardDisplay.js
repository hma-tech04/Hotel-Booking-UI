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
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.get(
          `http://localhost:5053/api/rooms?pageNumber=${currentPage}&pageSize=${roomsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData = response.data.data;
        if (responseData && Array.isArray(responseData.data)) {
          setRooms(responseData.data);
          setFilteredRooms(responseData.data);
          setTotalPages(responseData.totalPages || 1);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Unauthorized: Please log in to view rooms."
            : "Failed to load rooms. Please check the API or console for details."
        );
        console.error("Error fetching rooms:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentPage]);

  // Cập nhật searchTerm khi người dùng nhập
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Gọi API khi nhấn Enter
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
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "No rooms found for this type."
            : "Failed to search rooms. Please try again."
        );
        setFilteredRooms([]); // Reset filteredRooms nếu lỗi
        console.error("Error searching rooms:", err.response || err);
      } finally {
        setLoading(false);
      }
    } else if (e.key === "Enter" && !searchTerm.trim()) {
      // Nếu ô tìm kiếm trống, hiển thị lại toàn bộ danh sách
      setFilteredRooms(rooms);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div>{error}</div>;
  if (!rooms || rooms.length === 0) {
    return (
      <div className="container">
        <h2>No Rooms Available</h2>
        <Link to="/">
          <button className="book-now-btn">Back to Home</button>
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
              placeholder="Search by room type..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
          </div>
        </div>

        <div className="heading_top flex1">
          <div className="heading">
            <h5>RAISING COMFORT TO THE HIGHEST LEVEL</h5>
            <h2>All Rooms & Suites</h2>
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
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={room.roomType || "Room Image"}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                      console.error(
                        "Image load failed for:",
                        room.thumbnailUrl
                      );
                    }}
                  />
                </div>
                <div className="text">
                  <h3>{room.roomType || "Unknown Room Type"}</h3>
                  <p>
                    <span>${room.price || 0}</span> per night
                  </p>
                  <p>{room.description || "No description available"}</p>
                  <p>
                    Status: {room.isAvailable ? "Available" : "Not Available"}
                  </p>
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
            ))
          ) : (
            <div>No rooms match your search.</div>
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
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
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
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default RoomCardDisplay;