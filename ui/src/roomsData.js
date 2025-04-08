import home1 from './images/home1.jpg';
import home2 from './images/home2.jpg';
import home3 from './images/home3.jpg';
import home4 from './images/home4.jpg';
import g1 from './images/g1.jpg';
import g2 from './images/g2.jpg';
import g3 from './images/g3.jpg';
import g4 from './images/g4.jpg';
import r1 from './images/r1.jpg';
import r2 from './images/r2.jpg';
import r3 from './images/r3.jpg';
import w1 from './images/w1.jpg';

const roomsData = [
  {
    RoomId: 1,
    RoomType: "Superior Single Room",
    ThumbnailUrl: home1,
    Images: [home1, home2, home3, home4],
    Price: 129,
    FullDescription:
      "Phòng đơn Superior mang đến sự thoải mái tối đa cho một người. Với không gian rộng rãi, phòng được trang bị đầy đủ tiện nghi hiện đại, bao gồm giường đơn lớn, bàn làm việc, tivi màn hình phẳng và Wi-Fi miễn phí. Cửa sổ lớn cho phép bạn hướng nhìn không gian sáng sủa và ấm áp, rất phù hợp để nghỉ ngơi và làm việc sau một ngày dài.",
    Area: 250,
    BedType: "Single Bed",
    MaxOccupancy: 1,
    Amenities: ["Wi-Fi miễn phí", "Điều hòa", "Minibar", "TV màn hình phẳng"],
    CancellationPolicy: "Chính sách hủy linh hoạt với thông báo trước 24 giờ",
  },
  {
    RoomId: 2,
    RoomType: "Deluxe Double Room",
    ThumbnailUrl: g1,
    Images: [g1, g2, g3, g4],
    Price: 199,
    FullDescription:
      "Phòng Deluxe Double mang đến không gian sang trọng cho cặp đôi. Phòng được trang bị giường đôi lớn, khu vực tiếp khách, và ban công riêng với tầm nhìn tuyệt đẹp. Tiện nghi hiện đại bao gồm Wi-Fi miễn phí, điều hòa, và minibar.",
    Area: 350,
    BedType: "Double Bed",
    MaxOccupancy: 2,
    Amenities: ["Wi-Fi miễn phí", "Điều hòa", "Minibar", "Ban công"],
    CancellationPolicy: "Hủy miễn phí trước 48 giờ",
  },
  {
    RoomId: 3,
    RoomType: "Suite Room",
    ThumbnailUrl: r1,
    Images: [r1, r2, r3, w1], // Thay r4.jpg bằng w1.jpg
    Price: 299,
    FullDescription:
      "Phòng Suite là lựa chọn hoàn hảo cho những ai tìm kiếm sự xa hoa. Với phòng khách riêng, phòng ngủ chính, và phòng tắm rộng rãi có bồn tắm, phòng Suite mang đến trải nghiệm nghỉ dưỡng đẳng cấp. Tiện nghi bao gồm Wi-Fi miễn phí, TV màn hình phẳng, và dịch vụ phòng 24/7.",
    Area: 500,
    BedType: "King Bed",
    MaxOccupancy: 3,
    Amenities: ["Wi-Fi miễn phí", "TV màn hình phẳng", "Bồn tắm", "Dịch vụ phòng 24/7"],
    CancellationPolicy: "Hủy miễn phí trước 72 giờ",
  },
];

export default roomsData;