// src/components/admin/UserList.js
import React, { useState } from 'react';
import {
  TextField as MuiTextField,
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { mockUsers } from './mockData';

const UserList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setUserRole(user.role);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setUserRole('');
  };

  const handleSave = () => {
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, role: userRole } : user
    );
    setUsers(updatedUsers);
    handleCloseDialog();
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <MuiTextField
        label="Tìm kiếm theo Tên hoặc Email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        style={{ marginBottom: '20px' }}
      />
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell>Tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <MuiButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog(user)}
                  style={{ marginRight: '10px' }}
                >
                  Chỉnh sửa
                </MuiButton>
                <MuiButton
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(user.id)}
                >
                  Xóa
                </MuiButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chỉnh sửa Vai trò Người dùng</DialogTitle>
        <DialogContent>
          <MuiTextField
            label="Vai trò"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog}>Hủy</MuiButton>
          <MuiButton onClick={handleSave}>Lưu</MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserList;