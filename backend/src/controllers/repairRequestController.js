import RepairRequestService from '../services/repairRequestService.js';

export const createRepairRequest = async (req, res, next) => {
    try {
        const { addressId, orderId, problemDescription, serviceType } = req.body;
        
        if (!addressId || !orderId || !problemDescription || !serviceType) {
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
        }

        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const repairRequest = await RepairRequestService.createRepairRequest(
            req.user.id,
            addressId,
            orderId,
            problemDescription,
            serviceType,
            imageUrls
        );

        res.status(201).json({ message: "สร้างคำขอซ่อมสำเร็จ", data: repairRequest });
    } catch (error) {
        next(error);
    }
};

export const getUserRepairRequests = async (req, res, next) => {
    try {
        const repairRequests = await RepairRequestService.getUserRepairRequests(req.user.id);
        res.status(200).json({ message: "ดึงข้อมูลสำเร็จ", data: repairRequests });
    } catch (error) {
        next(error);
    }
};

export const getRepairRequestById = async (req, res, next) => {
    try {
        const repairRequest = await RepairRequestService.getRepairRequestById(req.params.id);
        if (!repairRequest) return res.status(404).json({ error: "ไม่พบคำขอซ่อม" });

        res.status(200).json({ message: "ดึงข้อมูลสำเร็จ", data: repairRequest });
    } catch (error) {
        next(error);
    }
};

export const updateRepairRequest = async (req, res, next) => {
    try {
        const { problemDescription, serviceType } = req.body;

        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const updatedRepairRequest = await RepairRequestService.updateRepairRequest(
            req.params.id,
            problemDescription,
            serviceType,
            imageUrls
        );

        if (!updatedRepairRequest) return res.status(404).json({ error: "ไม่พบคำขอซ่อม" });

        res.status(200).json({ message: "อัปเดตคำขอซ่อมสำเร็จ", data: updatedRepairRequest });
    } catch (error) {
        next(error);
    }
};

export const deleteRepairRequest = async (req, res, next) => {
    try {
        const deleted = await RepairRequestService.deleteRepairRequest(req.params.id);
        if (!deleted) return res.status(404).json({ error: "ไม่พบคำขอซ่อม" });

        res.status(200).json({ message: "ลบคำขอซ่อมสำเร็จ" });
    } catch (error) {
        next(error);
    }
};
