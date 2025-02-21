import InstallationKitService from '../services/installationKitService.js';

export const getAllInstallationKits = async (req, res, next) => {
    try {
        const kits = await InstallationKitService.getAllInstallationKits();
        res.json(kits);
    } catch (error) {
        next(error);
    }
};

export const getInstallationKitById = async (req, res, next) => {
    try {
        const kit = await InstallationKitService.getInstallationKitById(req.params.id);
        if (!kit) return res.status(404).json({ error: "ไม่พบชุดติดตั้ง" });
        res.json(kit);
    } catch (error) {
        next(error);
    }
};
