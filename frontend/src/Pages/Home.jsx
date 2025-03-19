import React from "react";
import { Galleria } from "primereact/galleria";
import { Card } from "primereact/card";
import "primeflex/primeflex.css";
import useFetchData from "../Hooks/useFetchData";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleServiceClick = (index) => {
    if (index === 0) {
      navigate("/automatic");
    } else if (index === 1) {
      navigate("/repair");
    }
  };
  // 1) เรียก API ให้ส่งสินค้าสุ่ม 8 รายการ
  const { data: randomProducts, isLoading: productsLoading } = useFetchData(
    `${process.env.REACT_APP_API}/api/products/random?count=4`
  );

  // 2) ตัวอย่าง mock data อื่น ๆ จากไฟล์ local
  const { data: slideshowImages, isLoading: slideshowLoading } = useFetchData(
    "/mockData/slideshow_images.json"
  );
  const { data: featuredProducts, isLoading: featuredLoading } = useFetchData(
    "/mockData/featured_products.json"
  );

  // template สำหรับ Galleria (สไลด์โชว์)
  const itemTemplate = (item) => {
    return (
      <img
        src={item.image}
        alt={item.title}
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "600px",
          objectFit: "cover",
          display: "block",
          borderRadius: "10px",
        }}
      />
    );
  };

  // ถ้าข้อมูล (slideshow, products, featured) ยังไม่โหลด
  if (slideshowLoading || productsLoading || featuredLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ paddingTop: "60px" }}>
      <div style={{ width: "90%", maxWidth: "1400px", margin: "auto" }}>
        {/* สไลด์โชว์ */}
        <Galleria
          value={slideshowImages}
          numVisible={4}
          circular
          showItemNavigators
          showItemNavigatorsOnHover
          showIndicators
          showThumbnails={false}
          item={itemTemplate}
        />

        {/* สินค้าแนะนำ (mock data) */}
        <h2>บริการของเรา</h2>
        <div className="flex gap-5 justify-content-center flex-wrap">
          {featuredProducts.map((image, index) => (
            <img
              key={index}
              src={image.image}
              alt={image.title}
              style={{
                width: "100%",
                maxHeight: "360px",
                maxWidth: "680px",
                objectFit: "cover",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => handleServiceClick(index)}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ))}
        </div>

        {/* สินค้ายอดนิยม (ดึง 8 ชิ้นจาก Backend) */}
        <h2 className="mt-4">สินค้าภายในร้าน</h2>
        <div className="grid mt-3">
          {randomProducts.map((product) => (
            <div
              key={product.id}
              className="col-12 md:col-6 lg:col-3"
              onClick={() => navigate(`/productAuto/${product.id}`)}
            >
              <Card
                title={product.name}
                // subTitle={product.description}
                style={{
                  marginBottom: "1rem",
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.2s"
                }}
                header={
                  <img
                    alt={product.name}
                    src={
                      product.images && product.images.length > 0
                        ? `${process.env.REACT_APP_API}${product.images[0]}`
                        : "https://via.placeholder.com/300"
                    }
                    style={{
                      width: "300px", // กำหนดความกว้างตายตัว
                      height: "300px", // กำหนดความสูงตายตัว
                      objectFit: "cover", // ตัดรูปให้เต็มกรอบแบบไม่เสียอัตราส่วน
                      borderRadius: "10px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                }
                footer={
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {product.price
                      ? `${Number(product.price).toLocaleString()} บาท`
                      : "ไม่มีข้อมูลราคา"}
                  </span>
                }
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
