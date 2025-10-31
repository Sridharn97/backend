import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from '../backend/routes/authRoutes.js';
import ideaRoutes from '../backend/routes/ideaRoutes.js';
import commentRoutes from '../backend/routes/commentRoutes.js';
import adminRoutes from '../backend/routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/startup-validator')
  .then(() => console.log('✅ MongoDB connected...'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// -------------------- Serve Frontend --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Startup Idea Validator API is running...');
  });
}
// --------------------------------------------------------

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
