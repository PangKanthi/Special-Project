import { saveProductImages, saveKitImages } from '../services/uploadService.js';

export const uploadProductImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'กรุณาอัปโหลดอย่างน้อย 1 รูป' });
        }

        const productId = req.body.productId;
        if (!productId) {
            return res.status(400).json({ success: false, message: 'กรุณาระบุรหัสสินค้า' });
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        await saveProductImages(productId, imageUrls);

        return res.status(200).json({
            success: true,
            message: 'อัปโหลดรูปสินค้าเรียบร้อย',
            data: { imageUrls }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลด' });
    }
};

export const uploadKitImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'กรุณาอัปโหลดอย่างน้อย 1 รูป' });
        }

        const installationKitId = req.body.installationKitId;
        if (!installationKitId) {
            return res.status(400).json({ success: false, message: 'กรุณาระบุรหัสชุดติดตั้ง' });
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        await saveKitImages(installationKitId, imageUrls);

        return res.status(200).json({
            success: true,
            message: 'อัปโหลดรูปชุดติดตั้งเรียบร้อย',
            data: { imageUrls }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลด' });
    }
};
