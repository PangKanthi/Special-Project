import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from "primereact/divider";
import background from "../assets/images/background.png";
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '50px',
          paddingBottom: '50px',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          color: 'white',
        }}
      >
        <div
          className="lg:pl-8 lg:pr-8"
          style={{
            width: '100%',
            maxWidth: '1800px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '10px',
            padding: '40px',
            boxSizing: 'border-box',
          }}
        >
          <h1 className="text-center text-3xl lg:text-4xl xl:text-5xl">
            ดีเดย์ประตูม้วน คือผู้เชี่ยวชาญงานด้านประตูม้วนทุกระบบและประตูรั้วโรงงาน
          </h1>
          <div className="text-center lg:pl-8 lg:pr-8 pt-2">
            <div className="lg:pl-8 lg:pr-8">
              <p className="text-xl lg:text-2xl">
                เราติดตั้งประตูม้วนได้ทุกรูปแบบที่ลูกค้าต้องการ เช่น ประตูม้วนไฟฟ้า-รีโมท
                ประตูม้วนรอกโซ่ ประตูม้วนมือดึง และรับทำประตูรั้วโรงงานแบบอัตโนมัติ
                ราคาไม่แพง ฝีมือติดตั้งประณีตรับประกันผลงานทั้งประตูม้วนโรงงาน
                ประตูม้วนคลังสินค้า-โกดัง ประตูม้วนตึกแถวร้านค้า-โชว์รูม-ศูนย์บริการ
                ประตูม้วนแผงขายของในตลาดและศูนย์การค้า
              </p>
              <Link to="/contact">
                <Button
                  label="ติดต่อเรา"
                  style={{
                    backgroundColor: 'white',
                    color: '#000000',
                    borderRadius: '25px',
                    border: '2px solid #ffffff',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    marginTop: '20px',
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex pl-8 pr-8 pt-8">
        <div className="lg:w-1/2 lg:pl-8 lg:pr-8">
          <h2 className="text-2xl font-semibold mb-4">
            5 เหตุผลหลัก สำหรับบริการติดตั้งประตูม้วนที่ดีจาก ดีเดย์
          </h2>
          <p className="mb-4">
            1. เรามีแบบประตูม้วนหลายแบบให้ลูกค้าเลือกเพื่อตอบโจทย์ความต้องการและงบประมาณในราคายุติธรรม
          </p>
          <p className="mb-4">
            2. เราเลือกใช้อุปกรณ์และวัสดุอย่างดีมีคุณภาพได้มาตรฐานในการติดตั้งประตูม้วน คำนึงถึงการใช้งานได้อย่างคงทนและปลอดภัย
          </p>
          <p className="mb-4">
            3. เรามีทีมช่างติดตั้งประตูม้วนที่มีฝีมือดีเยี่ยมและเครื่องมือพร้อม การติดตั้งเน้นความปราณีตได้ฉากทำให้เปิด-ปิดประตูได้ราบรื่นไม่สะดุด
          </p>
          <p className="mb-4">
            4. การติดตั้งประตูม้วน สามารถนัดนอกเวลาทำการของโรงงานเพื่อไม่รบกวนเวลาปฏิบัติหน้าที่ของพนักงาน ทำเสร็จจริงไม่ทิ้งงานและส่งงานคุณภาพตรงเวลา
          </p>
          <p className="mb-4">
            5. เรามีผลงานการติดตั้งที่เชื่อถือได้จากลูกค้าชลบุรี ระยอง ยืนหยัดด้วยคุณธรรม ซื่อสัตย์ต่อลูกค้ามานานนับ 10ปี
          </p>
        </div>

        <div className="lg:w-1/2 pt-6">
          <img
            src="/assets/images/About-4.png"
            alt="Warehouse"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
      </div>

      <div className="pl-8 pr-8">
        <Divider className="my-6 w-16 border-blue-500 mx-auto" />
        <div className="flex justify-content-center">
          <img src="../assets/logo.png" alt="Company Logo" style={{ width: "150px" }} />
        </div>
        <div className="text-center">
          <h2>
            ประตูม้วนดีมีคุณภาพ ช่างประตูม้วนดีมีฝีมือ ได้ประตูม้วนดีๆ สเปคตรงปกต้อง ดีเดย์ประตูม้วน
          </h2>
          <p>ต้องการติดตั้งประตูม้วน แนะนำช่างประตูม้วนบ่อวิน ชลบุรี หจก. ดีเดย์ ประตูม้วน</p>
          <p>ทะเบียนการค้า 0203551006260</p>
          <p>ติดต่อได้ทุกวัน</p>
          <p>โทร : 08-3015-1893 , 08-6033-5224</p>
        </div>
        <Divider className="my-6 w-16 border-blue-500 mx-auto" />
      </div>

      <div className="pl-8">
        <h1 className="text-3xl">สินค้าและบริการ</h1>
      </div>

      <div className="lg:flex pl-8 pr-8 pt-8">
        <div className="lg:w-1/2 mb-5">
          <img
            src="/assets/images/About-1.png"
            alt="Ware"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
        <div className="lg:w-1/2 lg:pl-8 lg:pr-8">
          <strong className="text-1xl font-semibold">
            จำหน่ายและรับติดตั้งประตูเหล็กม้วน ประตูม้วนสเตนเลส โรลเลอร์ชัตเตอร์
            Roller Shutter ทุกระบบทุกขนาด-ใหญ่แค่ไหนเราทำได้ ทั้งแบบทึบ
            แบบโปร่ง แบบครึ่งโปร่งครึ่งทึบ บริการด่วนๆ ในพื้นที่ศรีราชา ชลบุรี ปลวกแดง ระยอง
          </strong>
          <li className="mb-4 pt-3">
            ประตูม้วนแบบมือดึง หรือแบบสปริง ทั้งประตูเหล็กม้วนและประตูม้วนสแตนเลส
          </li>
          <li className="mb-4">
            ประตูม้วนแบบรอกโซ่
          </li>
          <li className="mb-4">
            ประตูม้วนไฟฟ้าเปิดปิดด้วยรีโมท หรือประตูม้วนอัตโนมัติ
          </li>
        </div>
      </div>

      <div className="lg:pl-8 lg:pr-8">
        <Divider className="my-6 w-16 border-blue-500 mx-auto" />
      </div>

      <div className="lg:flex pl-8 pr-8 pt-8">
        <div className="lg:w-1/2 lg:pl-8 lg:pr-8">
          <h2 className="text-2xl font-semibold mb-4">
            รับซ่อมประตูม้วนทุกระบบ แก้ได้ซ่อมจบทุกปัญหาโดยช่างซ่อมประตูม้วน ศรีราชา รับประกันงานซ่อม
          </h2>
          <li className="mb-4">
            แก้ปัญหาประตูม้วน-ประตูรั้วโรงงาน ถูกรถโฟล์กลิฟท์ชนเสียหายเปิดปิดไม่ได้ ประตูม้วนถูกรถชนพังเสียหาย เสียน้อยเราซ่อมได้ เสียหายมากซ่อมไม่คุ้มเปลี่ยนประตูม้วนใหม่ วันเดียวเสร็จ
          </li>
          <li className="mb-4">
            รับซ่อมประตูม้วนอัตโนมัติ ซ่อมมอเตอร์ไฟฟ้าเสีย มอเตอร์ประตูม้วนไม่ทำงาน กดรีโมทประตูขึ้น-ลงไม่ได้ ประตูม้วนค้างปิดไม่ได้
          </li>
          <li className="mb-4">
            รับแก้ปัญหาประตูม้วนเสียงดังรำคาญ ปิดล็อคกุญแจไม่ได้ ติดตั้งประตูม้วนจากที่อื่นมีปัญหาเราแก้ได้
          </li>
          <li className="mb-4">
            รับซ่อมประตูม้วนเสียหาย ถูกทำลายจากการงัดแงะ
          </li>
          <li className="mb-4">
            ซ่อมประตูรั้วอัตโนมัติ ซ่อมประตูรั้วโรงงาน มอเตอร์ขับไม่ทำงาน-มอเตอร์ขับประตูรั้วเสีย
          </li>
          <li className="mb-4">
            รับแปลงประตูม้วนธรรมดาแบบมือดึงเป็นประตูม้วนไฟฟ้า-รีโมท
          </li>
        </div>

        <div className="lg:w-1/2 pt-6">
          <img
            src="/assets/images/About-2.png"
            alt="Warehouse"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
      </div>

      <div className="lg:pl-8 lg:pr-8">
        <Divider className="my-6 w-16 border-blue-500 mx-auto" />
      </div>

      <div className="lg:flex pl-8 pr-8 pt-8">
        <div className="lg:w-1/2 mb-5">
          <img
            src="/assets/images/About-3.png"
            alt="Ware"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
        <div className="lg:w-1/2 lg:pl-8 lg:pr-8">
          <h2 className="text-2xl font-semibold mb-4">
            จำหน่ายอะไหล่ประตูม้วนอัตโนมัติ อะไหล่ประตูม้วนไฟฟ้า
          </h2>
          <li className="mb-4 pt-3">
            ขายกล่องประตูม้วน
          </li>
          <li className="mb-4">
            ขายมอเตอร์ประตูม้วนทุกรุ่น สินค้าใหม่มีรับประกัน
          </li>
          <li className="mb-4">
            ขายชิ้นส่วนอะไหล่ประตูม้วนทุกระบบต้องการใช้อะไหล่ชิ้นไหนสอบถามได้
          </li>
        </div>
      </div>

      <div className="px-4 lg:px-8 pb-8 text-center">
        <Divider className="my-6 w-16 border-blue-500 mx-auto" />
        <div
          className="p-5 md:p-6 bg-white-50 border-1 border-white shadow-2 border-round"
          style={{ maxWidth: "1200px", margin: "auto" }}
        >
          <h2 className="text-2xl lg:text-3xl font-semibold text-blue-900 mb-4 text-center">
            ทำไมต้องเลือกเรา?
          </h2>
          <p className="text-lg leading-8 text-gray-800 mb-3">
            เพราะเราเลือกใช้วัสดุดีมีคุณภาพ ใช้งานได้ทนทาน ติดตั้งโดยช่างผู้ชำนาญงานมากกว่า 20 ปี
          </p>
          <p className="text-lg leading-8 text-gray-800 mb-3">
            เราส่งมอบงานคุณภาพจริง ไม่ทิ้งงาน เก็บรายละเอียดครบ ตรงเวลา ในราคาที่สมเหตุสมผล
          </p>
          <p className="text-lg leading-8 text-gray-800 mb-3">
            ให้บริการครอบคลุมพื้นที่: บ่อวิน, ปากร่วม, WHA บ่อวิน, อีสเทิร์นซีบอร์ด, ศรีราชา, ปลวกแดง, ระยอง และพื้นที่ใกล้เคียงอีกมากมาย
          </p>
          <p className="text-xl font-bold text-blue-700 text-center mt-5">
            📞 โทรเลย: 083-015-1893, 086-033-5224
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
