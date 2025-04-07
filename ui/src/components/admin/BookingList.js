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
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [bookingPaymentStatuses, setBookingPaymentStatuses] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingsAndPaymentStatuses = async () => {
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

          const paymentStatuses = {};
          for (const booking of bookingData) {
            switch (booking.bookingStatus) {
              case 'Cancelled':
                paymentStatuses[booking.bookingId] = 'Đã hủy đặt phòng';
                continue;
              case 'Completed':
                paymentStatuses[booking.bookingId] = 'Đã hoàn thành';
                continue;
              case 'Confirmed':
                paymentStatuses[booking.bookingId] = 'Đã xác nhận';
                break;
              case 'Pending':
                paymentStatuses[booking.bookingId] = 'Đang chờ xử lý';
                break;
              default:
                paymentStatuses[booking.bookingId] = '';
                continue;
            }

            if (booking.paymentId && (booking.bookingStatus === 'Pending' || booking.bookingStatus === 'Confirmed')) {
              try {
                const paymentResponse = await axios.get(
                  `http://localhost:5053/api/payment/booking/${booking.bookingId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                const paymentData = paymentResponse.data.data || [];
                console.log(`Payment data for booking ${booking.bookingId}:`, paymentData);
                paymentStatuses[booking.bookingId] = determineCombinedStatus(booking.bookingStatus, paymentData);
              } catch (err) {
                console.error(`Error fetching payment status for booking ${booking.bookingId}:`, err);
                paymentStatuses[booking.bookingId] = `${paymentStatuses[booking.bookingId]} (Chưa thanh toán)`;
              }
            } else if (!booking.paymentId && (booking.bookingStatus === 'Pending' || booking.bookingStatus === 'Confirmed')) {
              paymentStatuses[booking.bookingId] = `${paymentStatuses[booking.bookingId]} (Chưa thanh toán)`;
            }
          }
          setBookingPaymentStatuses(paymentStatuses);
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
    fetchBookingsAndPaymentStatuses();
  }, []);

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
          setBookingPaymentStatuses((prev) => ({
            ...prev,
            [bookingId]: 'Đã hủy đặt phòng',
          }));
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

  const handleViewPayment = async (booking) => {
    setSelectedBooking(booking);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const response = await axios.get(`http://localhost:5053/api/payment/booking/${booking.bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const paymentData = response.data.data;
      if (Array.isArray(paymentData) && paymentData.length > 0) {
        setPaymentHistory(paymentData);
      } else {
        setPaymentHistory([]);
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: Please log in to view payment status.'
          : 'Failed to load payment status. Please check the API or console for details.'
      );
      console.error('Error fetching payment status:', err.response || err);
    }
    setPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialog(false);
    setSelectedBooking(null);
    setPaymentHistory([]);
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'Pending':
        return 'Chưa thanh toán';
      case 'Completed':
        return 'Đã thanh toán';
      case 'Failed':
        return 'Thất bại';
      case 'Cancelled':
        return 'Thanh toán bị hủy';
      default:
        return '';
    }
  };

  const determineCombinedStatus = (bookingStatus, paymentHistory) => {
    if (bookingStatus === 'Cancelled') return 'Đã hủy đặt phòng';
    if (bookingStatus === 'Completed') return 'Đã hoàn thành';

    if (paymentHistory.length === 0) {
      return bookingStatus === 'Pending' ? 'Đang chờ xử lý (Chưa thanh toán)' : 'Đã xác nhận (Chưa thanh toán)';
    }

    const latestPayment = paymentHistory[paymentHistory.length - 1];
    const paymentStatusText = getPaymentStatusText(latestPayment.status);

    if (!paymentStatusText) {
      return bookingStatus === 'Pending' ? 'Đang chờ xử lý' : 'Đã xác nhận';
    }

    return bookingStatus === 'Pending'
      ? `Đang chờ xử lý (${paymentStatusText})`
      : `Đã xác nhận (${paymentStatusText})`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleOpenDialog = (actionType) => {
    setAction(actionType);
    setOpenDialog(true);
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const endpoint =
        action === 'checkout'
          ? 'http://localhost:5053/api/admin/bookings/uncheckedout'
          : 'http://localhost:5053/api/admin/bookings/unchecked';

      const response = await axios.post(
        endpoint,
        { PhoneNumber: phoneNumber }, // Capitalized "PhoneNumber"
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const filteredData = response.data.data;
      if (Array.isArray(filteredData) && filteredData.length > 0) {
        const filteredForAction =
          action === 'checkout'
            ? filteredData.filter((booking) => booking.bookingStatus === 'Confirmed')
            : filteredData.filter((booking) => booking.bookingStatus === 'Pending');
        setFilteredBookings(filteredForAction);
        if (filteredForAction.length === 0) {
          alert(
            action === 'checkout'
              ? 'Không tìm thấy phòng đã xác nhận với số điện thoại này!'
              : 'Không tìm thấy đặt phòng đang chờ xử lý với số điện thoại này!'
          );
        }
      } else {
        setFilteredBookings([]);
        alert(
          action === 'checkout'
            ? 'Không tìm thấy phòng đã xác nhận với số điện thoại này!'
            : 'Không tìm thấy đặt phòng đang chờ xử lý với số điện thoại này!'
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
            ? {
                ...b,
                bookingStatus: action === 'checkin' ? 'Confirmed' : 'Completed',
                actualCheckInTime: action === 'checkin' ? new Date().toISOString() : b.actualCheckInTime,
                actualCheckOutTime: action === 'checkout' ? new Date().toISOString() : b.actualCheckOutTime,
              }
            : b
        );
        setBookings(updatedBookings);
        setFilteredBookings(filteredBookings.filter((b) => b.bookingId !== booking.bookingId));
        alert(
          `${action === 'checkin' ? 'Checked-in' : 'Checked-out'} thành công cho booking: ${booking.userId}`
        );
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized: You must be an admin to perform bromis action.'
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
            <TableCell>Ngày giờ nhận phòng thực tế</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.bookingId}>
              <TableCell>{booking.roomId || 'N/A'}</TableCell>
              <TableCell>{booking.userId || 'N/A'}</TableCell>
              <TableCell>{booking.checkInDate ? formatDate(booking.checkInDate) : 'N/A'}</TableCell>
              <TableCell>{booking.checkOutDate ? formatDate(booking.checkOutDate) : 'N/A'}</TableCell>
              <TableCell>{booking.actualCheckInTime ? formatDate(booking.actualCheckInTime) : 'N/A'}</TableCell>
              <TableCell>{bookingPaymentStatuses[booking.bookingId] || ''}</TableCell>
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
                  <TableCell>Ngày giờ nhận phòng thực tế</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell>{booking.roomId || 'N/A'}</TableCell>
                    <TableCell>{booking.userId || 'N/A'}</TableCell>
                    <TableCell>{booking.checkInDate ? formatDate(booking.checkInDate) : 'N/A'}</TableCell>
                    <TableCell>{booking.checkOutDate ? formatDate(booking.checkOutDate) : 'N/A'}</TableCell>
                    <TableCell>{booking.actualCheckInTime ? formatDate(booking.actualCheckInTime) : 'N/A'}</TableCell>
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
          <DialogTitle>Chi tiết thanh toán – {selectedBooking.bookingId}</DialogTitle>
          <DialogContent>
            {paymentHistory.length > 0 ? (
              <Table sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Thanh toán</TableCell>
                    <TableCell>Ngày</TableCell>
                    <TableCell>Số tiền</TableCell>
                    <TableCell>Phương thức</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.paymentId || payment.id}>
                      <TableCell>{payment.paymentId || 'N/A'}</TableCell>
                      <TableCell>{payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}</TableCell>
                      <TableCell>${payment.paymentAmount || 'N/A'}</TableCell>
                      <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                      <TableCell>{getPaymentStatusText(payment.paymentStatus)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div>Không có lịch sử thanh toán.</div>
            )}
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