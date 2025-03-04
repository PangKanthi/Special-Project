import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const Contact = () => {
  return (
    <div className="p-6 flex flex-col items-center">
      {/* การ์ดข้อมูลติดต่อ */}
      <Card className="w-full max-w-3xl shadow-lg">
        <h2 className="text-2xl font-semibold border-b-2 border-blue-500 p-3">
          ติดต่อเรา
        </h2>

        <div className="w-full mt-3">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="bg-gray-100">
                <td className="p-3 font-bold w-1/3">ชื่อธุรกิจ</td>
                <td className="p-3">ห้างหุ้นส่วนจำกัด ดี เดย์ ประตูม้วน</td>
              </tr>
              <tr>
                <td className="p-3 font-bold bg-gray-100">ที่อยู่</td>
                <td className="p-3">
                  422/63 หมู่ที่ 5 ตำบลเขาคันทรง <br />
                  อำเภอศรีราชา จังหวัดชลบุรี 20110
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="p-3 font-bold">โทรศัพท์</td>
                <td className="p-3">08-3015-1893, 08-6033-5224</td>
              </tr>
              <tr>
                <td className="p-3 font-bold bg-gray-100">เว็บไซต์</td>
                <td className="p-3">
                  <a
                    href="https://d-dayengineering.yellowpages.co.th"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    d-dayengineering.yellowpages.co.th
                  </a>
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="p-3 font-bold">เวลาทำการ</td>
                <td className="p-3">ทำการทุกวัน เวลา 08:00-17:00 น.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold bg-gray-100">พิกัด</td>
                <td className="p-3">13.065418, 101.138217</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="p-3 font-bold">โซเชียลมีเดีย</td>
                <td className="p-3">
                  <Button
                    icon="pi pi-globe"
                    className="p-button-rounded p-button-info"
                    onClick={() =>
                      window.open("https://d-dayengineering.yellowpages.co.th", "_blank")
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Google Map Section */}
      <div className="w-full max-w-3xl mt-6">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-3">
          แผนที่ตั้งของเรา
        </h3>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d971.6323990381302!2d101.1381808209234!3d13.065587002711531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102c5d7963e7d5d%3A0xf8e82970dc2ad385!2z4Lir4LiI4LiBLuC4lOC4teC5gOC4lOC4ouC5jCDguJvguKPguLDguJXguLnguKHguYnguKfguJk!5e0!3m2!1sth!2sth!4v1741128915049!5m2!1sth!2sth"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
