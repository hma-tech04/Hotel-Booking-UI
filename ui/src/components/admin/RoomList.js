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
  Alert,
  Typography,
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
  const [action, setAction] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomData, setRoomData] = useState({
    roomType: '',
    price: '',
    description: '',
    thumbnailUrl: null, // New thumbnail file
    existingThumbnailUrl: '', // Existing thumbnail URL
    isAvailable: false,
    roomImages: [], // New room image files
    existingRoomImages: [], // Existing room image URLs
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  // Fetch rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Vui lòng đăng nhập để xem danh sách phòng.");

        const response = await axios.get('http://localhost:5053/api/rooms/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  // Open dialog for add/update/delete
  const handleOpenDialog = (actionType, room = null) => {
    setAction(actionType);
    if (room) {
      setSelectedRoom(room);
      setRoomData({
        roomType: room.roomType,
        price: room.price,
        description: room.description || '',
        thumbnailUrl: null, // New file to upload (null if unchanged)
        existingThumbnailUrl: room.thumbnailUrl, // Keep existing URL
        isAvailable: room.isAvailable,
        roomImages: [], // New files to upload
        existingRoomImages: room.roomImages || [], // Keep existing URLs
      });
    } else {
      setRoomData({
        roomType: '',
        price: '',
        description: '',
        thumbnailUrl: null,
        existingThumbnailUrl: '',
        isAvailable: false,
        roomImages: [],
        existingRoomImages: [],
      });
    }
    setOpenDialog(true);
  };

  // Close dialog and reset data
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAction('');
    setSelectedRoom(null);
    setRoomData({
      roomType: '',
      price: '',
      description: '',
      thumbnailUrl: null,
      existingThumbnailUrl: '',
      isAvailable: false,
      roomImages: [],
      existingRoomImages: [],
    });
    setError(null);
  };

  // Handle save (add or update)
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(".ConcurrentHashMapVui lòng đăng nhập để thực hiện hành động này.");
      return;
    }

    if (!roomData.roomType || roomData.roomType.length < 3) {
      setError("Loại phòng phải có ít nhất 3 ký tự.");
      return;
    }
    if (!roomData.price || isNaN(roomData.price) || Number(roomData.price) <= 0) {
      setError("Giá phải là một số dương hợp lệ.");
      return;
    }
    if (action === 'add' && !roomData.thumbnailUrl) {
      setError("Ảnh đại diện là bắt buộc khi thêm phòng.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("RoomType", roomData.roomType);
      formData.append("Price", Number(roomData.price).toString());
      formData.append("Description", roomData.description || "");
      formData.append("IsAvailable", roomData.isAvailable.toString());

      // Only append thumbnail if a new file is selected
      if (roomData.thumbnailUrl) {
        formData.append("ThumbnailUrl", roomData.thumbnailUrl);
      }

      // Append new room images
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
        const newRoom = response.data.data;
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
        const updatedRoom = response.data.data;
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

  // Handle delete
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

  // Handle thumbnail change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomData({ ...roomData, thumbnailUrl: file });
    }
  };

  // Handle room images change
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomData({ ...roomData, roomImages: files });
  };

  // Remove an existing room image (frontend-side only)
  const handleRemoveExistingImage = (index) => {
    const updatedImages = roomData.existingRoomImages.filter((_, i) => i !== index);
    setRoomData({ ...roomData, existingRoomImages: updatedImages });
  };

  // Filter rooms by search query
  const filteredRooms = rooms.filter((room) =>
    room.roomType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <MuiTextField
        label="Tìm kiếm theo loại phòng"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        style={{ marginBottom: '20px' }}
        sx={searchFieldStyle}
      />

      <MuiButton
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog('add')}
        style={{ marginBottom: '20px' }}
      >
        Thêm phòng
      </MuiButton>

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
                <Typography variant="subtitle2">Ảnh đại diện:</Typography>
                {roomData.existingThumbnailUrl && !roomData.thumbnailUrl && (
                  <img
                    src={`http://localhost:5053${roomData.existingThumbnailUrl}`}
                    alt="Current Thumbnail"
                    style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '5px' }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ marginTop: '5px' }}
                />
                {roomData.thumbnailUrl && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {roomData.thumbnailUrl.name}
                  </Typography>
                )}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Typography variant="subtitle2">Ảnh phòng:</Typography>
                {roomData.existingRoomImages.length > 0 && (
                  <div>
                    {roomData.existingRoomImages.map((imgUrl, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                        <img
                          src={`http://localhost:5053${imgUrl}`}
                          alt={`Existing ${index + 1}`}
                          style={{ maxWidth: '50px', maxHeight: '50px' }}
                        />
                        <MuiButton
                          size="small"
                          color="secondary"
                          onClick={() => handleRemoveExistingImage(index)}
                          sx={{ ml: 1 }}
                        >
                          Xóa
                        </MuiButton>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  style={{ marginTop: '5px' }}
                />
                {roomData.roomImages.length > 0 && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    Đã chọn {roomData.roomImages.length} tệp
                  </Typography>
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