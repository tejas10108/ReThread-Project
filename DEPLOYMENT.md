# Deployment Guide

## Architecture
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Aiven PostgreSQL

## Backend Deployment (Render)

### 1. Environment Variables
Go to Render Dashboard → Your Service → Environment → Add:

```
DATABASE_URL=postgres://avnadmin:REMOVED_SECRET@pg-22304807-tejas10108-e913.d.aivencloud.com:11481/defaultdb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

### 2. Build Settings
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 3. Verify Deployment
- Backend URL: `https://rethread-project.onrender.com`
- Health Check: `https://rethread-project.onrender.com/api/health`
- Test DB: `https://rethread-project.onrender.com/api/test-db`

## Frontend Deployment (Vercel)

### 1. Environment Variables
Go to Vercel Dashboard → Your Project → Settings → Environment Variables → Add:

```
VITE_API_URL=https://rethread-project.onrender.com/api
```

### 2. Deploy
- Connect your GitHub repository
- Vercel will auto-detect Vite
- Deploy automatically on push to main branch

## Database Setup (Aiven)

### 1. IP Whitelisting
- Go to Aiven Dashboard → Your PostgreSQL Service
- Add Render's IP ranges (or allow all for testing)
- Add your local IP for development: `115.244.141.202`

### 2. Run Migrations
After backend is deployed, run migrations via Render Shell:
```bash
cd backend
npx prisma migrate deploy
```

Or migrations will run automatically during build if configured.

## Testing

### Local Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`
- Uses local storage (no database needed)

### Production
- Frontend: Your Vercel URL
- Backend: `https://rethread-project.onrender.com`
- Uses Aiven PostgreSQL database

## Troubleshooting

### Backend can't connect to database
- Check IP whitelist in Aiven
- Verify DATABASE_URL in Render environment variables
- Check Render logs for connection errors

### Frontend can't reach backend
- Verify VITE_API_URL in Vercel environment variables
- Check CORS settings in backend
- Verify backend is running on Render

### Migrations not running
- Check build logs in Render
- Run manually via Render Shell: `npx prisma migrate deploy`
- Verify DATABASE_URL is set correctly

