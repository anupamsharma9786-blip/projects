import express, { Express } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { config } from './config';
import vcfRoutes from './routes/vcfRoutes';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api', vcfRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve static files from the React frontend dist folder
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React Router - send index.html for all non-API routes
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use(errorHandler);

// 404 handler for API routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API route not found' });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Start server
const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(3000, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
