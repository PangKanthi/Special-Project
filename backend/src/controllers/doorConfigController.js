// controllers/doorConfigController.js
import DoorConfigService from "../services/doorConfigService.js";

export const getAll = async (req, res, next) => {
    try {
        const configs = await DoorConfigService.getAll();
        return res.json(configs);
    } catch (error) {
        next(error);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const config = await DoorConfigService.getOne(req.params.id);
        if (!config) return res.status(404).json({ message: "Not found" });
        return res.json(config);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const newConfig = await DoorConfigService.create(req.body);
        return res.status(201).json(newConfig);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const updated = await DoorConfigService.update(req.params.id, req.body);
        return res.json(updated);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await DoorConfigService.remove(req.params.id);
        return res.json({ message: "Deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const bulkImport = async (req, res, next) => {
    try {
        // body อาจเป็น object (เหมือนไฟล์ json) หรือ array ก็ได้
        const result = await DoorConfigService.bulkUpsert(req.body);
        return res.status(201).json({ inserted: result.length });
    } catch (err) {
        next(err);
    }
};

export const updateTierPrice = async (req, res, next) => {
      try {
        const { price_per_sqm, min_area, max_area } = req.body;
        const updated = await DoorConfigService.updateTier(
          req.params.id,
          { price_per_sqm, min_area, max_area }
        );
        return res.json(updated);
      } catch (err) {
        next(err);
      }
    };