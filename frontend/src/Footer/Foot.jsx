import React from 'react';
import { Divider } from 'primereact/divider';
import 'primeflex/primeflex.css';

const Footer = () => {
  return (
    <div style={{ backgroundColor: '#0a74da', color: '#ffffff', padding: '15px'}}>
      <div className="flex justify-content-center flex-wrap gap-8">
        <div style={{ width: '150px', textAlign: 'center' }}>
          <div style={{ paddingTop: '70px' }}>
            <div style={{ backgroundColor: '#ffffff', padding:'16px'}}>
              <img src="../assets/logo.png" alt="Company Logo" style={{ width: '100px'}} />
            </div>
          </div>
        </div>
        <div style={{ paddingTop: '90px' }}>
          <h3>ดีเดย์ ประตูม้วน ระยอง</h3>
        </div>

        <div style={{ width: '300px', paddingTop: '35px'}}>
          <h4>เกี่ยวกับเรา</h4>
          <p>จำหน่ายติดตั้งประตูม้วนไฟฟ้าลิ่ม ระยอง ติดตั้งประตูม้วนทุกชนิด ใช้งานสะดวก ใช้วัสดุคุณภาพ ราคาไม่แพง</p>
          <p>โทร: 08-6033-5224</p>
        </div>

        <div style={{ width: '300px', paddingTop: '35px'}}>
          <h4>ติดต่อเรา</h4>
          <p>ดีเดย์ ประตูม้วน ระยอง</p>
          <p>407/ หมู่ 2 ต.บานทอง อ.ปลวกแดง จ.ระยอง 21140</p>
          <p>โทร: 08-6033-5224</p>
          <p>Email: Ddayshutter@Hotmail.com</p>
        </div>

        <div style={{ width: '300px', paddingTop: '35px'}}>
          <h4>เวลาทำการ</h4>
          <p>จันทร์-เสาร์ เวลา 8:30-17:30 น.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
