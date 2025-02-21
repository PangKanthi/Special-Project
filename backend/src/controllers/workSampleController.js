import WorkSampleService from '../services/workSampleService.js';

export const createWorkSample = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'A') {
            return res.status(403).json({ error: "เฉพาะแอดมินเท่านั้นที่สามารถเพิ่มผลงานได้" });
        }

        const { description } = req.body;
        if (!req.file || !description) {
            return res.status(400).json({ error: "กรุณาอัปโหลดรูปภาพและเพิ่มคำอธิบาย" });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const workSample = await WorkSampleService.createWorkSample(req.user.id, description, imageUrl);

        res.status(201).json(workSample);
    } catch (error) {
        next(error);
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

export const deleteWorkSample = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'A') {
            return res.status(403).json({ error: "เฉพาะแอดมินเท่านั้นที่สามารถลบผลงานได้" });
        }

        await WorkSampleService.deleteWorkSample(req.params.id);
        res.json({ message: "ลบผลงานเรียบร้อยแล้ว" });
    } catch (error) {
        next(error);
    }
};
