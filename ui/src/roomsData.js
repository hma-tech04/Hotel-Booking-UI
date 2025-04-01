// roomsData.js

const roomsData = [
  {
    RoomId: 1,
    RoomType: "Superior Single Room",
    Price: 129.00,
    Description: "Phòng đơn Superior mang đến sự thoải mái tối đa cho một người. Với không gian rộng rãi, phòng được trang bị đầy đủ tiện nghi hiện đại, bao gồm giường đơn thoải mái, bàn làm việc, tivi màn hình phẳng và Wi-Fi miễn phí. Cửa sổ lớn cho phép bạn tận hưởng không gian sáng sủa và tầm nhìn đẹp ra thành phố, rất phù hợp cho những ai tìm kiếm một nơi nghỉ ngơi yên tĩnh và tiện nghi sau một ngày dài làm việc.",
    ThumbnailUrl: "/images/r1.jpg",
    IsAvailable: true,
    RoomImages: ["/images/r1.jpg", "/images/r1-1.jpg", "/images/r1-2.jpg"]
  },
  {
    RoomId: 2,
    RoomType: "Deluxe Double Room",
    Price: 199.00,
    Description: "Phòng Deluxe Double mang lại không gian thoải mái cho hai người với giường đôi rộng rãi, không gian được trang trí tinh tế với nội thất cao cấp. Phòng có đầy đủ tiện nghi như tivi LCD, minibar, máy lạnh và Wi-Fi miễn phí. Các cửa sổ lớn giúp bạn có thể ngắm nhìn cảnh quan xung quanh, tạo cảm giác thư giãn tuyệt vời. Phòng cũng có khu vực làm việc riêng biệt và một không gian lý tưởng cho các cặp đôi hoặc gia đình nhỏ.",
    ThumbnailUrl: "/images/r2.jpg",
    IsAvailable: false,
    RoomImages: ["/images/r2.jpg", "/images/r2-1.jpg", "/images/r2-2.jpg"]
  },
  {
    RoomId: 3,
    RoomType: "Executive Suite",
    Price: 299.00,
    Description: "Phòng Executive Suite là lựa chọn hoàn hảo cho những ai muốn trải nghiệm sự sang trọng và tiện nghi đỉnh cao. Phòng được thiết kế rộng rãi với giường cỡ King, không gian sống tiện nghi, có phòng khách riêng biệt, bàn làm việc cao cấp và các thiết bị hiện đại. Phòng cũng có cửa sổ lớn với tầm nhìn tuyệt đẹp ra thành phố hoặc biển. Đặc biệt, các tiện nghi cao cấp như bồn tắm massage, minibar, máy pha cà phê, và dịch vụ phòng 24/7 sẽ giúp bạn có một kỳ nghỉ không thể quên.",
    ThumbnailUrl: "/images/r3.jpg",
    IsAvailable: true,
    RoomImages: ["/images/r3.jpg", "/images/r3-1.jpg", "/images/r3-2.jpg"]
  }
];

export default roomsData;
