import express from "express";
import { 
  getAllAddresses, 
  getUserAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress 
} from "../services/addressService.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware.verifyToken, async (req, res) => {
  try {
    let addresses;
    if (req.user.role === "A") {
      addresses = await getAllAddresses();
    } else {
      addresses = await getUserAddresses(req.user.id);
    }
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, async (req, res) => {
  try {
    await deleteAddress(Number(req.params.id));
    res.json({ message: "ลบที่อยู่เรียบร้อยแล้ว" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

export default router;
