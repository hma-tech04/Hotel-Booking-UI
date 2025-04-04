import React, { useState, useEffect } from 'react';
import BookingSearch from '../components/BookingSearch';
import RoomList from '../components/RoomList';  // Import RoomList
import '../styles/style.css';

function Home() {
  // State quản lý slide hình ảnh
  const [currentSlide, setCurrentSlide] = useState("/images/home1.jpg");

  // State kiểm tra người dùng đã đăng nhập hay chưa
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu token đăng nhập có trong localStorage
    if (localStorage.getItem('userToken')) {
      setIsLoggedIn(true);  // Người dùng đã đăng nhập
    } else {
      setIsLoggedIn(false); // Người dùng chưa đăng nhập
    }
  }, []); // Chạy khi component lần đầu tiên được render

  const handleSlideClick = (src) => setCurrentSlide(src);

  return (
    <>
      {/* Banner Section */}
      <section className="home" id="home">
        <div className="head_container">
          <div className="box">
            <div className="text">
              <h1>Sochi Hotel</h1>
              <p>
                Sochi Hotel, tọa lạc tại trung tâm Thành phố Hồ Chí Minh, là một phần của tập đoàn uy tín 79 Group. Chúng tôi cung cấp dịch vụ lưu trú sang trọng và các dịch vụ đẳng cấp thế giới để đảm bảo rằng kỳ nghỉ của bạn sẽ là một trải nghiệm khó quên.
              </p>
            </div>
          </div>
          <div className="image">
            <img src={currentSlide} alt="Sochi Hotel" className="slide" />
          </div>
          <div className="image_item">
            {['/images/home1.jpg', '/images/home2.jpg', '/images/home3.jpg', '/images/home4.jpg'].map((imageSrc, index) => (
              <img
                key={index}
                src={imageSrc}
                alt={`Slide ${index + 1}`}
                className={`slide ${currentSlide === imageSrc ? 'active' : ''}`}
                onClick={() => handleSlideClick(imageSrc)}
              />
            ))}
          </div>
        </div>
      </section>

          <BookingSearch />

      <RoomList /> 
    </>
  );
}

export default Home;
