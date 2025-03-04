import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const Contact = () => {
  return (
    <div className="p-6 flex justify-center">
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
    </div>
  );
};

export default Contact;
