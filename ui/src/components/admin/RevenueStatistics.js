import React, { useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';

// Giao diện giữ nguyên
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
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [displayMonthYear, setDisplayMonthYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleCalculateRevenue = async () => {
    setError('');
    setTotalRevenue(0);
    setDisplayMonthYear('');

    const month = parseInt(selectedMonth, 10);
    const year = parseInt(selectedYear, 10);

    // Kiểm tra input
    if (!selectedMonth || !selectedYear) {
      setError('Vui lòng nhập cả tháng và năm');
      return;
    }

    if (isNaN(month) || month < 1 || month > 12) {
      setError('Vui lòng nhập tháng từ 1 đến 12');
      return;
    }

    if (isNaN(year) || year < 2020 || year > 2030) {
      setError('Vui lòng nhập năm từ 2020 đến 2030');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token trong localStorage. Vui lòng đăng nhập lại.');
      }

      // Sử dụng POST và gửi dữ liệu trong body
      const url = `http://localhost:5053/api/admin/statistics/revenue/month`;
      const response = await fetch(url, {
        method: 'POST', // Đổi sang POST
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Token từ localStorage với key 'token'
        },
        body: JSON.stringify({
          Month: month, // Viết hoa để khớp với DTO
          Year: year,   // Viết hoa để khớp với DTO
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch revenue data. Status: ${response.status}, Message: ${errorText || 'No additional error message'}`
        );
      }

      const data = await response.json();
      if (data.code === 200) {
        setTotalRevenue(data.data.revenue || 0);
        setDisplayMonthYear(`${month}/${year}`);
      } else {
        throw new Error(`API returned an error: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lấy dữ liệu: ' + err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            sx={{
              height: '60px',
              borderRadius: '8px',
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Tính Doanh thu'}
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

          {error ? (
            <Typography variant="h6" sx={{ color: '#f44336', marginTop: '20px' }}>
              {error}
            </Typography>
          ) : totalRevenue > 0 ? (
            <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Tháng/Năm</StyledTableCell>
                    <StyledTableCell>Tổng Doanh thu</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <TableCell>{displayMonthYear}</TableCell>
                    <TableCell sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                      ${totalRevenue.toLocaleString()}
                    </TableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Typography variant="h6" sx={{ color: '#f44336', marginTop: '20px' }}>
              Không có dữ liệu doanh thu cho tháng và năm này.
            </Typography>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default RevenueStatistics;