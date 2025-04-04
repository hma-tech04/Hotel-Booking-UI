import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/EditProfile.css';
import backgroundImage from '../images/home1.jpg';

function EditProfile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUserInfo({
        name: decoded.name || decoded.username || '',
        email: decoded.email || '',
        phone: decoded.phone || '',
      });
    } catch (err) {
      setError('Không thể tải thông tin người dùng');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phone);
  };

  const handleSave = async () => {
    if (!userInfo.name.trim()) {
      setError('Vui lòng nhập tên');
      return;
    }
    if (userInfo.phone && !validatePhone(userInfo.phone)) {
      setError('Số điện thoại không hợp lệ (cần 10-11 số)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userInfo.name,
          phone: userInfo.phone,
        }),
      });
      if (!response.ok) throw new Error('Cập nhật thông tin thất bại');
      const data = await response.json();
      if (data.token) localStorage.setItem('token', data.token);
      alert('Cập nhật thông tin thành công!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="edit-profile-container">
        <h2>Chỉnh sửa thông tin cá nhân</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            disabled={loading}
            placeholder="Nhập tên của bạn"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            disabled
            className="email-input" // Thêm class cho input email
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            disabled={loading}
            placeholder="Nhập số điện thoại"
          />
        </div>
        <button onClick={handleSave} className="save-button" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
}

export default EditProfile;