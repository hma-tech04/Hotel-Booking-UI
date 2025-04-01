import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forgot-password.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(120); // 2 phút
  const navigate = useNavigate();

  // Bắt đầu đếm ngược khi gửi OTP
  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  // Gửi OTP
  const handleSendEmail = () => {
    console.log('Gửi OTP đến:', email);
    setOtpSent(true);
    setTimer(120); // Reset thời gian
  };

  // Xác thực OTP
  const handleVerifyOtp = () => {
    if (timer <= 0) {
      alert('OTP đã hết hạn! Vui lòng gửi lại.');
      return;
    }
    if (otp === '123456') {
      alert('Xác thực OTP thành công!');
      setIsOtpVerified(true); // Cho phép nhập mật khẩu mới
    } else {
      alert('OTP không đúng!');
    }
  };

  // Cập nhật mật khẩu mới
  const handleResetPassword = () => {
    if (newPassword === confirmPassword) {
      alert('Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.');
      navigate('/login');
    } else {
      alert('Mật khẩu không khớp!');
    }
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

        {/* Khi đã gửi OTP thì hiện ô nhập OTP bên dưới */}
        {otpSent && !isOtpVerified && (
          <>
            <p>Nhập mã OTP (Còn {timer}s)</p>
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

        {/* Chỉ hiện ô nhập mật khẩu khi OTP đã xác thực */}
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