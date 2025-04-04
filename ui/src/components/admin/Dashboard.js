// src/components/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { mockRooms, mockUsers, mockBookings } from './mockData';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const StatsCard = ({ title, value, bgColor, textColor }) => (
  <Card sx={{ margin: 1, padding: 2, backgroundColor: bgColor, color: textColor, borderRadius: 2, boxShadow: 2, minHeight: '150px' }}>
    <CardContent>
      <Typography variant="h6" align="center" sx={{ fontWeight: '500', fontSize: '1.2rem' }}>{title}</Typography>
      <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', fontSize: '2.5rem' }}>{value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ rooms: 0, users: 0, bookings: 0, revenue: 0 });

  useEffect(() => {
    const totalRevenue = mockBookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
    setStats({
      rooms: mockRooms.length,
      users: mockUsers.length,
      bookings: mockBookings.length,
      revenue: totalRevenue,
    });
  }, []);

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