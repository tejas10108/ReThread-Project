# Deployment Checklist

## ✅ Backend on Render

### Environment Variables (Render Dashboard → Environment)
```
DATABASE_URL=postgres://avnadmin:REMOVED_SECRET@pg-22304807-tejas10108-e913.d.aivencloud.com:11481/defaultdb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

### Build Settings
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Backend URL
- Production: `https://rethread-project.onrender.com`

---

## ✅ Frontend on Vercel

### Environment Variables (Vercel Dashboard → Settings → Environment Variables)
```
VITE_API_URL=https://rethread-project.onrender.com/api
```

### Deploy
- Connect GitHub repository
- Vercel auto-detects Vite
- Deploys on push to main

---

## ✅ Database on Aiven

### IP Whitelisting
1. Go to Aiven Dashboard
2. Select PostgreSQL service: `pg-22304807`
3. Go to "IP Filters" or "Network"
4. Add Render IP ranges (or allow all for testing)

### Verify Connection
After deployment, test: `https://rethread-project.onrender.com/api/test-db`

---

## 🚀 Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy Backend on Render**
   - Connect GitHub repo
   - Set root directory: `backend`
   - Add environment variables
   - Deploy

3. **Deploy Frontend on Vercel**
   - Connect GitHub repo
   - Add environment variable: `VITE_API_URL`
   - Deploy

4. **Verify**
   - Backend health: `https://rethread-project.onrender.com/api/health`
   - Frontend: Your Vercel URL
   - Test signup/login

---

## 📝 Notes

- Backend automatically uses database in production (NODE_ENV=production)
- Migrations run automatically during build
- Local development still uses in-memory storage
- CORS is configured to allow all origins

