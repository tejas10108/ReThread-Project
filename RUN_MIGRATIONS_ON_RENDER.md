# Run Migrations on Render

## ⚠️ Important: Run Migrations on Render, NOT Locally

You're trying to run migrations locally, but you need to run them on **Render** where your production database is.

---

## ✅ Steps to Run Migrations on Render:

### 1. Go to Render Dashboard
- Open: https://dashboard.render.com
- Find your backend service: `rethread-project`

### 2. Open Shell
- Click on your backend service
- Click **"Shell"** tab (top right, next to "Logs")

### 3. Run Migration Command
In the Render Shell, run:
```bash
cd backend
npx prisma migrate deploy
```

### 4. Wait for Completion
You should see:
```
✅ Applied migration: 20251117065023_init
```

---

## ❌ Why Not Locally?

- Local `.env` uses local storage (no DATABASE_URL)
- Production database is on Aiven (only accessible from Render)
- Migrations must run where the database is accessible

---

## ✅ After Migrations Run:

1. Test backend: `https://rethread-project.onrender.com/api/test-db`
2. Should return: `{"status":"OK","message":"Database connection successful"}`
3. Test signup: Should work now!

---

## 🔍 If Migrations Fail on Render:

Check:
1. **Environment Variables** in Render:
   - `DATABASE_URL` is set correctly
   - `NODE_ENV=production`
   
2. **Build Command** in Render:
   - Should be: `npm install && npm run build`
   - This runs migrations automatically

3. **Check Logs** in Render for errors

