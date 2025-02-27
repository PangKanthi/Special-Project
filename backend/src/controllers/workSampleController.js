import WorkSampleService from '../services/workSampleService.js';

export const createWorkSample = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "กรุณาอัปโหลดอย่างน้อย 1 รูป" });
        }

        const imageUrls = req.files.map(file => `/uploads/work_samples/${file.filename}`);
        const workSample = await WorkSampleService.createWorkSample(req.user.id, req.body.description, imageUrls);

        res.status(201).json(workSample);
    } catch (error) {
        next(error);
    }
};

export const updateWorkSample = async (req, res, next) => {
    try {
        const newImages = req.files ? req.files.map(file => `/uploads/work_samples/${file.filename}`) : [];

        const updatedWorkSample = await WorkSampleService.updateWorkSample(
            req.params.id,
            req.body,
            newImages
        );

        res.json(updatedWorkSample);
    } catch (error) {
        next(error);
    }
};

export const deleteWorkSample = async (req, res, next) => {
    try {
        await WorkSampleService.deleteWorkSample(req.params.id);
        res.json({ message: "ลบผลงานเรียบร้อยแล้ว" });
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
  
  export const getWorkSampleById = async (req, res, next) => {
    try {
      const workSample = await WorkSampleService.getWorkSampleById(req.params.id);
      if (!workSample) return res.status(404).json({ message: "Work Sample not found" });
      res.json(workSample);
    } catch (error) {
      next(error);
    }
  };
