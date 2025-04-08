import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ React Router
import "../styles/register.css"; // Import file CSS mới
import Footer from "../components/Footer";
import axios from 'axios';

function Register() {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [PasswordHash, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Sửa lỗi
  const navigate = useNavigate();  // Khai báo useNavigate để điều hướng

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (PasswordHash !== confirmPassword) {
      setError("❌ Mật khẩu không khớp!");
      return;
    }

    setError(""); // Xóa lỗi nếu có

    // Dữ liệu người dùng (bao gồm fullName, email và password)
    const userData = {
      FullName,
      Email,
      PasswordHash,
    };

    try {
      // Gửi request API đăng ký với axios
      const response = await axios.post('http://localhost:5053/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Kiểm tra nếu đăng ký thành công (API trả về code 200)
      if (response.status === 200 && response.data.code === 200) {
        alert("Đăng ký thành công!");
        // Điều hướng đến trang Login sau khi đăng ký thành công
        navigate('/login');  // Điều hướng đến trang Login
      } else {
        // Nếu API trả về lỗi, hiển thị thông báo lỗi
        setError(response.data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      if (error.response) {
        console.error("Error response:", error.response);
        setError("❌ Đã xảy ra lỗi từ phía máy chủ, vui lòng thử lại.");
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("❌ Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại.");
      } else {
        console.error("General Error:", error.message);
        setError("❌ Đã xảy ra lỗi không xác định.");
      }
    }
  };

  return (
    <div>
      <div className="page-container">
        <div className="register-container">
          <div className="register-card">
            <h2 className="register-title">Đăng ký</h2>

            {error && <p className="error-message">{error}</p>}

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="FullName">Họ và Tên</label>
                <input
                  type="text"
                  id="FullName"
                  placeholder="Họ và Tên"
                  value={FullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Email">Email</label>
                <input
                  type="email"
                  id="Email"
                  placeholder="Email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="PasswordHash">Mật khẩu</label>
                <input
                  type="password"
                  id="PasswordHash"
                  placeholder="Mật khẩu"
                  value={PasswordHash}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="register-button">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Register;
