import React, { useState } from "react";
import "../styles/register.css"; // Import file CSS mới
import Footer from "../components/Footer";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Sửa ở đây
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("❌ Mật khẩu không khớp!");
      return;
    }
    setError(""); // Xóa lỗi nếu có

    console.log("Đăng ký:", {
      fullName,
      email,
      password,
      phoneNumber,
    });

    // Gửi request API đăng ký ở đây...
  };

  return (
    <div className="page-container">
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Đăng ký</h2>

          {error && <p className="error-message">{error}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Họ và Tên</label>
              <input
                type="text"
                id="fullName"
                placeholder="Họ và Tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                placeholder="Mật khẩu"
                value={password}
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
                onChange={(e) => setConfirmPassword(e.target.value)} // Sửa ở đây
                required
              />
            </div>
            <button type="submit" className="register-button">
              Đăng ký
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;