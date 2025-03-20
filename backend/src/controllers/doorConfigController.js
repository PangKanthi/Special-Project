import DoorConfigService from "../services/doorConfigService.js";

export const getAllDoorConfigs = async (req, res, next) => {
  try {
    const data = await DoorConfigService.getAllDoorConfigs();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getDoorConfigById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const config = await DoorConfigService.getDoorConfigById(id);
    if (!config) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
};

export const createDoorConfig = async (req, res, next) => {
  try {
    const newConfig = await DoorConfigService.createDoorConfig(req.body);
    res.status(201).json({ success: true, data: newConfig });
  } catch (err) {
    next(err);
  }
};

export const updateDoorConfig = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await DoorConfigService.updateDoorConfig(id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteDoorConfig = async (req, res, next) => {
  try {
    const { id } = req.params;
    await DoorConfigService.deleteDoorConfig(id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
