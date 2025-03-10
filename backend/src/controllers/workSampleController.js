import WorkSampleService from '../services/workSampleService.js';
import prisma from "../config/db.js";
import fs from 'fs';

export const createWorkSample = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "กรุณาอัปโหลดอย่างน้อย 1 รูป" });
        }

        const imageUrls = req.files.map(file => `/uploads/work_samples/${file.filename}`);
        const workSample = await WorkSampleService.createWorkSample(req.body.title, req.body.description, imageUrls);

        res.status(201).json(workSample);
    } catch (error) {
        next(error);
    }
};

export const updateWorkSample = async (req, res, next) => {
    try {
     // console.log("req.body.existingImages", req.body.existingImages)

        const oldFiles = req.body.existingImages 
        ? Array.isArray(req.body.existingImages) 
            ? req.body.existingImages 
            : [req.body.existingImages] 
        : [];
    
    
        // console.log("oldFiles", oldFiles)

        // console.log("new files",req.files)
        const newImages = req.files ? req.files.map(file => `/uploads/work_samples/${file.filename}`) : [];

        // console.log(newImages)

        const cleanedOldFiles = oldFiles.length > 0 ? oldFiles.map(file => file.replace('http://localhost:1234', '')) : null;

        // console.log("cleanedOldFiles", cleanedOldFiles)

        let allfiles;
        if (cleanedOldFiles) {
            allfiles = [...cleanedOldFiles, ...newImages]
        } else {
            allfiles = [...newImages]
        }


        // console.log(allfiles)


        const updatedWorkSample = await WorkSampleService.updateWorkSample(
            req.params.id,
            req.body,
            allfiles
            // newImages
        );

        res.json(updatedWorkSample);
    } catch (error) {
        next(error);
    }
};

export const deleteWorkSample = async (req, res) => {
    try {
        console.log("Deleting work sample with ID:", req.params.id);  // ✅ ตรวจสอบว่า ID ที่ส่งมาตรงกับ Database หรือไม่

        const workSample = await prisma.work_sample.findUnique({
            where: { id: Number(req.params.id) },
        });

        if (!workSample) {
            return res.status(404).json({ message: "Work Sample not found" });
        }

        // ✅ ลบไฟล์ภาพออกจากเซิร์ฟเวอร์
        workSample.images.forEach((imagePath) => {
            const filePath = `.${imagePath}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        // ✅ ลบข้อมูลออกจาก Database
        await prisma.work_sample.delete({
            where: { id: Number(req.params.id) },
        });

        res.json({ message: "ลบผลงานและไฟล์รูปภาพเรียบร้อยแล้ว" });
    } catch (error) {
        console.error("Error deleting work sample:", error); // ✅ แสดง Error ที่เกิดขึ้นใน Backend
        res.status(500).json({ message: "Error deleting work sample", error });
    }
};

export const getAllWorkSamples = async (req, res, next) => {
    try {
        const workSamples = await WorkSampleService.getAllWorkSamples();
        res.json(workSamples);
    } catch (error) {
        next(error);
    }
};

export const getWorkSampleById = async (req, res, next) => {
    try {
        const workSample = await WorkSampleService.getWorkSampleById(req.params.id);
        if (!workSample) return res.status(404).json({ message: "Work Sample not found" });
        res.json(workSample);
    } catch (error) {
        next(error);
    }
};
