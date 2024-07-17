import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import advicerRoutes from './routes/advicerRoutes';
import adminRoutes from './routes/adminRoutes';
import studentRoutes from './routes/studentRoutes'
import bodyParser from 'body-parser';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/student', studentRoutes);
app.use('/api/advicer', advicerRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://LSPU:admin@research-management-por.m3kzu45.mongodb.net/ResearchTru?retryWrites=true&w=majority&appName=Research-Management-Portal';


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
