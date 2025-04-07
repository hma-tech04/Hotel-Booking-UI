import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

const BookingList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [action, setAction] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found. Please log in.');

        const response = await axios.get('http://localhost:5053/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookingData = response.data.data;
        console.log('Fetched bookings:', bookingData);
        if (Array.isArray(bookingData)) {
          setBookings(bookingData);
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (err) {
        setError(
          err.response?.status === 401
            ? 'Unauthorized: Please log in as admin.'
            : 'Failed to load bookings. Please check the API or console for details.'
        );
        console.error('Error fetching bookings:', err.response || err);
      }
    };
    fetchBookings();
  }, []);

  // Handle Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) {
      setError('Booking ID is undefined. Please check the booking data.');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này không?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');

        const response = await axios.put(
          `http://localhost:5053/api/bookings/${bookingId}/cancel`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.data) {
          const updatedBookings = bookings.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, bookingStatus: 'Cancelled' } : booking
          );
          setBookings(updatedBookings);
          alert('Đặt phòng đã được hủy thành công!');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to cancel booking.';
        setError(
          err.response?.status === 401
            ? 'Unauthorized: You must be an admin to cancel a booking.'
            : errorMessage
        );
        console.error('Error details:', err.response || err);
      }
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

  // Mock payment history
  const getPaymentHistory = (booking) => {
    return [
      {
        id: `PAY-${booking.bookingId}-001`,
        date: new Date().toLocaleDateString(),
        amount: booking.totalPrice,
        status: booking.bookingStatus === 'Checked-in' ? 'Paid' : 'Pending',
      },
    ];
  };

  const handleOpenDialog = (actionType) => {
    setAction(actionType);
    setOpenDialog(true);
  };

  // Search unchecked bookings by phone number
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const response = await axios.post(
        'http://localhost:5053/api/admin/bookings/unchecked',
        { PhoneNumber: phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const filteredData = response.data.data;
      if (Array.isArray(filteredData) && filteredData.length > 0) {
        // Lọc thêm cho Check-out: chỉ giữ booking đã Checked-in
        const filteredForAction =
          action === 'checkout'
            ? filteredData.filter((booking) => booking.bookingStatus === 'Checked-in')
            : filteredData; // Check-in giữ nguyên toàn bộ
        setFilteredBookings(filteredForAction);
        if (filteredForAction.length === 0) {
          alert(
            action === 'checkout'
              ? 'Không tìm thấy phòng đã check-in với số điện thoại này!'
              : 'Không tìm thấy đặt phòng chưa check-in với số điện thoại này!'
          );
        }
      } else {
        setFilteredBookings([]);
        alert(
          action === 'checkout'
            ? 'Không tìm thấy phòng đã check-in với số điện thoại này!'
            : 'Không tìm thấy đặt phòng chưa check-in với số điện thoại này!'
        );
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: You must be an admin to search bookings.'
          : err.response?.data?.message || 'Failed to search bookings.'
      );
      console.error('Error searching bookings:', err.response || err);
    }
  };

  // Handle Confirm Action for a specific booking
  const handleConfirmAction = async (booking) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const endpoint =
        action === 'checkin'
          ? `http://localhost:5053/api/bookings/check-in/${booking.bookingId}`
          : `http://localhost:5053/api/bookings/check-out/${booking.bookingId}`;

      const response = await axios.post(endpoint, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.data) {
        const updatedBookings = bookings.map((b) =>
          b.bookingId === booking.bookingId
            ? { ...b, bookingStatus: action === 'checkin' ? 'Checked-in' : 'Checked-out' }
            : b
        );
        setBookings(updatedBookings);
        setFilteredBookings(filteredBookings.filter((b) => b.bookingId !== booking.bookingId)); // Xóa booking đã xử lý
        alert(
          `${action === 'checkin' ? 'Checked-in' : 'Checked-out'} thành công cho booking: ${booking.userId}`
        );
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: You must be an admin to perform this action.'
          : 'Failed to process action.'
      );
      console.error('Error processing action:', err.response || err);
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
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
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
            <TableCell>Mã phòng</TableCell>
            <TableCell>Mã khách hàng</TableCell>
            <TableCell>Ngày nhận phòng</TableCell>
            <TableCell>Ngày trả phòng</TableCell>
            <TableCell>Tổng giá</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.bookingId}>
              <TableCell>{booking.roomId || 'N/A'}</TableCell>
              <TableCell>{booking.userId || 'N/A'}</TableCell>
              <TableCell>{booking.checkInDate || 'N/A'}</TableCell>
              <TableCell>{booking.checkOutDate || 'N/A'}</TableCell>
              <TableCell>{booking.totalPrice || 'N/A'}</TableCell>
              <TableCell>{booking.bookingStatus || 'Pending'}</TableCell>
              <TableCell>
                <MuiButton
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleCancelBooking(booking.bookingId)}
                  disabled={booking.bookingStatus === 'Cancelled'}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ '& .MuiDialog-paper': { minWidth: '800px' } }}>
        <DialogTitle>
          Nhập số điện thoại để {action === 'checkin' ? 'Check-in' : 'Check-out'}
        </DialogTitle>
        <DialogContent>
          <MuiTextField
            label="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            style={{ marginTop: '10px', marginBottom: '20px' }}
          />
          {filteredBookings.length > 0 && (
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Mã phòng</TableCell>
                  <TableCell>Mã khách hàng</TableCell>
                  <TableCell>Ngày nhận phòng</TableCell>
                  <TableCell>Ngày trả phòng</TableCell>
                  <TableCell>Tổng giá</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell>{booking.roomId || 'N/A'}</TableCell>
                    <TableCell>{booking.userId || 'N/A'}</TableCell>
                    <TableCell>{booking.checkInDate || 'N/A'}</TableCell>
                    <TableCell>{booking.checkOutDate || 'N/A'}</TableCell>
                    <TableCell>{booking.totalPrice || 'N/A'}</TableCell>
                    <TableCell>
                      <MuiButton
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleConfirmAction(booking)}
                      >
                        {action === 'checkin' ? 'Xác nhận Check-in' : 'Xác nhận Check-out'}
                      </MuiButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog}>Hủy</MuiButton>
          <MuiButton onClick={handleSearch}>Tìm kiếm</MuiButton>
        </DialogActions>
      </Dialog>

      {paymentDialog && selectedBooking && (
        <Dialog
          open={paymentDialog}
          onClose={handleClosePaymentDialog}
          sx={{ '& .MuiDialog-paper': { minWidth: '800px' } }}
        >
          <DialogTitle>Lịch sử thanh toán - {selectedBooking.bookingId}</DialogTitle>
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