import InstallationKitService from '../services/installationKitService.js';

export const getAllInstallationKits = async (req, res, next) => {
    try {
        const kits = await InstallationKitService.getAllInstallationKits();
        res.status(200).json({ message: "Get data successfully", data: kits });
    } catch (error) {
        next(error);
    }
};

export const getInstallationKitById = async (req, res, next) => {
    try {
        const kit = await InstallationKitService.getInstallationKitById(req.params.id);
        if (!kit) return res.status(404).json({ error: "ไม่พบชุดติดตั้ง" });
        res.status(200).json({ message: "Get data successfully", data: kit });
    } catch (error) {
        next(error);
    }
};

export const updateInstallationKit = async (req, res, next) => {
    try {
        const updatedKit = await InstallationKitService.updateInstallationKit(req.params.id, req.body);
        res.json(updatedKit);
    } catch (error) {
        next(error);
    }
};

export const deleteInstallationKit = async (req, res, next) => {
    try {
        await InstallationKitService.deleteInstallationKit(req.params.id);
        res.json({ message: "ลบชุดติดตั้งเรียบร้อยแล้ว" });
    } catch (error) {
        next(error);
    }
};
