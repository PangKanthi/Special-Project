import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";

import authRoute from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";
import uploadRoutes from "./routes/uploadRoute.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later." }
});

app.use(cors({ origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

app.use(errorMiddleware);

export default app;
