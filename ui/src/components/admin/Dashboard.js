import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useAuthToken } from '../../Utils/useAuthToken'; // Import useAuthToken

const StatsCard = ({ title, value, bgColor, textColor }) => (
  <Card sx={{ margin: 1, padding: 2, backgroundColor: bgColor, color: textColor, borderRadius:  2, boxShadow: 2, minHeight: '150px' }}>
    <CardContent>
      <Typography variant="h6" align="center" sx={{ fontWeight: '500', fontSize: '1.2rem' }}>{title}</Typography>
      <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', fontSize: '2.5rem' }}>{value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { accessToken } = useAuthToken(); // Lấy accessToken từ useAuthToken
  const [stats, setStats] = useState({ rooms: 0, users: 0, bookings: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      setError('No token found. Please log in.');
      setLoading(false); // Dừng loading nếu không có token
      return;
    }

    const fetchData = async () => {
      try {
        // Cấu hình headers với accessToken
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        };

        // 1. Lấy revenue từ API
        const revenueResponse = await fetch('http://localhost:5053/api/admin/statistics/revenue', {
          method: 'GET',
          headers,
        });
        if (!revenueResponse.ok) throw new Error('Failed to fetch revenue');
        const revenueData = await revenueResponse.json();
        const revenue = revenueData.data.revenue;

        // 2. Đếm tổng bookings từ API
        const bookingsResponse = await fetch('http://localhost:5053/api/bookings', {
          method: 'GET',
          headers,
        });
        if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsResponse.json();
        const bookingsCount = Array.isArray(bookingsData) ? bookingsData.length : bookingsData.data.length;

        // 3. Đếm tổng users từ API
        const usersResponse = await fetch('http://localhost:5053/api/admin/users', {
          method: 'GET',
          headers,
        });
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        const usersCount = Array.isArray(usersData) ? usersData.length : usersData.data.length;

        // 4. Đếm tổng rooms từ API
        const roomsResponse = await fetch('http://localhost:5053/api/rooms/all', {
          method: 'GET',
          headers,
        });
        if (!roomsResponse.ok) throw new Error('Failed to fetch rooms');
        const roomsData = await roomsResponse.json();
        const roomsCount = Array.isArray(roomsData) ? roomsData.length : roomsData.data.length;

        // Cập nhật state với dữ liệu từ API
        setStats({
          rooms: roomsCount,
          users: usersCount,
          bookings: bookingsCount,
          revenue: revenue,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]); // Chạy lại khi accessToken thay đổi

  if (loading) {
    return <Typography align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography align="center" color="error">Error: {error}</Typography>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh', width: '100%' }}>
      <Typography variant="h4" align="center" style={{ marginBottom: '20px', fontWeight: '600' }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Rooms" value={stats.rooms} bgColor="#e3f2fd" textColor="#0277bd" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Users" value={stats.users} bgColor="#e8f5e9" textColor="#388e3c" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Bookings" value={stats.bookings} bgColor="#fff3e0" textColor="#f57c00" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} bgColor="#e8f5e9" textColor="#2e7d32" />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;