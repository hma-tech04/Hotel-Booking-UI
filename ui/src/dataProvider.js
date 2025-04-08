// src/dataProvider.js
import { fetchUtils } from 'react-admin';

const mockData = {
  rooms: [
    { id: 1, roomType: 'Single', price: 100, isAvailable: true },
    { id: 2, roomType: 'Double', price: 150, isAvailable: false },
    { id: 3, roomType: 'Suite', price: 250, isAvailable: true },
  ],
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Sam Johnson', email: 'sam@example.com', role: 'User' },
  ],
  bookings: [
    { id: 1, roomType: 'Single', userName: 'John Doe', phoneNumber: '1234567890', checkInDate: '4/1/2025', checkOutDate: '4/5/2025', totalPrice: 200 },
    { id: 2, roomType: 'Double', userName: 'Jane Smith', phoneNumber: '9876543210', checkInDate: '4/2/2025', checkOutDate: '4/6/2025', totalPrice: 400 },
  ],
};

const dataProvider = {
  getList: (resource, params) => {
    const data = mockData[resource] || [];
    return Promise.resolve({
      data,
      total: data.length,
    });
  },
  getOne: (resource, params) => {
    const data = mockData[resource].find(item => item.id === params.id);
    return Promise.resolve({ data });
  },
  getMany: (resource, params) => {
    const data = mockData[resource].filter(item => params.ids.includes(item.id));
    return Promise.resolve({ data });
  },
  getManyReference: (resource, params) => {
    const data = mockData[resource] || [];
    return Promise.resolve({ data, total: data.length });
  },
  create: (resource, params) => {
    const newItem = { id: mockData[resource].length + 1, ...params.data };
    mockData[resource].push(newItem);
    return Promise.resolve({ data: newItem });
  },
  update: (resource, params) => {
    const index = mockData[resource].findIndex(item => item.id === params.id);
    mockData[resource][index] = { ...mockData[resource][index], ...params.data };
    return Promise.resolve({ data: mockData[resource][index] });
  },
  updateMany: (resource, params) => {
    params.ids.forEach(id => {
      const index = mockData[resource].findIndex(item => item.id === id);
      mockData[resource][index] = { ...mockData[resource][index], ...params.data };
    });
    return Promise.resolve({ data: params.ids });
  },
  delete: (resource, params) => {
    const index = mockData[resource].findIndex(item => item.id === params.id);
    const deleted = mockData[resource].splice(index, 1)[0];
    return Promise.resolve({ data: deleted });
  },
  deleteMany: (resource, params) => {
    params.ids.forEach(id => {
      const index = mockData[resource].findIndex(item => item.id === id);
      mockData[resource].splice(index, 1);
    });
    return Promise.resolve({ data: params.ids });
  },
};

export default dataProvider;