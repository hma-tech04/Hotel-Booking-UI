import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuthToken } from '../useAuthToken' // Lên một cấp để trỏ về src/AuthContext.js
import '../styles/login.css';

const clientId = "297963829947-t0gnsrpfcauqlh6dumpi5dph8q27k5ug.apps.googleusercontent.com";

function Login({ updateAdminStatus }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { updateToken } = useAuthToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { Email: email, Password: password };
      console.log('Payload gửi đi:', payload);

      const response = await fetch('https://localhost:7044/api/auth/login', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Mã trạng thái phản hồi:', response.status);
      const data = await response.json();
      console.log('Dữ liệu phản hồi:', data);

      if (response.ok && data.code === 200 && data.data?.accessToken) {
        updateToken(data.data.accessToken);
        updateAdminStatus(data.data.accessToken);
        console.log('Đăng nhập thành công, chuyển hướng đến /');
        navigate('/', { replace: true });
      } else {
        const errorMessage = data.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại email hoặc mật khẩu.';
        alert(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Lỗi trong quá trình đăng nhập:', error);
      alert('Đã xảy ra lỗi khi kết nối đến server. Vui lòng thử lại sau.');
    }
  };

  const handleGoogleSuccess = async (response) => {
    console.log('Đăng nhập Google thành công:', response);
    const googleToken = response.credential;
    const payload = { IdToken: googleToken };
    console.log('Payload gửi đến server:', payload);

    try {
      const apiResponse = await fetch('https://localhost:7044/api/auth/login-google', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Mã trạng thái phản hồi từ server:', apiResponse.status);
      const apiData = await apiResponse.json();
      console.log('Dữ liệu phản hồi từ server:', apiData);

      if (apiResponse.ok && apiData.code === 200 && apiData.data?.accessToken) {
        updateToken(apiData.data.accessToken);
        updateAdminStatus(apiData.data.accessToken);
        console.log('Đăng nhập Google thành công, chuyển hướng đến /');
        navigate('/', { replace: true });
      } else {
        const errorMessage = apiData.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.';
        alert(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Lỗi trong quá trình đăng nhập Google:', error);
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
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              scope="openid email profile"
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
    </GoogleOAuthProvider>
  );
}

export default Login;