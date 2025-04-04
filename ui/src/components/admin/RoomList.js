// src/components/admin/RoomList.js
import React, { useState } from 'react';
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
import { mockRooms } from './mockData';
import ImageIcon from '@mui/icons-material/Image';

const RoomList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomData, setRoomData] = useState({
    roomType: '',
    price: '',
    description: '',
    thumbnailUrl: '',
    isAvailable: false,
    roomImages: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState(mockRooms);

  const handleOpenDialog = (action, room = null) => {
    setAction(action);
    if (room) {
      setSelectedRoom(room);
      setRoomData({
        roomType: room.roomType,
        price: room.price,
        description: room.description || '',
        thumbnailUrl: room.thumbnailUrl || '',
        isAvailable: room.isAvailable,
        roomImages: room.roomImages || [],
      });
    } else {
      setRoomData({
        roomType: '',
        price: '',
        description: '',
        thumbnailUrl: '',
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
      thumbnailUrl: '',
      isAvailable: false,
      roomImages: [],
    });
  };

  const handleSave = () => {
    if (action === 'add') {
      const newRoom = {
        id: rooms.length + 1,
        ...roomData,
        price: Number(roomData.price),
        roomImages: roomData.roomImages,
      };
      setRooms([...rooms, newRoom]);
    } else if (action === 'update') {
      const updatedRooms = rooms.map((room) =>
        room.id === selectedRoom.id
          ? { ...room, ...roomData, price: Number(roomData.price), roomImages: roomData.roomImages }
          : room
      );
      setRooms(updatedRooms);
    }
    handleCloseDialog();
  };

  const handleDelete = () => {
    const updatedRooms = rooms.filter((room) => room.id !== selectedRoom.id);
    setRooms(updatedRooms);
    handleCloseDialog();
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomData({ ...roomData, thumbnailUrl: file.name });
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map((file) => file.name);
    setRoomData({ ...roomData, roomImages: fileNames });
  };

  const filteredRooms = rooms.filter((room) =>
    room.roomType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <MuiTextField
        label="Tìm kiếm theo Loại phòng"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        style={{ marginBottom: '20px' }}
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
            <TableRow key={room.id}>
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
              />
              <MuiTextField
                label="Giá"
                type="number"
                value={roomData.price}
                onChange={(e) => setRoomData({ ...roomData, price: e.target.value })}
                fullWidth
                style={{ marginBottom: '10px' }}
              />
              <MuiTextField
                label="Mô tả"
                value={roomData.description}
                onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                style={{ marginBottom: '10px' }}
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
                  <span style={{ marginLeft: '10px' }}>{roomData.thumbnailUrl}</span>
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