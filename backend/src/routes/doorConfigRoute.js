import express from "express";
import {
  getAllDoorConfigs,
  getDoorConfigById,
  createDoorConfig,
  updateDoorConfig,
  deleteDoorConfig
} from "../controllers/doorConfigController.js";

const router = express.Router();

router.get("/", getAllDoorConfigs);
router.get("/:id", getDoorConfigById);
router.post("/", createDoorConfig);
router.put("/:id", updateDoorConfig);
router.delete("/:id", deleteDoorConfig);

export default router;
