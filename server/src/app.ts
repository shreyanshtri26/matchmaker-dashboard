import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import customerRoutes from './routes/customerRoutes';
import matchRoutes from './routes/matchRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' })); // Set FRONTEND_URL in env to Vercel URL
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/matchmaker')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/api', authRoutes);
app.use('/api', customerRoutes);
app.use('/api', matchRoutes);

export default app;