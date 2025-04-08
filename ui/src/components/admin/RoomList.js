import React, { useState, useEffect } from 'react';
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField as MuiTextField,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import {
  searchFieldStyle,
  textFieldStyle,
  descriptionFieldStyle,
  tableStyle,
} from '../../styles/RoomList.css';

const RoomList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState(''); // 'add', 'update', hoặc 'delete'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomData, setRoomData] = useState({
    roomType: '',
    price: '',
    description: '',
    thumbnailUrl: null,
    isAvailable: false,
    roomImages: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  // Lấy danh sách phòng khi component được mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Vui lòng đăng nhập để xem danh sách phòng.");
        
        const response = await axios.get('http://localhost:5053/api/rooms/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Backend trả về dữ liệu trong response.data.data
        const roomData = response.data.data || [];
        if (Array.isArray(roomData)) {
          setRooms(roomData);
        } else {
          throw new Error("Dữ liệu từ API không đúng định dạng.");
        }
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Không được phép: Vui lòng đăng nhập."
            : "Không thể tải danh sách phòng. Kiểm tra API hoặc console."
        );
        console.error("Lỗi khi lấy danh sách phòng:", err.response || err);
      }
    };
    fetchRooms();
  }, []);

  // Mở dialog để thêm, cập nhật hoặc xóa phòng
  const handleOpenDialog = (actionType, room = null) => {
    setAction(actionType);
    if (room) {
      setSelectedRoom(room);
      setRoomData({
        roomType: room.roomType,
        price: room.price,
        description: room.description || '',
        thumbnailUrl: null, // Không preload ảnh cũ, yêu cầu upload lại
        isAvailable: room.isAvailable,
        roomImages: [],
      });
    } else {
      setRoomData({
        roomType: '',
        price: '',
        description: '',
        thumbnailUrl: null,
        isAvailable: false,
        roomImages: [],
      });
    }
    setOpenDialog(true);
  };

  // Đóng dialog và reset dữ liệu
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAction('');
    setSelectedRoom(null);
    setRoomData({
      roomType: '',
      price: '',
      description: '',
      thumbnailUrl: null,
      isAvailable: false,
      roomImages: [],
    });
    setError(null); // Reset lỗi khi đóng dialog
  };

  // Xử lý lưu phòng (thêm hoặc cập nhật)
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập để thực hiện hành động này.");
      return;
    }

    // Kiểm tra dữ liệu đầu vào
    if (!roomData.roomType || roomData.roomType.length < 3) {
      setError("Loại phòng phải có ít nhất 3 ký tự.");
      return;
    }
    if (!roomData.price || isNaN(roomData.price) || Number(roomData.price) <= 0) {
      setError("Giá phải là một số dương hợp lệ.");
      return;
    }
    if (!roomData.thumbnailUrl && action === 'add') {
      setError("Ảnh đại diện là bắt buộc khi thêm phòng.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("RoomType", roomData.roomType);
      formData.append("Price", Number(roomData.price).toString());
      formData.append("Description", roomData.description || "");
      formData.append("IsAvailable", roomData.isAvailable.toString());
      if (roomData.thumbnailUrl) {
        formData.append("ThumbnailUrl", roomData.thumbnailUrl);
      }
      if (roomData.roomImages.length > 0) {
        roomData.roomImages.forEach((file) => {
          formData.append("imageFiles", file);
        });
      }

      let response;
      if (action === 'add') {
        response = await axios.post('http://localhost:5053/api/rooms', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        // Dữ liệu từ backend nằm trong response.data.data
        const newRoom = {
          roomId: response.data.data.roomId,
          roomType: response.data.data.roomType,
          price: response.data.data.price,
          description: response.data.data.description,
          thumbnailUrl: response.data.data.thumbnailUrl,
          isAvailable: response.data.data.isAvailable,
          roomImages: response.data.data.roomImages || [],
        };
        setRooms([...rooms, newRoom]);
      } else if (action === 'update') {
        response = await axios.put(
          `http://localhost:5053/api/rooms/${selectedRoom.roomId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const updatedRoom = {
          roomId: selectedRoom.roomId,
          roomType: response.data.data.roomType,
          price: response.data.data.price,
          description: response.data.data.description,
          thumbnailUrl: response.data.data.thumbnailUrl,
          isAvailable: response.data.data.isAvailable,
          roomImages: response.data.data.roomImages || [],
        };
        setRooms(
          rooms.map((room) =>
            room.roomId === selectedRoom.roomId ? updatedRoom : room
          )
        );
      }

      handleCloseDialog();
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Không được phép: Bạn phải là admin để thực hiện hành động này."
          : err.response?.data?.message || "Không thể lưu phòng. Kiểm tra API hoặc console."
      );
      console.error("Lỗi khi lưu phòng:", err.response || err);
    }
  };

  // Xử lý xóa phòng
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập để thực hiện hành động này.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5053/api/rooms/${selectedRoom.roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(rooms.filter((room) => room.roomId !== selectedRoom.roomId));
      handleCloseDialog();
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Không được phép: Bạn phải là admin để xóa phòng."
          : err.response?.data?.message || "Không thể xóa phòng. Kiểm tra API hoặc console."
      );
      console.error("Lỗi khi xóa phòng:", err.response || err);
    }
  };

  // Xử lý thay đổi ảnh đại diện
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomData({ ...roomData, thumbnailUrl: file });
    }
  };

  // Xử lý thay đổi ảnh phòng
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomData({ ...roomData, roomImages: files });
  };

  // Lọc danh sách phòng theo từ khóa tìm kiếm
  const filteredRooms = rooms.filter((room) =>
    room.roomType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      
      {/* Ô tìm kiếm */}
      <MuiTextField
        label="Tìm kiếm theo loại phòng"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        style={{ marginBottom: '20px' }}
        sx={searchFieldStyle}
      />
      
      {/* Nút thêm phòng */}
      <MuiButton
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog('add')}
        style={{ marginBottom: '20px' }}
      >
        Thêm phòng
      </MuiButton>
      
      {/* Bảng danh sách phòng */}
      <Table sx={tableStyle}>
        <TableHead>
          <TableRow>
            <TableCell>Loại phòng</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Ảnh đại diện</TableCell>
            <TableCell>Ảnh phòng</TableCell>
            <TableCell>Còn trống</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRooms.map((room) => (
            <TableRow key={room.roomId}>
              <TableCell>{room.roomType}</TableCell>
              <TableCell>{room.price}</TableCell>
              <TableCell>{room.description || 'Không có'}</TableCell>
              <TableCell>
                {room.thumbnailUrl ? (
                  <img
                    src={`http://localhost:5053${room.thumbnailUrl}`}
                    alt="Ảnh đại diện"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100x100?text=Không+tải+được";
                      console.error("Lỗi tải ảnh đại diện:", room.thumbnailUrl);
                    }}
                  />
                ) : (
                  'Không có'
                )}
              </TableCell>
              <TableCell>
                {room.roomImages && room.roomImages.length > 0 ? (
                  <div>
                    {room.roomImages.map((imgUrl, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5053${imgUrl}`}
                        alt={`Ảnh phòng ${index + 1}`}
                        style={{ maxWidth: '50px', maxHeight: '50px', margin: '5px' }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/50x50?text=Không+tải+được";
                          console.error("Lỗi tải ảnh phòng:", imgUrl);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  'Không có'
                )}
              </TableCell>
              <TableCell>{room.isAvailable ? 'Có' : 'Không'}</TableCell>
              <TableCell>
                <MuiButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog('update', room)}
                  style={{ marginRight: '10px' }}
                >
                  Cập nhật
                </MuiButton>
                <MuiButton
                  variant="contained"
                  color="secondary"
                  onClick={() => handleOpenDialog('delete', room)}
                >
                  Xóa
                </MuiButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog thêm/cập nhật/xóa */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {action === 'add' ? 'Thêm phòng' : action === 'update' ? 'Cập nhật phòng' : 'Xóa phòng'}
        </DialogTitle>
        <DialogContent>
          {action !== 'delete' && (
            <>
              <MuiTextField
                label="Loại phòng"
                value={roomData.roomType}
                onChange={(e) => setRoomData({ ...roomData, roomType: e.target.value })}
                fullWidth
                style={{ marginBottom: '10px', marginTop: '10px' }}
                sx={textFieldStyle}
              />
              <MuiTextField
                label="Giá"
                type="number"
                value={roomData.price}
                onChange={(e) => setRoomData({ ...roomData, price: e.target.value })}
                fullWidth
                style={{ marginBottom: '10px' }}
                sx={textFieldStyle}
              />
              <MuiTextField
                label="Mô tả"
                value={roomData.description}
                onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                style={{ marginBottom: '10px' }}
                sx={descriptionFieldStyle}
              />
              <div style={{ marginBottom: '10px' }}>
                <label>Ảnh đại diện:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ marginLeft: '10px' }}
                />
                {roomData.thumbnailUrl && (
                  <span style={{ marginLeft: '10px' }}>{roomData.thumbnailUrl.name}</span>
                )}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Ảnh phòng:</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  style={{ marginLeft: '10px' }}
                />
                {roomData.roomImages.length > 0 && (
                  <span style={{ marginLeft: '10px' }}>
                    Đã chọn {roomData.roomImages.length} tệp
                  </span>
                )}
              </div>
              <div>
                <Checkbox
                  checked={roomData.isAvailable}
                  onChange={(e) => setRoomData({ ...roomData, isAvailable: e.target.checked })}
                />
                <span>Còn trống</span>
              </div>
            </>
          )}
          {action === 'delete' && <p>Bạn có chắc chắn muốn xóa phòng này không?</p>}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog}>Hủy</MuiButton>
          {action === 'delete' ? (
            <MuiButton onClick={handleDelete} color="secondary">Xóa</MuiButton>
          ) : (
            <MuiButton onClick={handleSave} color="primary">Lưu</MuiButton>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomList;