// src/components/admin/BookingList.js
import React, { useState } from 'react';
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField as MuiTextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { mockBookings } from './mockData';

const BookingList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [action, setAction] = useState('');
  const [bookings, setBookings] = useState(mockBookings);

  // Handle Cancel Booking
  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Bạn có chắc muốn hủy đặt phòng này?')) {
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: 'Cancelled' }
          : booking
      );
      setBookings(updatedBookings);
      alert('Đặt phòng đã được hủy thành công!');
    }
  };

  // Handle View Payment Status
  const handleViewPayment = (booking) => {
    setSelectedBooking(booking);
    setPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialog(false);
    setSelectedBooking(null);
  };

  // Mock payment history (có thể thay bằng dữ liệu thực tế sau này)
  const getPaymentHistory = (booking) => {
    return [
      {
        id: `PAY-${booking.id}-001`,
        date: new Date().toLocaleDateString(),
        amount: booking.totalPrice,
        status: booking.status === 'Checked-in' ? 'Paid' : 'Pending',
      },
      // Có thể thêm các bản ghi khác ở đây trong tương lai
    ];
  };

  const handleOpenDialog = (actionType) => {
    setAction(actionType);
    setOpenDialog(true);
  };

  const handleSearch = () => {
    const filtered = bookings.filter((booking) => booking.phoneNumber === phoneNumber);
    setFilteredBookings(filtered);
    if (filtered.length > 0) setSelectedBooking(filtered[0]);
  };

  const handleConfirmAction = () => {
    if (selectedBooking) {
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, status: action === 'checkin' ? 'Checked-in' : 'Checked-out' }
          : booking
      );
      setBookings(updatedBookings);
      alert(`${action === 'checkin' ? 'Checked-in' : 'Checked-out'}: ${selectedBooking.userName}`);
      handleCloseDialog();
    } else {
      alert('Không tìm thấy đặt phòng phù hợp!');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPhoneNumber('');
    setFilteredBookings([]);
    setSelectedBooking(null);
  };

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <MuiButton
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog('checkin')}
          style={{ marginRight: '10px' }}
        >
          Check-in
        </MuiButton>
        <MuiButton
          variant="contained"
          color="secondary"
          onClick={() => handleOpenDialog('checkout')}
        >
          Check-out
        </MuiButton>
      </div>

      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell>Loại phòng</TableCell>
            <TableCell>Người dùng</TableCell>
            <TableCell>Ngày nhận phòng</TableCell>
            <TableCell>Ngày trả phòng</TableCell>
            <TableCell>Tổng giá</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.roomType}</TableCell>
              <TableCell>{booking.userName}</TableCell>
              <TableCell>{booking.checkInDate}</TableCell>
              <TableCell>{booking.checkOutDate}</TableCell>
              <TableCell>{booking.totalPrice}</TableCell>
              <TableCell>{booking.status || 'Pending'}</TableCell>
              <TableCell>
                <MuiButton
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleCancelBooking(booking.id)}
                  disabled={booking.status === 'Cancelled'}
                  style={{ marginRight: '5px' }}
                >
                  Hủy
                </MuiButton>
                <MuiButton
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleViewPayment(booking)}
                >
                  Xem TT
                </MuiButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Check-in/Check-out */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Nhập số điện thoại để {action === 'checkin' ? 'Check-in' : 'Check-out'}
        </DialogTitle>
        <DialogContent>
          <MuiTextField
            label="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog}>Hủy</MuiButton>
          <MuiButton onClick={handleSearch}>Tìm kiếm</MuiButton>
        </DialogActions>
      </Dialog>

      {/* Dialog for Search Results */}
      {filteredBookings.length > 0 && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Thông tin đặt phòng</DialogTitle>
          <DialogContent>
            <p>Loại phòng: {filteredBookings[0].roomType}</p>
            <p>Người dùng: {filteredBookings[0].userName}</p>
            <p>Ngày nhận phòng: {filteredBookings[0].checkInDate}</p>
            <p>Ngày trả phòng: {filteredBookings[0].checkOutDate}</p>
            <p>Tổng giá: ${filteredBookings[0].totalPrice}</p>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleCloseDialog}>Hủy</MuiButton>
            <MuiButton onClick={handleConfirmAction} color="primary">
              {action === 'checkin' ? 'Xác nhận Check-in' : 'Xác nhận Check-out'}
            </MuiButton>
          </DialogActions>
        </Dialog>
      )}

      {/* Payment History Dialog with Larger Size */}
      {paymentDialog && selectedBooking && (
        <Dialog
          open={paymentDialog}
          onClose={handleClosePaymentDialog}
          sx={{ '& .MuiDialog-paper': { minWidth: '800px' } }} // Tăng gấp đôi kích thước
        >
          <DialogTitle>Lịch sử thanh toán - {selectedBooking.id}</DialogTitle>
          <DialogContent>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID Thanh toán</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getPaymentHistory(selectedBooking).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleClosePaymentDialog}>Đóng</MuiButton>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default BookingList;