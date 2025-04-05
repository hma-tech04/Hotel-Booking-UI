// src/pages/Home.js
import React, { useState } from 'react';
import BookingSearch from '../components/BookingSearch';
import RoomList from '../components/RoomList';
import '../styles/style.css';

function Home() {
  const [currentSlide, setCurrentSlide] = useState("/images/home1.jpg");
  const [searchResults, setSearchResults] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);

  const handleSlideClick = (src) => setCurrentSlide(src);

  const handleSearch = (results, formData) => {
    setSearchResults(results);
    setSearchCriteria(formData);
  };

  return (
    <>
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
            <img 
              src="/images/home1.jpg" 
              alt="Slide 1" 
              className={`slide ${currentSlide === "/images/home1.jpg" ? "active" : ""}`} 
              onClick={() => handleSlideClick("/images/home1.jpg")} 
            />
            <img 
              src="/images/home2.jpg" 
              alt="Slide 2" 
              className={`slide ${currentSlide === "/images/home2.jpg" ? "active" : ""}`} 
              onClick={() => handleSlideClick("/images/home2.jpg")} 
            />
            <img 
              src="/images/home3.jpg" 
              alt="Slide 3" 
              className={`slide ${currentSlide === "/images/home3.jpg" ? "active" : ""}`} 
              onClick={() => handleSlideClick("/images/home3.jpg")} 
            />
            <img 
              src="/images/home4.jpg" 
              alt="Slide 4" 
              className={`slide ${currentSlide === "/images/home4.jpg" ? "active" : ""}`} 
              onClick={() => handleSlideClick("/images/home4.jpg")} 
            />
          </div>
        </div>
      </section>

      <BookingSearch onSearch={handleSearch} />
      <RoomList searchResults={searchResults} searchCriteria={searchCriteria} />
    </>
  );
}

export default Home;