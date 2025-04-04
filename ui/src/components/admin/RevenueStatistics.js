// src/components/admin/RevenueStatistics.js
import React, { useState } from 'react';
import { mockBookings } from './mockData';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
  borderRadius: '12px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  margin: '20px auto',
  maxWidth: '1000px',
  textAlign: 'center',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#333',
  borderBottom: '2px solid #1976d2',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f5f5f5',
  },
  '&:hover': {
    backgroundColor: '#e3f2fd',
    transition: 'background-color 0.3s ease',
  },
}));

const RevenueStatistics = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [displayMonthYear, setDisplayMonthYear] = useState('');

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleCalculateRevenue = () => {
    // Kiểm tra tính hợp lệ của tháng và năm
    const month = parseInt(selectedMonth, 10);
    const year = parseInt(selectedYear, 10);

    if (!selectedMonth || !selectedYear) {
      alert('Vui lòng nhập cả tháng và năm');
      return;
    }

    if (isNaN(month) || month < 1 || month > 12) {
      alert('Vui lòng nhập tháng từ 1 đến 12');
      return;
    }

    if (isNaN(year) || year < 2020 || year > 2030) {
      alert('Vui lòng nhập năm từ 2020 đến 2030');
      return;
    }

    const filteredBookings = mockBookings.filter((booking) => {
      const bookingDate = new Date(booking.checkInDate);
      const bookingMonth = bookingDate.getMonth() + 1; // getMonth() trả về 0-11, nên +1
      const bookingYear = bookingDate.getFullYear();
      return bookingMonth === month && bookingYear === year;
    });

    const revenue = filteredBookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
    setTotalRevenue(revenue);
    setBookingCount(filteredBookings.length);
    setDisplayMonthYear(`${month}/${year}`);
  };

  return (
    <Box sx={{ padding: '40px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          marginBottom: '40px',
          fontWeight: 700,
          color: '#1976d2',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
        }}
      >
        Thống kê Doanh thu
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Grid item xs={12} sm={5}>
          <TextField
            label="Tháng (1-12)"
            type="number"
            fullWidth
            value={selectedMonth}
            onChange={handleMonthChange}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              '& .MuiInputBase-root': { borderRadius: '8px', height: '60px', fontSize: '1.2rem' },
              '& .MuiInputLabel-root': { fontSize: '1.1rem' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            label="Năm (2020-2030)"
            type="number"
            fullWidth
            value={selectedYear}
            onChange={handleYearChange}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              '& .MuiInputBase-root': { borderRadius: '8px', height: '60px', fontSize: '1.2rem' },
              '& .MuiInputLabel-root': { fontSize: '1.1rem' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCalculateRevenue}
            sx={{
              height: '60px',
              borderRadius: '8px',
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            Tính Doanh thu
          </Button>
        </Grid>
      </Grid>

      <StyledCard>
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              marginBottom: '20px',
              color: '#424242',
              fontWeight: 600,
            }}
          >
            Kết quả Thống kê
          </Typography>

          {totalRevenue > 0 || bookingCount > 0 ? (
            <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Tháng/Năm</StyledTableCell>
                    <StyledTableCell>Tổng Doanh thu</StyledTableCell>
                    <StyledTableCell>Số lượng Đặt phòng</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <TableCell>{displayMonthYear}</TableCell>
                    <TableCell sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                      ${totalRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell>{bookingCount}</TableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Typography
              variant="h6"
              sx={{ color: '#f44336', marginTop: '20px' }}
            >
              Không có dữ liệu doanh thu cho tháng và năm này.
            </Typography>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default RevenueStatistics;