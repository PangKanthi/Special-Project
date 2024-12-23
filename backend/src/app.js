import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoute from './routes/authRoute.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoute);

export default app;