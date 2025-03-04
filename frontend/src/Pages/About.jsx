import React from "react";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";

const About = () => {
  return (
    <div className="p-6 flex flex-column align-items-center w-full">
      <div className="p-6 w-full max-w-5xl mx-auto justify-center">
        {/* 🔹 หัวข้อ เกี่ยวกับเรา */}
        <h1 className="text-3xl font-bold text-gray-900 text-center">เกี่ยวกับเรา</h1>
        <div className="w-16 border-b-4 border-blue-500 mx-auto mb-4"></div> {/* เส้นคั่นสีฟ้าให้อยู่กลาง */}

        {/* 🔹 ข้อมูลเกี่ยวกับบริษัท */}
        <h2 className="text-2xl font-bold text-blue-800 text-center">
          ดีเดย์ประตูม้วน คือผู้เชี่ยวชาญงานด้านประตูม้วนทุกระบบและประตูโรงงาน
        </h2>
        <p className="text-gray-900 text-lg mt-2 font-medium text-center">
          <span className="font-bold">เราติดตั้งประตูม้วนได้ทุกรูปแบบที่ลูกค้าต้องการ</span> เช่น
          ประตูม้วนไฟฟ้า-รีโมท ประตูม้วนรถโกดัง ประตูม้วนมือดึง และรับทำประตูโรงงานแบบอัตโนมัติ
          ราคาไม่แพง ฝีมือติดตั้งประณีตรับประกันผลงาน ทั้งประตูม้วนโรงงาน ประตูม้วนคลังสินค้า-โกดัง
          ประตูม้วนตึกแถวร้านค้า-โชว์รูม-ศูนย์บริการ ประตูม้วนแผงขายของในตลาดและศูนย์การค้า
        </p>

        {/* 🔹 5 เหตุผลหลัก */}
        <div className=" items-center justify-center mt-6 w-full">
          {/* 🔹 หัวข้ออยู่ตรงกลาง */}
          <h2 className="text-2xl font-bold text-blue-800 text-center">
            5 เหตุผลหลัก สำหรับบริการติดตั้งประตูม้วนที่ดีจาก ดีเดย์
          </h2>

          {/* 🔹 ลิสต์ให้อยู่ตรงกลางแนวเดียวกับหัวข้อ */}
          <div className="text-lg text-center font-medium">
            <p>1. เราเป็นประตูม้วนหลายแบบให้ลูกค้าเลือกเพื่อตอบโจทย์ความต้องการและงบประมาณในราคายุติธรรม</p>
            <p>2. เราเลือกใช้มอเตอร์และวัสดุอุปกรณ์คุณภาพสูงระดับพรีเมียม คำนึงถึงการใช้งานได้อย่างคงทนและปลอดภัย</p>
            <p>3. เรามีทีมช่างผู้เชี่ยวชาญที่ติดตั้งด้วยมาตรฐานสูง ทำให้เปิด-ปิดประตูม้วนได้ราบรื่นและสะดวก</p>
            <p>4. การติดตั้งประตูม้วนของเรา มีความประณีตโดยช่างมืออาชีพ ทำเสร็จจริงไม่ทิ้งงานและส่งมอบคุณภาพดีเยี่ยม</p>
            <p>5. เรามีผลงานการติดตั้งที่ผ่านการรับรองคุณภาพสูงระดับอุตสาหกรรม รับประกันคุณภาพนานถึง 10 ปี</p>
          </div>
        </div>
      </div>
      {/* 🔹 รูปโกดังโรงงาน */}
      <div>
        <Image src="/assets/images/About-4.png" alt="Warehouse" className="w-full max-w-4xl rounded-lg mt-6" />
      </div>
      {/* 🔹 สินค้าและบริการ */}
      <Divider className="w-16 border-blue-500 pt-3" />

      <div className="items-center text-center mt-10 w-full max-w-4xl mx-auto">
        {/* 🔹 โลโก้บริษัท */}
        <Image src="/assets/logo.png" alt="ดีเดย์ ประตูม้วน" className="w-32 mb-4" />

        {/* 🔹 หัวข้อหลัก */}
        <h2 className="text-2xl font-bold text-blue-700 leading-snug">
          ประตูม้วนดีมีคุณภาพ ช่างประตูม้วนดีมีฝีมือ ได้ประตูม้วนดีๆ สเปคตรงปกต้อง{" "}
          <span className="text-orange-600">ดีเดย์ประตูม้วน</span>
        </h2>

        {/* 🔹 รายละเอียดบริษัท */}
        <p className="text-gray-900 text-lg mt-3">
          ต้องการติดตั้งประตูม้วน แนะนำช่างประตูม้วนบ่อวิน ชลบุรี{" "}
          <span className="font-bold">หจก. ดีเดย์ ประตูม้วน</span>
          <br />
          ทะเบียนการค้า 0203551006260
        </p>

        {/* 🔹 ข้อมูลติดต่อ */}
        <p className="text-gray-900 text-lg mt-3">ติดต่อได้ทุกวัน</p>
        <p className="text-blue-900 font-bold text-xl mt-1">
          โทร : 08-3015-1893 , 08-6033-5224
        </p>
      </div>

      <Divider className="w-16 border-blue-500 pt-3" />

      <div className="w-full max-w-4xl mx-auto mt-10 text-center">
        {/* 🔹 หัวข้อหลัก */}
        <h1 className="text-3xl font-bold text-gray-900">สินค้าและบริการ</h1>
        <div className="w-16 border-b-4 border-blue-500 mb-4"></div> {/* เส้นคั่นสีน้ำเงิน */}

        {/* 🔹 หัวข้อย่อย + คำอธิบาย */}
        <h2 className="text-xl font-bold text-blue-700">
          จำหน่ายและรับติดตั้งประตูเหล็กม้วน ประตูม้วนสแตนเลส
        </h2>
        <p className="text-gray-900 text-lg font-medium mt-2">
          โรลเลอร์ชัตเตอร์ Roller Shutter ทุกระบบทุกขนาด-ใหญ่แค่ไหนเราทำได้
          ทั้งแบบทึบ แบบโปร่ง แบบครึ่งโปร่งครึ่งทึบ บริการด่วนๆ ในพื้นที่ศรีราชา ชลบุรี ปลวกแดง ระยอง
        </p>

        {/* 🔹 ลิสต์สินค้า */}
        <ul className="text-gray-900 text-lg mt-4 space-y-2 list-disc list-inside">
          <p>1. ประตูม้วนแบบมือดึง หรือแบบสปริง ทั้งประตูเหล็กม้วนและประตูม้วนสแตนเลส</p>
          <p>2. ประตูม้วนแบบรถโกดัง</p>
          <p>3. ประตูม้วนไฟฟ้าเปิดปิดด้วยรีโมท หรือประตูม้วนอัตโนมัติ</p>
        </ul>
      </div>
      <div className="pt-5">
        <Image src="/assets/images/About-1.png" alt="Installation" className="w-full max-w-4xl rounded-lg mt-4" />
      </div>

      <Divider className="w-16 border-blue-500 pt-3" />


      <div className="pt-5">
        <Image src="/assets/images/About-2.png" alt="Installation" className="w-full max-w-4xl rounded-lg mt-4" />
      </div>

      <Divider className="w-16 border-blue-500 pt-3" />


      <div className="w-full max-w-4xl mx-auto mt-10 text-center">
        {/* 🔹 หัวข้อหลัก */}
        <h2 className="text-2xl font-bold text-blue-800">
          จำหน่ายอะไหล่ประตูม้วนอัตโนมัติ อะไหล่ประตูม้วนไฟฟ้า
        </h2>

        {/* 🔹 ลิสต์บริการซ่อม */}
        <ul className="text-gray-900 text-lg mt-4 space-y-2 list-disc list-inside">
          <p>1. ขายกล่องประตูม้วน</p>
          <p>2. ขายมอเตอร์ประตูม้วนทุกรุ่น สินค้าใหม่มีรับประกัน</p>
          <p>3. ขายชิ้นส่วนอะไหล่ประตูม้วนทุกระบบต้องการใช้อะไหล่ชิ้นไหนสอบถามได้</p>
        </ul>
      </div>

      <div className="pt-5">
        <Image src="/assets/images/About-3.png" alt="Installation" className="w-full max-w-4xl rounded-lg mt-4" />
      </div>

      <div className="w-full max-w-4xl mx-auto mt-10 text-center">
        {/* 🔹 กล่องข้อความอธิบาย */}
        <div className="flex items-start border-l-4 border-gray-300 pl-4 text-gray-900 text-lg font-medium">
          <p>
            เพราะเราเลือกใช้วัสดุดีมีคุณภาพ ใช้งานได้ทนทาน ติดตั้งโดยช่างทำประตูฝีมือดีที่มีประสบการณ์ประตูม้วนมากกว่า 20 ปี
            งานติดตั้งคุณภาพทำเสร็จจริงไม่ทิ้งงาน เก็บงานเรียบร้อย รับผิดชอบทุกผลงาน ส่งมอบงานตรงเวลา ในราคาไม่แพง
          </p>
        </div>

        {/* 🔹 หัวข้อพื้นที่ให้บริการ */}
        <p className="text-red-600 font-bold text-lg mt-6">
          ให้บริการลูกค้าผ่าน
          <span className="text-gray-900 font-medium">
            {" "}บ่อวิน, ปากร่วม, นิคมอุตสาหกรรม WHA บ่อวิน, เหมราช, อีสเทิร์นซีบอร์ด, หนองคล้าใหม่,
            ตำบลสิง, สุรศักดิ์, นิคมแหลมฉบัง, สวนอุตสาหกรรมสหพัฒน์, ทุ่งสุขลา, หนองขาม, นิคมอุตสาหกรรมปิ่นทอง,
            เขาคันทรง, มาเมียง, บางพระ, ถนนสาย 331, สาย 7, สาย 36, มอเตอร์เวย์, ศรีราชา ชลบุรี, โรจนะ,
            หนองปลาไหล, หนองปรือ, บางละมุง,โป่ง, เขาไม้แก้ว, ห้วยใหญ่, ตะเคียนเตี้ย, นาเกลือ, นิคมมาบตาพุด,
            มาบยางพร, ห้วยปราบ, ปลวกแดง, ระยอง
          </span>
        </p>

        {/* 🔹 เบอร์โทรติดต่อ */}
        <p className="text-orange-600 font-bold text-2xl mt-6">
          โทรเลย... <span className="text-blue-900">083-015-1893, 086-033-5224</span>
        </p>
      </div>

    </div>
  );
};

export default About;
