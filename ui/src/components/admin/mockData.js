// src/mockData.js

export const mockRooms = [
  { id: 1, roomType: 'Single', price: 100, isAvailable: true },
  { id: 2, roomType: 'Double', price: 150, isAvailable: false },
  { id: 3, roomType: 'Suite', price: 250, isAvailable: true },
];

export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Sam Johnson', email: 'sam@example.com', role: 'User' },
];

export const mockBookings = [
  { id: 1, roomType: 'Single', userName: 'John Doe', phoneNumber: '1234567890', checkInDate: '4/1/2025', checkOutDate: '4/5/2025', totalPrice: 200 },
  { id: 2, roomType: 'Double', userName: 'Jane Smith', phoneNumber: '9876543210', checkInDate: '4/2/2025', checkOutDate: '4/6/2025', totalPrice: 400 },
];
