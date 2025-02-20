import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoute from "./routes/authRoute.js";
import errorMiddleware from "./utils/errorMiddleware.js";
import productRoutes from "./routes/productRoute.js";
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);

// Middleware จัดการข้อผิดพลาด
app.use(errorMiddleware);

export default app;
