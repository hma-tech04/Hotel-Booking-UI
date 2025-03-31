import React, { useState } from 'react';

const accordionData = [
  { title: "Món Ăn Việt Nam", content: "Khám phá các món ăn đặc trưng của Việt Nam như phở, bún bò, bánh xèo, mang đến hương vị đậm đà và thơm ngon. Tất cả được chế biến từ nguyên liệu tươi ngon, chất lượng.", open: true },
  { title: "Món Ăn Á Đông", content: "Những món ăn phong phú từ các nước Đông Nam Á như Thái Lan, Malaysia, Singapore với các món như cơm chiên, mì xào, và các món hải sản tươi ngon.", open: false },
  { title: "Món Ăn Châu Âu", content: "Khám phá ẩm thực Châu Âu với các món ăn tinh tế như pasta, pizza, các món thịt nướng và nhiều món ăn đặc trưng khác từ Ý, Pháp và các quốc gia Châu Âu khác.", open: false },
  { title: "Món Ăn Chay", content: "Với những ai yêu thích ăn chay, chúng tôi cung cấp một thực đơn phong phú với các món ăn chay đầy dinh dưỡng và hương vị, từ các món xào, canh, đến các món tráng miệng.", open: false },
];

function RestaurantAccordion() {
  const [items, setItems] = useState(accordionData);

  const toggleItem = (index) => {
    setItems(items.map((item, i) => ({
      ...item,
      open: i === index ? !item.open : false,
    })));
  };

  return (
    <div className="accordionWrapper">
      {items.map((item, index) => (
        <div key={index} className={`accordionItem ${item.open ? "open" : "close"}`}>
          <h2 className="accordionIHeading" onClick={() => toggleItem(index)}>
            {item.title}
          </h2>
          <div className="accordionItemContent">
            <p>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RestaurantAccordion;
