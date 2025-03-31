import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { gapi } from 'gapi-script'; // Import Google API client
import '../styles/login.css'; // Import the updated CSS

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Load Google API client
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Thay thế bằng Client ID của bạn
        scope: 'email',
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập đăng nhập thành công: lưu token và chuyển hướng đến trang chủ
    localStorage.setItem('userToken', 'dummyToken');
    navigate('/');
  };

  const handleGoogleLogin = () => {
    const GoogleAuth = gapi.auth2.getAuthInstance();

    GoogleAuth.signIn().then(
      (response) => {
        const googleToken = response.getAuthResponse().id_token;

        // Gửi token này lên backend để xác thực và lấy dữ liệu người dùng
        fetch('YOUR_BACKEND_API_URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: googleToken }),
        })
        .then((res) => res.json())
        .then((data) => {
          // Xử lý phản hồi từ backend (lưu token, điều hướng, v.v.)
          localStorage.setItem('userToken', data.token); // Giả sử backend trả về token
          navigate('/'); // Điều hướng đến trang chính
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Đăng nhập thất bại');
        });
      },
      (error) => {
        console.error('Google login error:', error);
        alert('Đăng nhập thất bại');
      }
    );
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h2>Xin chào</h2>
          <p>Vui lòng đăng nhập</p>
          {/* Form đăng nhập email và mật khẩu */}
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
              <img
                src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
                alt="Login icon"
                className="login-icon"
              />
              Đăng Nhập
              <span className="button-glow"></span>
            </button>
          </form>

          {/* Nút đăng nhập bằng Google */}
          <div className="google-login">
            <button type="button" onClick={handleGoogleLogin} className="google-login-button">
              <img
                src="https://img.icons8.com/?size=100&id=110580&format=png&color=000000"
                alt="Google logo"
                className="google-icon"
              />
              Đăng Nhập Bằng Google
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
