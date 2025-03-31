// src/pages/ResetPassword.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/style.css';

function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Gọi API /api/auth/forgot-password để gửi OTP qua email
    console.log("Gửi OTP đến:", email);
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Xác thực OTP
    console.log("OTP:", otp);
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if(newPassword !== confirmNewPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    // Gọi API /api/auth/reset-password với OTP và mật khẩu mới
    console.log("Reset password cho:", email);
  };

  return (
    <>
      <Header />
      <div className="reset-password-container">
        {step === 1 && (
          <>
            <h2>Khôi phục mật khẩu</h2>
            <form onSubmit={handleEmailSubmit}>
              <div>
                <label>Nhập Email:</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
              </div>
              <button type="submit">Gửi mã OTP</button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Nhập mã OTP</h2>
            <form onSubmit={handleOtpSubmit}>
              <div>
                <label>Mã OTP:</label>
                <input type="text" value={otp} onChange={(e)=>setOtp(e.target.value)} required />
              </div>
              <button type="submit">Xác nhận OTP</button>
            </form>
          </>
        )}
        {step === 3 && (
          <>
            <h2>Đặt lại mật khẩu mới</h2>
            <form onSubmit={handleResetPassword}>
              <div>
                <label>Mật khẩu mới:</label>
                <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required />
              </div>
              <div>
                <label>Xác nhận mật khẩu mới:</label>
                <input type="password" value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)} required />
              </div>
              <button type="submit">Đặt lại mật khẩu</button>
            </form>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;
