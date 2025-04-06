import express from "express";
import * as doorConfigController from "../controllers/doorConfigController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", doorConfigController.getAll);

router.get("/:id", doorConfigController.getOne);

router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, doorConfigController.create);

router.put("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, doorConfigController.update);

router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, doorConfigController.remove);

router.post(
  "/bulk",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  doorConfigController.bulkImport
);

router.patch(
  "/price-tier/:id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  doorConfigController.updateTierPrice
);

export default router;
