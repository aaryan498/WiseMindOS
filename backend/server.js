import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import goalRouter from './routes/goalRoute.js';
import projectRouter from './routes/projectRoute.js';
import taskRouter from './routes/taskRoute.js';
import habitRouter from './routes/habitRoute.js';
import dailyPlanRouter from './routes/dailyPlanRoute.js';
import notebookRouter from './routes/notebookRoute.js';
import pageRouter from './routes/pageRoute.js';
import weeklyStatRouter from './routes/weeklyStatRoute.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request ID + logger middleware
app.use((req, _res, next) => {
  req.requestId = randomUUID();
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | id=${req.requestId}`);
  _res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${_res.statusCode} +${ms}ms | id=${req.requestId}`);
  });
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get('/', (_req, res) => {
  res.send('WiseMindOS Backend - Server Running...');
});

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/goals', goalRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/habits', habitRouter);
app.use('/api/daily-plan', dailyPlanRouter);
app.use('/api/notebooks', notebookRouter);
app.use('/api/pages', pageRouter);
app.use('/api/stats', weeklyStatRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running : http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced shutdown.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));