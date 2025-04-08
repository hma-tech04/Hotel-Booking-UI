import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/EditProfile.css';
import backgroundImage from '../images/home1.jpg';

function EditProfile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    FullName: '',
    Email: '',
    PhoneNumber: '',
    Role: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Không tìm thấy token, vui lòng đăng nhập lại');
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded); // In token để kiểm tra
      const userId = decoded.nameid; // Sửa thành nameid (chữ thường)
      if (!userId) {
        throw new Error('Không tìm thấy nameid trong token');
      }
      fetchUserInfo(userId); // Gọi API để lấy thông tin người dùng
    } catch (err) {
      setError(err.message || 'Token không hợp lệ, vui lòng đăng nhập lại');
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5053/api/user/id/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Không thể lấy thông tin người dùng';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
      const result = await response.json();
      if (result.code === 200 && result.data) {
        setUserInfo({
          FullName: result.data.fullName || '',
          Email: result.data.email || '',
          PhoneNumber: result.data.phoneNumber || '',
          Role: result.data.role || '',
        });
      } else {
        throw new Error(result.message || 'Dữ liệu trả về không hợp lệ');
      }
    } catch (error) {
      setError(error.message || 'Lỗi không xác định khi lấy thông tin người dùng');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhone = (PhoneNumber) => {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(PhoneNumber);
  };

  const handleSave = async () => {
    if (!userInfo.FullName.trim()) {
      setError('Vui lòng nhập tên');
      return;
    }
    if (userInfo.PhoneNumber && !validatePhone(userInfo.PhoneNumber)) {
      setError('Số điện thoại không hợp lệ (cần 10-11 số)');
      return;
    }
    if (!userInfo.Email.trim()) {
      setError('Email không được để trống');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.nameid; // Sửa thành nameid (chữ thường)
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
      const response = await fetch('http://localhost:5053/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          UserId: userId, // Gửi userId từ nameid
          FullName: userInfo.FullName,
          Email: userInfo.Email,
          PhoneNumber: userInfo.PhoneNumber || null,
          Role: userInfo.Role,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Cập nhật thông tin thất bại';
        if (response.status !== 204 && response.headers.get('Content-Length') !== '0') {
          const text = await response.text();
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = text || errorMessage;
          }
        }
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }

      alert('Cập nhật thông tin thành công!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordNavigation = () => {
    navigate('/reset-password');
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
            name="FullName"
            value={userInfo.FullName}
            onChange={handleChange}
            disabled={loading}
            placeholder="Nhập tên của bạn"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={userInfo.Email}
            onChange={handleChange}
            disabled={loading}
            placeholder="Nhập email của bạn"
            className="email-input"
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="PhoneNumber"
            value={userInfo.PhoneNumber}
            onChange={handleChange}
            disabled={loading}
            placeholder="Nhập số điện thoại"
          />
        </div>
        <button onClick={handleSave} className="save-button" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <button
          onClick={handleResetPasswordNavigation}
          className="reset-password-button"
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          Đặt lại mật khẩu
        </button>
      </div>
    </div>
  );
}

export default EditProfile;