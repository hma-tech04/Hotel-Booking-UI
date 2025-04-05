import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';
import '../styles/resetpassword.css';

const API_URL = 'http://localhost:5053';

function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [timer, setTimer] = useState(300);
  const navigate = useNavigate();

  useEffect(() => {
    let countdown;
    if (step === 2 && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [step, timer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }), // Sửa "Email" thành "email"
      });
      const result = await response.json();
      if (result.errorCode !== 'OK') throw new Error(result.message || 'Gửi OTP thất bại');
      setStep(2);
      setTimer(300);
    } catch (error) {
      alert(error.message || 'Có lỗi khi gửi OTP!');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (timer <= 0) {
      alert('OTP đã hết hạn! Vui lòng gửi lại.');
      setStep(1);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, OTP: otp }),
      });
      const result = await response.json();
      if (result.errorCode !== 'OK') throw new Error(result.message || 'OTP không đúng hoặc đã hết hạn');
      localStorage.setItem('resetToken', result.data.token);
      setStep(3);
    } catch (error) {
      alert(error.message || 'Có lỗi khi xác thực OTP!');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    try {
      const token = localStorage.getItem('resetToken');
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ NewPassword: newPassword }),
      });
      const result = await response.json();
      if (result.errorCode !== 'OK') throw new Error(result.message || 'Cập nhật mật khẩu thất bại');
      alert('Mật khẩu đã được cập nhật!');
      localStorage.removeItem('resetToken');
      navigate('/login');
    } catch (error) {
      alert(error.message || 'Có lỗi khi cập nhật mật khẩu!');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="reset-password-container">
      {step === 1 && (
        <div className="reset-password-box">
          <h2>Khôi phục mật khẩu</h2>
          <form onSubmit={handleEmailSubmit}>
            <div>
              <label>Nhập Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Gửi mã OTP</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="reset-password-box">
          <h2>Nhập mã OTP</h2>
          <p className="otp-timer">Còn lại: {formatTime(timer)}</p>
          <form onSubmit={handleOtpSubmit}>
            <div>
              <label>Mã OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={timer <= 0}>
              Xác nhận OTP
            </button>
            {timer <= 0 && (
              <button onClick={() => setStep(1)}>Gửi lại OTP</button>
            )}
          </form>
        </div>
      )}
      {step === 3 && (
        <div className="reset-password-box">
          <h2>Đặt lại mật khẩu mới</h2>
          <form onSubmit={handleResetPassword}>
            <div>
              <label>Mật khẩu mới:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Xác nhận mật khẩu mới:</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Đặt lại mật khẩu</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;