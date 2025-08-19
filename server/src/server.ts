import express from 'express';
import helmet from 'helmet';
import { connectDB } from './utils/database';
import { corsMiddleware } from './middleware/cors';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import matchRoutes from './routes/matches';
import config from './config';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/matches', matchRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
