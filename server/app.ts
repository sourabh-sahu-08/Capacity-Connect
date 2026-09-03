import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import onboardingRoutes from './routes/onboarding';
import notificationRoutes from './routes/notifications';
import { initializeSocket } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});
initializeSocket(io);

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/v1/competency', require('./routes/competency').default);
app.use('/api/v1/manager', require('./routes/manager').default);
app.use('/api/courses', require('./routes/courses').default);
app.use('/api/assessments', require('./routes/assessments').default);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "Capacity Connect API is running"
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
