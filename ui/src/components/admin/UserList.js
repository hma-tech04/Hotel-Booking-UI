// src/components/admin/UserList.js
import React, { useState, useEffect } from 'react';
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
import { textFieldStyle } from '../../styles/RoomList.css'; // Import style từ RoomList.css
import { useAuthToken } from '../../Utils/useAuthToken'; // Import useAuthToken

const UserList = () => {
  const { accessToken } = useAuthToken(); // Lấy accessToken từ useAuthToken
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!accessToken) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await fetch('http://localhost:5053/api/admin/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const result = await response.json();
        if (result.code === 200) {
          const formattedUsers = result.data.map(user => ({
            id: user.userId,
            name: user.fullName || '',
            email: user.email || '',
            role: user.role,
            phoneNumber: user.phoneNumber,
            createdDate: user.createdDate,
          }));
          setUsers(formattedUsers);
          console.log('Fetched users:', formattedUsers);
        } else {
          throw new Error(result.message || 'API request failed');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [accessToken]);

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

  const handleSave = async () => {
    try {
      if (!accessToken) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`http://localhost:5053/api/admin/users/${selectedUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ role: userRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const result = await response.json();
      if (result.code === 200) {
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? { ...user, role: userRole } : user
        );
        setUsers(updatedUsers);
        handleCloseDialog();
      } else {
        throw new Error(result.message || 'Failed to update role');
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err.message);
    }
  };

  const handleOpenConfirmDelete = (userId) => {
    setUserToDelete(userId);
    setConfirmDeleteOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (!accessToken) {
        throw new Error('No authentication token found. Please log in.');
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5053/api/admin/users/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete user (Status: ${response.status})`);
      }

      const result = await response.json();
      if (result.code === 200) {
        const updatedUsers = users.filter((u) => u.id !== userToDelete);
        setUsers(updatedUsers);
        console.log(`User ${userToDelete} deleted successfully`);
        handleCloseConfirmDelete();
      } else {
        throw new Error(result.message || 'Unexpected API response');
      }
    } catch (err) {
      console.error('Delete error details:', {
        message: err.message,
        userId: userToDelete,
        timestamp: new Date().toISOString(),
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const customTextFieldStyle = {
    ...textFieldStyle,
    '& .MuiOutlinedInput-root': {
      ...textFieldStyle['& .MuiOutlinedInput-root'],
      '&.Mui-focused fieldset': {
        borderColor: 'blue',
      },
    },
  };

  const customDialogTextFieldStyle = {
    ...textFieldStyle,
    '& .MuiOutlinedInput-root': {
      ...textFieldStyle['& .MuiOutlinedInput-root'],
      '&.Mui-focused fieldset': {
        borderColor: 'pink',
      },
    },
  };

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <MuiTextField
        label="Tìm kiếm theo Tên hoặc Email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        style={{ marginBottom: '20px' }}
        sx={customTextFieldStyle}
      />
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>Lỗi: {error}</div>
      ) : (
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
                    onClick={() => handleOpenConfirmDelete(user.id)}
                  >
                    Xóa
                  </MuiButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog chỉnh sửa vai trò */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chỉnh sửa Vai trò Người dùng</DialogTitle>
        <DialogContent>
          <MuiTextField
            label="quires"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            fullWidth
            sx={customDialogTextFieldStyle}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog}>Hủy</MuiButton>
          <MuiButton onClick={handleSave}>Lưu</MuiButton>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={confirmDeleteOpen} onClose={handleCloseConfirmDelete}>
        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseConfirmDelete} color="primary">
            Hủy
          </MuiButton>
          <MuiButton onClick={handleDelete} color="secondary">
            Xác nhận
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserList;