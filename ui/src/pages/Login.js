import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../styles/login.css';

const clientId = "403757915006-h5db3tft1bmon6g7tsopr02gculscv2d.apps.googleusercontent.com";

function Login({ updateAdminStatus }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5053/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.code === 200 && data.data && data.data.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
        updateAdminStatus(data.data.accessToken); // Cập nhật trạng thái isAdmin
        navigate('/');
      } else {
        const errorMessage = data.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại email hoặc mật khẩu.';
        alert(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Đã xảy ra lỗi khi kết nối đến server. Vui lòng thử lại sau.');
    }
  };

  const handleGoogleSuccess = async (response) => {
    console.log('Đăng nhập Google thành công:', response);

    const googleToken = response.credential;

    try {
      const apiResponse = await fetch('http://localhost:5053/api/auth/login-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ IdToken: googleToken }),
      });

      const apiData = await apiResponse.json();

      if (apiResponse.ok && apiData.code === 200 && apiData.data && apiData.data.accessToken) {
        localStorage.setItem('token', apiData.data.accessToken);
        updateAdminStatus(apiData.data.accessToken); // Cập nhật trạng thái isAdmin
        navigate('/');
      } else {
        alert(`Lỗi: ${apiData.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.'}`);
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      alert('Đã xảy ra lỗi khi kết nối đến server. Vui lòng thử lại sau.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Đăng nhập Google thất bại:', error);
    alert(`Lỗi đăng nhập Google: ${error.error || 'Không xác định'}`);
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
                value={email}
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
                value={password}
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