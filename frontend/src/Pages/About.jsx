import React from "react";
import { Divider } from "primereact/divider";

const About = () => {
  return (
    <div className="w-full">
      {/* ส่วนหัวข้อหลักของหน้า */}
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          เกี่ยวกับเรา
        </h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded"></div>
      </div>

      {/* SECTION 1 */}
      <section className="py-12 px-4 bg-gradient-to-r from-white to-blue-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* รูปภาพ */}
          <div className="md:w-1/2 relative group">
            <img
              src="/assets/images/About-4.png"
              alt="Warehouse"
              className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            {/* ถ้าต้องการ Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg"></div>
          </div>

          {/* ข้อความ */}
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-2xl font-bold text-blue-800">
              ดีเดย์ประตูม้วน คือผู้เชี่ยวชาญงานด้านประตูม้วนทุกระบบและประตูโรงงาน
            </h2>
            <p className="text-gray-700 text-lg font-medium leading-relaxed">
              <span className="font-bold">
                เราติดตั้งประตูม้วนได้ทุกรูปแบบที่ลูกค้าต้องการ
              </span>{" "}
              เช่น ประตูม้วนไฟฟ้า-รีโมท ประตูม้วนรถโกดัง ประตูม้วนมือดึง
              และรับทำประตูโรงงานแบบอัตโนมัติ ราคาไม่แพง ฝีมือติดตั้งประณีตรับประกันผลงาน
            </p>
            <p className="text-gray-700 text-lg font-medium leading-relaxed">
              ทั้งประตูม้วนโรงงาน ประตูม้วนคลังสินค้า-โกดัง
              ประตูม้วนตึกแถวร้านค้า-โชว์รูม-ศูนย์บริการ
              ประตูม้วนแผงขายของในตลาดและศูนย์การค้า
            </p>
          </div>
        </div>
      </section>

      <Divider className="my-6 w-16 border-blue-500 mx-auto" />

      {/* SECTION 2 */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* ข้อความ */}
          <div className="md:w-1/2 order-2 md:order-1 space-y-4">
            <h2 className="text-2xl font-bold text-blue-800">
              5 เหตุผลหลัก สำหรับบริการติดตั้งประตูม้วนที่ดีจาก ดีเดย์
            </h2>
            <ul className="list-disc list-inside text-gray-700 text-lg font-medium space-y-2 mt-2">
              <li>เรามีประตูม้วนหลายแบบให้ลูกค้าเลือกตามงบประมาณในราคายุติธรรม</li>
              <li>เลือกใช้มอเตอร์และวัสดุคุณภาพสูงระดับพรีเมียม</li>
              <li>ทีมช่างผู้เชี่ยวชาญ ติดตั้งได้มาตรฐานสูง เปิด-ปิดประตูม้วนราบรื่น</li>
              <li>งานติดตั้งประณีตโดยช่างมืออาชีพ ทำเสร็จจริงไม่ทิ้งงาน</li>
              <li>ผลงานติดตั้งรับรองคุณภาพอุตสาหกรรม รับประกันนาน 10 ปี</li>
            </ul>
          </div>

          {/* รูปภาพ */}
          <div className="md:w-1/2 order-1 md:order-2 relative group">
            <img
              src="/assets/images/About-1.png"
              alt="Reason"
              className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg"></div>
          </div>
        </div>
      </section>

      <Divider className="my-6 w-16 border-blue-500 mx-auto" />

      {/* SECTION 3: สินค้าและบริการ */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* รูปภาพ */}
          <div className="md:w-1/2 relative group">
            <img
              src="/assets/images/About-1.png"
              alt="Installation"
              className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg"></div>
          </div>

          {/* ข้อความ */}
          <div className="md:w-1/2 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                สินค้าและบริการ
              </h1>
              <div className="w-16 border-b-4 border-blue-500"></div>
            </div>
            <h2 className="text-xl font-bold text-blue-700">
              จำหน่ายและรับติดตั้งประตูเหล็กม้วน ประตูม้วนสแตนเลส
            </h2>
            <p className="text-gray-700 text-lg font-medium">
              โรลเลอร์ชัตเตอร์ Roller Shutter ทุกระบบทุกขนาด-ใหญ่แค่ไหนเราทำได้
              ทั้งแบบทึบ แบบโปร่ง แบบครึ่งโปร่งครึ่งทึบ บริการด่วนๆ
              ในพื้นที่ศรีราชา ชลบุรี ปลวกแดง ระยอง
            </p>
            <ul className="list-disc list-inside text-gray-700 text-lg font-medium space-y-2 pl-4">
              <li>1. ประตูม้วนแบบมือดึง หรือแบบสปริง</li>
              <li>2. ประตูม้วนแบบรถโกดัง</li>
              <li>3. ประตูม้วนไฟฟ้าเปิดปิดด้วยรีโมท หรือประตูม้วนอัตโนมัติ</li>
            </ul>
          </div>
        </div>
      </section>

      <Divider className="my-6 w-16 border-blue-500 mx-auto" />

      {/* SECTION 4: รับซ่อมประตูม้วน */}
      <section className="py-12 px-4 bg-gradient-to-r from-white to-blue-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* ข้อความ */}
          <div className="md:w-1/2 space-y-4 order-2 md:order-1">
            <h2 className="text-2xl font-bold text-blue-800">
              รับซ่อมประตูม้วนทุกระบบ แก้ได้ซ่อมจบทุกปัญหาโดยช่างซ่อมประตูม้วน ศรีราชา
              รับประกันงานซ่อม
            </h2>
            <ul className="list-disc list-inside text-gray-700 text-lg font-medium space-y-2 leading-relaxed">
              <li>
                แก้ปัญหาประตูม้วน-ประตูรั้วโรงงาน ถูกรถชนพัง เปิดปิดไม่ได้
                เสียหายมากซ่อมไม่คุ้มเปลี่ยนใหม่ วันเดียวเสร็จ
              </li>
              <li>
                รับซ่อมประตูม้วนอัตโนมัติ มอเตอร์เสีย กดรีโมทไม่ขึ้น-ลง
                ประตูม้วนค้างปิดไม่ได้
              </li>
              <li>
                แก้ปัญหาประตูม้วนเสียงดังรำคาญ ล็อคไม่ได้
                ติดตั้งมาจากที่อื่นมีปัญหาเราแก้ได้
              </li>
              <li>
                ประตูม้วนเสียหาย ถูกงัดแงะ ซ่อมประตูรั้วอัตโนมัติ มอเตอร์ขับประตูรั้วเสีย
              </li>
              <li>แปลงประตูม้วนมือดึงเป็นประตูม้วนไฟฟ้า-รีโมท</li>
            </ul>
          </div>

          {/* รูปภาพ */}
          <div className="md:w-1/2 order-1 md:order-2 relative group">
            <img
              src="/assets/images/About-2.png"
              alt="Repair"
              className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg"></div>
          </div>
        </div>
      </section>

      <Divider className="my-6 w-16 border-blue-500 mx-auto" />

      {/* SECTION 5: อะไหล่ประตูม้วน */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* รูปภาพ */}
          <div className="md:w-1/2 relative group">
            <img
              src="/assets/images/About-3.png"
              alt="Spare parts"
              className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg"></div>
          </div>

          {/* ข้อความ */}
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-2xl font-bold text-blue-800">
              จำหน่ายอะไหล่ประตูม้วนอัตโนมัติ อะไหล่ประตูม้วนไฟฟ้า
            </h2>
            <ul className="list-disc list-inside text-gray-700 text-lg font-medium space-y-2">
              <li>1. ขายกล่องประตูม้วน</li>
              <li>2. ขายมอเตอร์ประตูม้วนทุกรุ่น สินค้าใหม่มีรับประกัน</li>
              <li>3. ขายชิ้นส่วนอะไหล่ประตูม้วนทุกระบบ ต้องการอะไหล่ชิ้นไหนสอบถามได้</li>
            </ul>
          </div>
        </div>
      </section>

      <Divider className="my-6 w-16 border-blue-500 mx-auto" />

      {/* SECTION 6: ข้อความปิดท้าย */}
      <section className="pb-12 px-4 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-start border-l-4 border-gray-300 pl-4 text-gray-700 text-lg font-medium">
            <p>
              เพราะเราเลือกใช้วัสดุดีมีคุณภาพ ใช้งานได้ทนทาน
              ติดตั้งโดยช่างทำประตูฝีมือดีที่มีประสบการณ์ประตูม้วนมากกว่า 20 ปี
              งานติดตั้งคุณภาพทำเสร็จจริงไม่ทิ้งงาน เก็บงานเรียบร้อย
              รับผิดชอบทุกผลงาน ส่งมอบงานตรงเวลา ในราคาไม่แพง
            </p>
          </div>

          <p className="text-red-600 font-bold text-lg text-center leading-relaxed">
            ให้บริการลูกค้าผ่าน
            <span className="text-gray-900 font-medium">
              {" "}
              บ่อวิน, ปากร่วม, นิคมอุตสาหกรรม WHA บ่อวิน, เหมราช, อีสเทิร์นซีบอร์ด,
              หนองคล้าใหม่, ตำบลสิง, สุรศักดิ์, นิคมแหลมฉบัง, สวนอุตสาหกรรมสหพัฒน์,
              ทุ่งสุขลา, หนองขาม, นิคมอุตสาหกรรมปิ่นทอง, เขาคันทรง, มาเมียง, บางพระ,
              ถนนสาย 331, สาย 7, สาย 36, มอเตอร์เวย์, ศรีราชา ชลบุรี, โรจนะ, หนองปลาไหล,
              หนองปรือ, บางละมุง, โป่ง, เขาไม้แก้ว, ห้วยใหญ่, ตะเคียนเตี้ย, นาเกลือ,
              นิคมมาบตาพุด, มาบยางพร, ห้วยปราบ, ปลวกแดง, ระยอง
            </span>
          </p>

          <p className="text-orange-600 font-bold text-2xl text-center">
            โทรเลย... <span className="text-blue-900">083-015-1893, 086-033-5224</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
