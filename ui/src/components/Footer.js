import React from "react";

function Footer() {
  return (
    <footer>
      <div className="container grid top">
        <div className="box">
          <h3>Về chúng tôi</h3>
          <ul>
            <li>
                Sochi Hotel, một phần của tập đoàn <strong>79 Group</strong>,
                mang đến những dịch vụ chất lượng cao tại trung tâm Thành phố Hồ
                Chí Minh. Chúng tôi cam kết mang lại trải nghiệm hoàn hảo cho
                khách hàng với các tiện nghi sang trọng và dịch vụ chuyên
                nghiệp.
            </li>
            <li>
              Phương thức thanh toán được chấp nhận
            </li>
          </ul>
          <div className="payment grid">
            <img
              src="https://img.icons8.com/color/48/000000/visa.png"
              alt="Visa"
            />
            <img
              src="https://img.icons8.com/color/48/000000/mastercard.png"
              alt="Mastercard"
            />
            <img
              src="https://img.icons8.com/color-glass/48/000000/paypal.png"
              alt="Paypal"
            />
            <img
              src="https://img.icons8.com/fluency/48/000000/amex.png"
              alt="Amex"
            />
          </div>
        </div>
        <div className="box">
          <h3>Dành cho khách hàng</h3>
          <ul>
            <li>Về Sochi Hotel</li>
            <li>Chăm sóc khách hàng / Hỗ trợ</li>
            <li>Tài khoản doanh nghiệp</li>
            <li>Thông tin tài chính</li>
            <li>Điều khoản và Điều kiện</li>
          </ul>
        </div>
        <div className="box">
          <h3>Liên hệ với chúng tôi</h3>
          <ul>
            <li>3015 Đại lộ Nguyễn Huệ, Quận 1, TP.HCM</li>
            <li>
              <i className="far fa-envelope"></i> info@sochihotel.vn
            </li>
            <li>
              <i className="far fa-phone-alt"></i> 028 123 456 789
            </li>
            <li>
              <i className="far fa-phone-alt"></i> 028 987 654 321
            </li>
            <li>
              <i className="far fa-comments"></i> Dịch vụ khách hàng 24/7
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
