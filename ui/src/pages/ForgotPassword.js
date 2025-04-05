import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forgot-password.css';

const API_URL = 'http://localhost:5053';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(300);
  const navigate = useNavigate();

  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => setTimer((prevTime) => prevTime - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  const handleSendEmail = async () => {
    try {
      console.log('Sending OTP to:', email);
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });
      if (!response.ok) throw new Error('Gửi OTP thất bại');
      const result = await response.json();
      console.log('API response (forgot-password):', result);
      if (result.code === 200) {
        setOtpSent(true);
        setTimer(300);
      } else {
        throw new Error(result.message || 'Gửi OTP thất bại');
      }
    } catch (error) {
      console.error('Error in handleSendEmail:', error);
      alert(error.message || 'Có lỗi xảy ra khi gửi OTP!');
    }
  };

  const handleVerifyOtp = async () => {
    if (timer <= 0) {
      alert('OTP đã hết hạn! Vui lòng gửi lại.');
      return;
    }
    try {
      console.log('Verifying OTP:', otp, 'for email:', email);
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, OTP: otp }),
      });
      const result = await response.json();
      console.log('API response (verify-otp):', result);
      if (result.code === 200) {
        localStorage.setItem('resetToken', result.data.token);
        setIsOtpVerified(true);
      } else {
        throw new Error(result.message || 'OTP không đúng hoặc đã hết hạn');
      }
    } catch (error) {
      console.error('Error in handleVerifyOtp:', error);
      alert(error.message || 'Có lỗi xảy ra khi xác thực OTP!');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    try {
      const token = localStorage.getItem('resetToken');
      console.log('Resetting password with token:', token);
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ NewPassword: newPassword }),
      });
      const result = await response.json();
      console.log('API response (reset-password):', result);
      if (result.code === 200) {
        alert('Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.');
        localStorage.removeItem('resetToken');
        navigate('/login');
      } else {
        throw new Error(result.message || 'Cập nhật mật khẩu thất bại');
      }
    } catch (error) {
      console.error('Error in handleResetPassword:', error);
      alert(error.message || 'Có lỗi xảy ra khi cập nhật mật khẩu!');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Quên Mật Khẩu</h2>
        <p>Nhập email của bạn để nhận mã OTP.</p>
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {!otpSent && <button onClick={handleSendEmail}>Gửi OTP</button>}
        {otpSent && !isOtpVerified && (
          <>
            <p>Nhập mã OTP (Còn {formatTime(timer)})</p>
            <input
              type="text"
              placeholder="Nhập OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button onClick={handleVerifyOtp} disabled={timer <= 0}>
              Xác Thực OTP
            </button>
            {timer <= 0 && <button onClick={handleSendEmail}>Gửi Lại OTP</button>}
          </>
        )}
        {isOtpVerified && (
          <>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button onClick={handleResetPassword}>Cập Nhật Mật Khẩu</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;