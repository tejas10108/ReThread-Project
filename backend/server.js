const express = require('express');
const cors = require('cors');
require('dotenv').config();

const USE_LOCAL_STORAGE = process.env.NODE_ENV !== 'production' && (process.env.USE_LOCAL_STORAGE === 'true' || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost'));

const authRoutes = USE_LOCAL_STORAGE 
  ? require('./routes/auth-local')
  : require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const itemRoutes = require('./routes/items');
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token', 'Accept'],
  exposedHeaders: ['x-access-token', 'x-refresh-token']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('Backend running — welcome!');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

if (!USE_LOCAL_STORAGE) {
  app.get('/api/test-db', async (req, res) => {
    try {
      const prisma = require('./utils/prisma');
      await prisma.$queryRaw`SELECT 1`;
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
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Storage: ${USE_LOCAL_STORAGE ? 'In-Memory (Local)' : 'Database (PostgreSQL)'}`);
  if (!USE_LOCAL_STORAGE) {
    console.log(`Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  }
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`\nTo fix this, run one of these commands:`);
    console.error(`  lsof -ti:${PORT} | xargs kill -9`);
    console.error(`  OR use: npm run dev (recommended)\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

