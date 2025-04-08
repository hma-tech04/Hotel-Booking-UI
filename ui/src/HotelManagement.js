// src/HotelManagement.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button as MuiButton,
  Tabs,
  Tab,
} from '@mui/material';
import BookingList from './components/admin/BookingList';
import Dashboard from './components/admin/Dashboard';
import RevenueStatistics from './components/admin/RevenueStatistics';
import UserList from './components/admin/UserList';
import RoomList from './components/admin/RoomList';

const HotelManagement = () => {
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Rooms':
        return <RoomList />;
      case 'Users':
        return <UserList />;
      case 'Bookings':
        return <BookingList />;
      case 'Revenue':
        return <RevenueStatistics />;
      default:
        return null;
    }
  };

  const menuItems = [
    { name: 'Dashboard', label: 'Bảng điều khiển' },
    { name: 'Rooms', label: 'Phòng' },
    { name: 'Users', label: 'Người dùng' },
    { name: 'Bookings', label: 'Đặt phòng' },
    { name: 'Revenue', label: 'Doanh thu' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      {/* Thanh trên cùng */}
      <AppBar position="fixed">
        <Toolbar
          sx={{
            height: '80px',
            display: 'flex',
            alignItems: 'flex-end', 
            justifyContent: 'space-between', 
            paddingBottom: '-5px', 

          }}
        >
          <Typography
            variant="h5"
            noWrap
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              fontSize: '1.8rem',
            }}
          >
            Quản lý Khách sạn
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ marginRight: 2 }}
          >
            {menuItems.map((item) => (
              <Tab
                key={item.name}
                value={item.name}
                label={item.label}
                sx={{
                  fontSize: '0.9rem',
                  padding: '6px 12px',
                  minWidth: 'auto',
                }}
              />
            ))}
          </Tabs>
          <MuiButton
            variant="contained"
            color="secondary"
            onClick={handleBackToHome}
            size="small"
          >
            Trang chủ
          </MuiButton>
        </Toolbar>
      </AppBar>

      {/* Nội dung chính */}
      <main
        style={{
          flexGrow: 1,
          paddingTop: '80px', // Phù hợp với chiều cao của AppBar
          paddingLeft: 0,
          paddingRight: 0,
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: 0 }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default HotelManagement;