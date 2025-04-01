import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Import GoogleOAuthProvider
import '../styles/login.css';

const clientId = "403757915006-h5db3tft1bmon6g7tsopr02gculscv2d.apps.googleusercontent.com"; // Đảm bảo dùng clientId chính xác

function Login() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();

  // Hàm xử lý đăng nhập thông qua form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gửi yêu cầu đăng nhập đến backend
    const response = await fetch('http://localhost:5053/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email, 
        Password, 
      }),
    });

    const data = await response.json();

    // Kiểm tra nếu đăng nhập thành công
    if (response.ok && data.code === 200 && data.data && data.data.accessToken) {
      // Lưu token vào localStorage và điều hướng đến trang chủ
      localStorage.setItem('userToken', data.data.accessToken);
      navigate('/'); // Điều hướng đến trang Home hoặc nơi bạn muốn
    } else {
      alert(data.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin');
    }
  };

  // Hàm xử lý đăng nhập thông qua Google
  const handleGoogleSuccess = async (response) => {
    console.log('Đăng nhập Google thành công:', response);
    
    const googleToken = response.credential; // Dùng đúng tham số "credential"
  
    const apiResponse = await fetch('http://localhost:5053/api/auth/login-google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ IdToken: googleToken }),
    });
    
    console.log(JSON.stringify({ IdToken: googleToken })); // Gửi đúng tham số "IdToken"
  
    const apiData = await apiResponse.json();
    if (apiResponse.ok && apiData.code === 200 && apiData.data && apiData.data.accessToken) {
      localStorage.setItem('userToken', apiData.data.accessToken);
      alert('Đăng nhập Google thành công!');
      navigate('/'); // Điều hướng đến trang Home
    } else {
      alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Đăng nhập Google thất bại:', error);
    alert('Lỗi: ' + error.error); // Hiển thị chi tiết lỗi
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-container">
        <div className="login-box">
          <h2>Đăng Nhập</h2>
          <p>Mời bạn đăng nhập</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Đăng Nhập
            </button>
          </form>
          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
            />
          </div>
          <div className="login-links">
            <p>
              Chưa có tài khoản? <a href="/register">Đăng ký</a>
            </p>
            <p>
              <a href="/forgot-password">Quên mật khẩu?</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </GoogleOAuthProvider>
  );
}

export default Login;
