import React from 'react';
import { FileUpload } from 'primereact/fileupload';

const ImageUploader = ({ onUpload }) => {
  return (
    <div className="p-field p-col-12 pt-2">
      <label>เพิ่มรูปภาพ</label>
      <div className='pt-2'>
        <FileUpload 
          name="images" 
          mode="advanced" 
          accept="image/*" 
          maxFileSize={1000000} 
          chooseLabel="เลือกไฟล์"
          auto={true}
          multiple 
          customUpload 
          uploadHandler={onUpload} 
        />
      </div>
    </div>
  );
};

export default ImageUploader;
