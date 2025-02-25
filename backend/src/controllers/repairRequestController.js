import RepairRequestService from '../services/repairRequestService.js';

export const createRepairRequest = async (req, res, next) => {
    try {
        const { addressId, orderId, problemDescription, serviceType } = req.body;
        
        if (!addressId || !orderId || !problemDescription || !serviceType) {
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
        }

        const repairRequest = await RepairRequestService.createRepairRequest(
            req.user.id,
            addressId,
            orderId,
            problemDescription,
            serviceType
        );

        res.status(201).json(repairRequest);
    } catch (error) {
        next(error);
    }
};

export const getUserRepairRequests = async (req, res, next) => {
    try {
        const repairRequests = await RepairRequestService.getUserRepairRequests(req.user.id);
        res.status(200).json({ message: "Get data successfully", data: repairRequests });
    } catch (error) {
        next(error);
    }
};

export const getRepairRequestById = async (req, res, next) => {
    try {
        const repairRequest = await RepairRequestService.getRepairRequestById(req.params.id);
        if (!repairRequest) return res.status(404).json({ error: "ไม่พบคำขอซ่อม" });
        res.status(200).json({ message: "Get data successfully", data: repairRequest });
    } catch (error) {
        next(error);
    }
};
