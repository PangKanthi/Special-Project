import multer from 'multer';
import path from 'path';
import fs from 'fs';

const productUploadDir = 'uploads/products/';
const workSampleUploadDir = 'uploads/work_samples/';
const slipUploadDir = 'uploads/slips/';
const repairRequestUploadDir = 'uploads/repair_requests/';

// ✅ ตรวจสอบและสร้างโฟลเดอร์อัปโหลดหากไม่มี
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

[productUploadDir, workSampleUploadDir, slipUploadDir, repairRequestUploadDir].forEach(ensureDirExists);

// ✅ ตั้งค่าการเก็บไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.uploadType === "product") {
            cb(null, productUploadDir);
        } else if (req.uploadType === "work_sample") {
            cb(null, workSampleUploadDir);
        } else if (req.uploadType === "slip") {
            cb(null, slipUploadDir);
        } else if (req.uploadType === "repair_request") {
            cb(null, repairRequestUploadDir);
        } else {
            cb(new Error('❌ Invalid upload type'), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// ✅ ตรวจสอบประเภทไฟล์ที่รองรับ
const fileFilter = (req, file, cb) => {
    console.log("📂 ไฟล์ที่อัปโหลด:", file.originalname);
    console.log("📂 ประเภทไฟล์:", file.mimetype);
    const allowedTypes = /jpeg|jpg|png/;
    const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype);
    isValidType ? cb(null, true) : cb(new Error('❌ ประเภทไฟล์ไม่รองรับ (เฉพาะ JPEG, JPG, PNG เท่านั้น)'), false);
};

// ✅ ตั้งค่า `multer` สำหรับอัปโหลดไฟล์หลายไฟล์
const uploadMultiple = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
}).array('images', 5);

// ✅ ตั้งค่า `multer` สำหรับอัปโหลดไฟล์เดี่ยว
const uploadSingle = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
}).single('slip');

export const productUpload = (req, res, next) => {
    req.uploadType = "product";
    uploadMultiple(req, res, next);
};

export const workSampleUpload = (req, res, next) => {
    req.uploadType = "work_sample";
    uploadMultiple(req, res, next);
};

export const slipUpload = (req, res, next) => {
    req.uploadType = "slip";
    uploadSingle(req, res, next);
};

export const repairRequestUpload = (req, res, next) => {
    req.uploadType = "repair_request";
    uploadMultiple(req, res, next);
};
