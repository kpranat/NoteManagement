# 🚨 Deployment Issues Fix Guide

## Issues Encountered

### 1. ❌ 500 Error on `/api/ai/summarize`
**Cause**: Missing `GROQ_API_KEY` environment variable in Vercel

### 2. ❌ 404 Error on `/login`  
**Likely Causes**: 
- Frontend `VITE_API_URL` environment variable not configured correctly in Vercel
- CORS configuration issue

---

## 🔧 Fixes Applied

### Backend Changes
✅ **Improved AI Service Error Handling**
- Added detailed error messages when GROQ_API_KEY is missing
- Added health check endpoint: `/api/ai/health`
- Better logging for AI service initialization

---

## 📋 Required Actions in Vercel Dashboard

### Step 1: Configure Backend Environment Variables

Go to your **backend Vercel project** → Settings → Environment Variables and add:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your PostgreSQL connection string | ✅ Yes |
| `JWT_SECRET_KEY` | Random 32+ character string | ✅ Yes |
| `GROQ_API_KEY` | Your Groq API key from [console.groq.com](https://console.groq.com) | ✅ Yes (for AI features) |

**Important Notes:**
- Set these for **all environments** (Production, Preview, Development)
- After adding/updating variables, click **"Redeploy"** in Deployments tab

#### Getting GROQ_API_KEY:
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / Log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key and add it to Vercel

### Step 2: Configure Frontend Environment Variables

Go to your **frontend Vercel project** → Settings → Environment Variables and add:

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Your backend Vercel URL | `https://your-backend.vercel.app` |

**Important Notes:**
- ⚠️ Do **NOT** include `/api` suffix or trailing slash
- ⚠️ The app automatically adds `/api` to the URL
- Example: If your backend is at `https://note-backend-abc123.vercel.app`, set `VITE_API_URL=https://note-backend-abc123.vercel.app`

---

## 🧪 Testing the Fix

### 1. Check Backend Health
Visit these endpoints to verify backend is working:

```bash
# General health check
https://your-backend.vercel.app/api/health

# AI service health check (NEW!)
https://your-backend.vercel.app/api/ai/health
```

**Expected responses:**

**`/api/health`** (should return):
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

**`/api/ai/health`** (should return):
```json
{
  "status": "ok",
  "configured": true,
  "error": null,
  "message": "AI service is ready"
}
```

If AI health check shows `"configured": false`, it means `GROQ_API_KEY` is not set.

### 2. Check Frontend Configuration

Open your deployed frontend and check browser console:
- Look for any CORS errors
- Check if API requests are going to the correct backend URL
- Verify authentication token is being sent

### 3. Test AI Features

1. Log in to your app
2. Make sure you have Premium subscription
3. Create a note with some content
4. Try using AI Summarize feature
5. Check browser Network tab for the `/api/ai/summarize` request

**Expected behavior**:
- ✅ Should return a summary (if GROQ_API_KEY is set correctly)
- ❌ Should return error: "AI service not configured. Please set GROQ_API_KEY..." (if key is missing)

---

## 🐛 Troubleshooting

### Issue: Still getting 500 error on AI endpoints

**Check Vercel Function Logs:**
1. Go to Vercel Dashboard → Your Backend Project → Deployments
2. Click on the latest deployment
3. Click "View Function Logs"
4. Look for error messages

**Common causes:**
- ✗ `GROQ_API_KEY` not set or invalid
- ✗ `DATABASE_URL` not set
- ✗ Database connection issues

### Issue: Still getting 404 on /login

**Check these:**
1. Frontend `VITE_API_URL` is set correctly in Vercel
2. Backend is deployed and accessible
3. Check CORS configuration in backend `/app/__init__.py`:
   ```python
   origins=[
       "https://note-management-zeta.vercel.app"
   ]
   ```
   Make sure this includes your actual frontend URL

### Issue: "Premium subscription required" error

This means either:
1. User doesn't have active premium subscription
2. Token is invalid or expired
3. Database subscription record not set correctly

**To test with a premium user:**
```python
# Run this in backend with your DATABASE_URL set:
python
>>> from app import create_app
>>> from app.extensions import db
>>> from app.models import User
>>> app = create_app()
>>> with app.app_context():
...     user = User.query.filter_by(email='your@email.com').first()
...     user.subscription_plan = 'premium'
...     user.subscription_status = 'active'
...     from datetime import datetime, timedelta
...     user.subscribed_at = datetime.utcnow()
...     user.subscription_expires_at = datetime.utcnow() + timedelta(days=30)
...     db.session.commit()
```

---

## 📝 Deployment Checklist

- [ ] Backend environment variables set in Vercel:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET_KEY`
  - [ ] `GROQ_API_KEY`
- [ ] Frontend environment variables set in Vercel:
  - [ ] `VITE_API_URL`
- [ ] Backend redeployed after setting environment variables
- [ ] Frontend redeployed after setting environment variables  
- [ ] `/api/health` endpoint returns 200 OK
- [ ] `/api/ai/health` endpoint returns "configured": true
- [ ] Database tables initialized (run `init_db.py` if needed)
- [ ] Test user has premium subscription
- [ ] Can login successfully
- [ ] Can access AI features without 500 error

---

## 🔗 Useful Links

- [Groq API Console](https://console.groq.com)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel PostgreSQL](https://vercel.com/docs/storage/vercel-postgres)

---

## 📞 Need More Help?

Check Vercel function logs and look for specific error messages. The improved logging will now show:
- ✓ "Groq AI client initialized successfully" (if GROQ_API_KEY is set)
- ✗ "GROQ_API_KEY environment variable not set" (if missing)
- ✗ "Failed to initialize Groq client: [error]" (if key is invalid)
