import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoute from './routes/authRoute.js';
import orderRoute from './routes/orderRoute.js';
import productRoute from './routes/productRoute.js';
import repairRequestRoute from './routes/repairRequestRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import workSampleRoute from './routes/workSampleRoute.js';
import addressRoute from "./routes/addressRoute.js";
import userRoute from "./routes/userRoute.js";
import slipUploadRoute from './routes/slipUploadRoute.js';
import cartRoute from "./routes/cartRoute.js";
import errorMiddleware from './middlewares/errorMiddleware.js';
import notificationRoutes from './routes/notificationRoute.js';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: { success: false, message: 'Too many requests, please try again later.' }
});

app.use(cors({
    origin: true,
    credentials: true,
  }));
app.use(helmet());
app.use(compression());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// if (process.env.NODE_ENV === 'development') {
//     // app.use(morgan('dev'));
// } else {
//     app.use(morgan('combined'));
// }

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/auth', authRoute);
app.use("/api/users", userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/repair-requests', repairRequestRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/work-samples', workSampleRoute);
app.use('/api/addresses', addressRoute);
app.use('/api', slipUploadRoute);
app.use('/api/notifications', notificationRoutes);

app.get("/api/users", (req, res) => {
    res.json([{ id: 1, username: "test_user", role: "U" }]);
});

app.use(errorMiddleware);

export default app;
