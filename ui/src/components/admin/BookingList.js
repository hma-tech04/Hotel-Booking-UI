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
import { jwtDecode } from 'jwt-decode';

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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchBookingsAndPaymentStatuses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập.');

        const decoded = jwtDecode(token);
        console.log('User role:', decoded.role);
        setIsAdmin(decoded.role === 'Admin');

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
                break;
              case 'Completed':
                paymentStatuses[booking.bookingId] = 'Đã hoàn thành';
                break;
              case 'Confirmed':
                paymentStatuses[booking.bookingId] = 'Đã xác nhận';
                break;
              case 'Pending':
                paymentStatuses[booking.bookingId] = 'Đang chờ xử lý';
                break;
              default:
                paymentStatuses[booking.bookingId] = 'N/A';
                break;
            }
          }
          setBookingPaymentStatuses(paymentStatuses);
        } else {
          throw new Error('Định dạng dữ liệu từ API không hợp lệ');
        }
      } catch (err) {
        setError(
          err.response?.status === 401
            ? 'Không có quyền: Vui lòng đăng nhập với tư cách admin.'
            : 'Không thể tải danh sách đặt phòng.'
        );
        console.error('Lỗi khi tải bookings:', err.response || err);
      }
    };
    fetchBookingsAndPaymentStatuses();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) {
      setError('Mã đặt phòng không xác định.');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này không?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Không tìm thấy token xác thực.');

        console.log(`Canceling booking ID: ${bookingId}`);
        const response = await axios.put(
          `http://localhost:5053/api/bookings/${bookingId}/cancel`,
          null,
          {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }
        );

        if (response.data.data) {
          setBookings((prev) =>
            prev.map((booking) =>
              booking.bookingId === bookingId ? { ...booking, bookingStatus: 'Cancelled' } : booking
            )
          );
          setBookingPaymentStatuses((prev) => ({
            ...prev,
            [bookingId]: 'Đã hủy đặt phòng',
          }));
          alert('Đặt phòng đã được hủy thành công!');
        } else {
          throw new Error('Hủy đặt phòng không thành công.');
        }
      } catch (err) {
        setError(
          err.response?.status === 401
            ? 'Không có quyền: Bạn phải là admin để hủy đặt phòng.'
            : err.response?.data?.message || 'Không thể hủy đặt phòng.'
        );
        console.error('Lỗi khi hủy đặt phòng:', err.response || err);
      }
    }
  };

  const handleViewPayment = async (booking) => {
    setSelectedBooking(booking);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực.');

      console.log(`Fetching payment for booking ID: ${booking.bookingId}`);
      const response = await axios.get(`http://localhost:5053/api/payment/booking/${booking.bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const paymentData = response.data.data;
      setPaymentHistory(Array.isArray(paymentData) && paymentData.length > 0 ? paymentData : []);
      setPaymentDialog(true);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Không có quyền: Vui lòng đăng nhập để xem thanh toán.'
          : 'Không thể tải thông tin thanh toán.'
      );
      console.error('Lỗi khi lấy thông tin thanh toán:', err.response || err);
    }
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialog(false);
    setSelectedBooking(null);
    setPaymentHistory([]);
  };

  const handleOpenDialog = (actionType) => {
    setAction(actionType);
    setOpenDialog(true);
    setError(null);
  };

  const handleSearch = async () => {
    try {
      if (!/^\d{10}$/.test(phoneNumber)) {
        setError('Số điện thoại phải đúng 10 chữ số.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực.');

      const endpoint =
        action === 'checkout'
          ? 'http://localhost:5053/api/admin/bookings/uncheckedout'
          : 'http://localhost:5053/api/admin/bookings/unchecked';

      console.log(`Searching ${endpoint} with phone: ${phoneNumber}`);
      const response = await axios.post(
        endpoint,
        { PhoneNumber: phoneNumber },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      const filteredData = response.data.data;
      console.log('Filtered data from API:', filteredData);
      if (Array.isArray(filteredData)) {
        const filteredForAction =
          action === 'checkout'
            ? filteredData.filter((booking) => booking.bookingStatus === 'Confirmed')
            : filteredData.filter((booking) => booking.bookingStatus === 'Pending');
        setFilteredBookings(filteredForAction);
        if (filteredForAction.length === 0) {
          setError(
            action === 'checkout'
              ? 'Không tìm thấy phòng đã xác nhận để check-out với số điện thoại này.'
              : 'Không tìm thấy đặt phòng đang chờ xử lý để check-in với số điện thoại này.'
          );
        }
      } else {
        throw new Error('Định dạng dữ liệu từ API không hợp lệ');
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Không có quyền: Bạn phải là admin để tìm kiếm.'
          : err.response?.data?.message || 'Không thể tìm kiếm đặt phòng.'
      );
      console.error('Lỗi khi tìm kiếm:', err.response || err);
    }
  };

  const checkPaymentStatus = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực.');

      console.log(`Checking payment status for booking ID: ${bookingId}`);
      const response = await axios.get(`http://localhost:5053/api/payment/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Full payment status response:', response.data); // Log toàn bộ phản hồi
      const paymentData = response.data.data;
      console.log('Payment data:', paymentData);

      if (Array.isArray(paymentData) && paymentData.length > 0) {
        const latestPayment = paymentData[paymentData.length - 1];
        console.log('Latest payment:', latestPayment);
        return latestPayment.status === 'Completed'; // Trả về true nếu đã thanh toán
      }
      console.log('No payment records found for this booking.');
      return false; // Chưa có thanh toán
    } catch (err) {
      console.error('Lỗi khi kiểm tra trạng thái thanh toán:', err.response || err);
      return false; // Giả định chưa thanh toán nếu có lỗi
    }
  };

  const handleConfirmAction = async (booking) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực.');

      // Kiểm tra trạng thái thanh toán trước khi check-in
      if (action === 'checkin') {
        const isPaid = await checkPaymentStatus(booking.bookingId);
        console.log(`Payment status for booking ${booking.bookingId}: ${isPaid ? 'Paid' : 'Not Paid'}`);
        if (!isPaid) {
          throw new Error('Vui lòng thanh toán booking trước khi check-in.');
        }
      }

      const endpoint =
        action === 'checkin'
          ? `http://localhost:5053/api/bookings/check-in/${booking.bookingId}`
          : `http://localhost:5053/api/bookings/check-out/${booking.bookingId}`;

      console.log(`Calling ${endpoint} for booking ID: ${booking.bookingId}`);
      const response = await axios.post(endpoint, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API response:', response.data);
      if (response.data.data === true) {
        setBookings((prev) =>
          prev.map((b) =>
            b.bookingId === booking.bookingId
              ? {
                  ...b,
                  bookingStatus: action === 'checkin' ? 'Confirmed' : 'Completed',
                  actualCheckInTime: action === 'checkin' ? new Date().toISOString() : b.actualCheckInTime,
                  actualCheckOutTime: action === 'checkout' ? new Date().toISOString() : b.actualCheckOutTime,
                }
              : b
          )
        );
        setFilteredBookings((prev) => prev.filter((b) => b.bookingId !== booking.bookingId));
        alert(`${action === 'checkin' ? 'Check-in' : 'Check-out'} thành công cho booking: ${booking.bookingId}`);
      } else {
        throw new Error(response.data.Message || 'Hành động không thành công do lỗi từ server.');
      }
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? 'Không có quyền: Bạn phải là admin để thực hiện hành động này.'
          : err.message || `Không thể ${action === 'checkin' ? 'check-in' : 'check-out'} booking ${booking.bookingId}`;
      setError(errorMessage);
      console.error('Lỗi khi xác nhận:', err.response || err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPhoneNumber('');
    setFilteredBookings([]);
    setSelectedBooking(null);
    setError(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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
        <MuiButton variant="contained" color="secondary" onClick={() => handleOpenDialog('checkout')}>
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
              <TableCell>{bookingPaymentStatuses[booking.bookingId] || 'N/A'}</TableCell>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ '& .MuiDialog-paper': { minWidth: '600px' } }}>
        <DialogTitle>Nhập số điện thoại để {action === 'checkin' ? 'Check-in' : 'Check-out'}</DialogTitle>
        <DialogContent>
          <MuiTextField
            label="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            style={{ marginTop: '10px', marginBottom: '20px' }}
          />
          {filteredBookings.length > 0 && (
            <Table sx={{ minWidth: 550 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đặt phòng</TableCell>
                  <TableCell>Mã khách hàng</TableCell>
                  <TableCell>Mã phòng</TableCell>
                  <TableCell>Ngày nhận phòng</TableCell>
                  <TableCell>Ngày giờ nhận thực tế</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell>{booking.bookingId || 'N/A'}</TableCell>
                    <TableCell>{booking.userId || 'N/A'}</TableCell>
                    <TableCell>{booking.roomId || 'N/A'}</TableCell>
                    <TableCell>{formatDate(booking.checkInDate)}</TableCell>
                    <TableCell>{formatDate(booking.actualCheckInTime)}</TableCell>
                    <TableCell>
                      <MuiButton
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleConfirmAction(booking)}
                        disabled={!isAdmin}
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
        <Dialog open={paymentDialog} onClose={handleClosePaymentDialog} sx={{ '& .MuiDialog-paper': { minWidth: '800px' } }}>
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
                      <TableCell>{payment.paymentStatus || 'N/A'}</TableCell>
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