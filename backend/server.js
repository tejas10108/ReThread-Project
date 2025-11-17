const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
  exposedHeaders: ['x-access-token', 'x-refresh-token']
}));
app.use(express.json());

// -- ROUTES --
// mount API routes under /api
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// root route for health/visibility
app.get('/', (req, res) => {
  res.send('Backend running — welcome!');
});

// Health check (existing)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database connection test (existing)
app.get('/api/test-db', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$disconnect();
    res.json({ status: 'OK', message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
      code: error.code
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
