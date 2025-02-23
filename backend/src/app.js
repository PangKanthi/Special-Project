import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';

import authRoute from './routes/authRoute.js';
import orderRoute from './routes/orderRoute.js';
import productRoute from './routes/productRoute.js';
import uploadRoute from './routes/uploadRoute.js';
import repairRequestRoute from './routes/repairRequestRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import workSampleRoute from './routes/workSampleRoute.js';
import installationKitRoute from './routes/installationKitRoute.js';
import addressRoutes from "./routes/addressRoute.js";

import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later.' }
});

app.use(cors());
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

app.use('/api/auth', authRoute);
app.use('/api/orders', orderRoute);
app.use('/api/products', productRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/repair-requests', repairRequestRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/work-samples', workSampleRoute);
app.use('/api/installation-kits', installationKitRoute);
app.use("/addresses", addressRoutes);

app.use(errorMiddleware);

export default app;
