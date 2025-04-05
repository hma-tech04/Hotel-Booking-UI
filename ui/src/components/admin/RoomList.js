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
  IconButton,
} from '@mui/material';
import axios from 'axios';
import ImageIcon from '@mui/icons-material/Image';

const RoomList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState('');
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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found. Please log in.");

        const response = await axios.get('http://localhost:5053/api/rooms/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const roomData = response.data.data || response.data;
        if (Array.isArray(roomData)) {
          setRooms(roomData);
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
      }
    };
    fetchRooms();
  }, []);

  const handleOpenDialog = (action, room = null) => {
    setAction(action);
    if (room) {
      setSelectedRoom(room);
      setRoomData({
        roomType: room.roomType,
        price: room.price,
        description: room.description || '',
        thumbnailUrl: null, // Reset để yêu cầu file mới khi cập nhật
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
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    // Kiểm tra các trường bắt buộc
    if (!roomData.roomType || roomData.roomType.length < 3) {
      setError("Room type must be at least 3 characters.");
      return;
    }
    if (!roomData.price || isNaN(roomData.price)) {
      setError("Price must be a valid number.");
      return;
    }
    if (!roomData.thumbnailUrl) {
      setError("Thumbnail image is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("RoomType", roomData.roomType);
      formData.append("Price", Number(roomData.price).toString());
      formData.append("Description", roomData.description || "");
      formData.append("IsAvailable", roomData.isAvailable.toString());
      formData.append("ThumbnailUrl", roomData.thumbnailUrl); // Gửi file

      // Gửi RoomImages dưới dạng List<IFormFile>
      if (roomData.roomImages && roomData.roomImages.length > 0) {
        roomData.roomImages.forEach((file) => {
          formData.append("RoomImages", file); // Tên trường phải khớp với backend
        });
      }

      // Log dữ liệu gửi đi
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
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
        const updatedRooms = rooms.map((room) =>
          room.roomId === selectedRoom.roomId ? updatedRoom : room
        );
        setRooms(updatedRooms);
      }

      handleCloseDialog();
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Unauthorized: You must be an admin to perform this action."
          : err.response?.data?.message || "Failed to save room. Please check the API or console for details."
      );
      console.error("Error saving room:", err.response || err);
    }
  };

  const handleDelete = () => {
    const updatedRooms = rooms.filter((room) => room.roomId !== selectedRoom.roomId);
    setRooms(updatedRooms);
    handleCloseDialog();
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomData({ ...roomData, thumbnailUrl: file });
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomData({ ...roomData, roomImages: files });
  };

  const filteredRooms = rooms.filter((room) =>
    room.roomType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      <MuiTextField
        label="Tìm kiếm theo Loại phòng"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        style={{ marginBottom: '20px' }}
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: '#ffffff', // Nền trắng mặc định
            WebkitTapHighlightColor: 'transparent', // Loại bỏ highlight mặc định trên trình duyệt
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0', // Viền xám nhạt mặc định
            },
            '&:hover fieldset': {
              borderColor: '#f48fb1', // Viền hồng khi hover
            },
            '&.Mui-focused': {
              '& .MuiInputBase-root': {
                backgroundColor: '#ffebee', // Nền hồng nhạt khi focus
              },
              '& fieldset': {
                borderColor: '#f06292', // Viền hồng đậm khi focus
              },
            },
          },
          // Loại bỏ hiệu ứng highlight của trình duyệt
          '& input': {
            WebkitTapHighlightColor: 'transparent',
            '&:focus': {
              backgroundColor: '#ffebee', // Đảm bảo nền hồng nhạt khi focus
            },
          },
        }}
      />
      <MuiButton
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog('add')}
        style={{ marginBottom: '20px' }}
      >
        Thêm phòng
      </MuiButton>
      <Table sx={{ width: '100%' }}>
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
              <TableCell>{room.description || 'N/A'}</TableCell>
              <TableCell>
                {room.thumbnailUrl ? (
                  <IconButton>
                    <ImageIcon />
                    <span style={{ marginLeft: '5px' }}>{room.thumbnailUrl}</span>
                  </IconButton>
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>
                {room.roomImages && room.roomImages.length > 0
                  ? `${room.roomImages.length} files`
                  : 'N/A'}
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
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#ffffff', // Nền trắng mặc định
                    WebkitTapHighlightColor: 'transparent', // Loại bỏ highlight mặc định trên trình duyệt
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e0e0e0', // Viền xám nhạt mặc định
                    },
                    '&:hover fieldset': {
                      borderColor: '#f48fb1', // Viền hồng khi hover
                    },
                    '&.Mui-focused': {
                      '& .MuiInputBase-root': {
                        backgroundColor: '#ffebee', // Nền hồng nhạt khi focus
                      },
                      '& fieldset': {
                        borderColor: '#f06292', // Viền hồng đậm khi focus
                      },
                    },
                  },
                  // Loại bỏ hiệu ứng highlight của trình duyệt
                  '& input': {
                    WebkitTapHighlightColor: 'transparent',
                    '&:focus': {
                      backgroundColor: '#ffebee', // Đảm bảo nền hồng nhạt khi focus
                    },
                  },
                }}
              />
              <MuiTextField
                label="Giá"
                type="number"
                value={roomData.price}
                onChange={(e) => setRoomData({ ...roomData, price: e.target.value })}
                fullWidth
                style={{ marginBottom: '10px' }}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#ffffff', // Nền trắng mặc định
                    WebkitTapHighlightColor: 'transparent', // Loại bỏ highlight mặc định trên trình duyệt
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e0e0e0', // Viền xám nhạt mặc định
                    },
                    '&:hover fieldset': {
                      borderColor: '#f48fb1', // Viền hồng khi hover
                    },
                    '&.Mui-focused': {
                      '& .MuiInputBase-root': {
                        backgroundColor: '#ffebee', // Nền hồng nhạt khi focus
                      },
                      '& fieldset': {
                        borderColor: '#f06292', // Viền hồng đậm khi focus
                      },
                    },
                  },
                  // Loại bỏ hiệu ứng highlight của trình duyệt
                  '& input': {
                    WebkitTapHighlightColor: 'transparent',
                    '&:focus': {
                      backgroundColor: '#ffebee', // Đảm bảo nền hồng nhạt khi focus
                    },
                  },
                }}
              />
              <MuiTextField
                label="Mô tả"
                value={roomData.description}
                onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                style={{ marginBottom: '10px' }}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#ffffff', // Nền trắng mặc định
                    WebkitTapHighlightColor: 'transparent', // Loại bỏ highlight mặc định trên trình duyệt
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e0e0e0', // Viền xám nhạt mặc định
                    },
                    '&:hover fieldset': {
                      borderColor: '#f48fb1', // Viền hồng khi hover
                    },
                    '&.Mui-focused': {
                      '& .MuiInputBase-root': {
                        backgroundColor: '#ffebee', // Nền hồng nhạt khi focus
                      },
                      '& fieldset': {
                        borderColor: '#f06292', // Viền hồng đậm khi focus
                      },
                    },
                  },
                  // Loại bỏ hiệu ứng highlight của trình duyệt
                  '& textarea': {
                    WebkitTapHighlightColor: 'transparent',
                    '&:focus': {
                      backgroundColor: '#ffebee', // Đảm bảo nền hồng nhạt khi focus
                    },
                  },
                }}
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
                    {roomData.roomImages.length} files selected
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