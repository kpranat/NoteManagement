# Vercel Deployment Troubleshooting & Setup

## What Was Wrong

The serverless function was crashing because:

1. **Database Initialization**: The app was trying to create database tables (`db.create_all()`) on every request, which:
   - Causes performance issues in serverless environments
   - Can timeout during cold starts
   - May fail if database permissions aren't set correctly

2. **Missing Environment Variables**: Required environment variables weren't configured in Vercel

3. **Database URL Format**: Vercel Postgres uses `postgres://` but SQLAlchemy 1.4+ requires `postgresql://`

## Fixes Applied

✅ Removed automatic `db.create_all()` from app initialization  
✅ Added proper error handling and logging  
✅ Fixed DATABASE_URL format conversion (postgres:// → postgresql://)  
✅ Added fallback handling for missing environment variables  
✅ Created separate database initialization script

## Required Steps to Complete Deployment

### 1. Set Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET_KEY=your_secure_random_secret_key
GROQ_API_KEY=your_groq_api_key (if using AI features)
```

**Important**: 
- Get your DATABASE_URL from your Postgres provider (Vercel Postgres, Supabase, etc.)
- Generate a secure JWT_SECRET_KEY (at least 32 random characters)
- These must be set for all environments (Production, Preview, Development)

### 2. Initialize Database Tables

After setting environment variables, you need to create the database tables. You have two options:

#### Option A: Run init_db.py locally
```bash
cd backend
# Set your DATABASE_URL temporarily
$env:DATABASE_URL="your_production_database_url"
python init_db.py
```

#### Option B: Create a temporary Vercel serverless function
Create `api/init.py`:
```python
from app import create_app
from app.extensions import db

app = create_app()

def handler(request):
    with app.app_context():
        db.create_all()
        return {'message': 'Database initialized'}
```

Then visit: `https://your-vercel-url/api/init` once, then delete the file.

#### Option C: Use migration scripts
If you have existing migration scripts, run them:
```bash
python migrate_role.py
python migrate_subscription.py
python migrate_ai_usage.py
```

### 3. Redeploy

After setting environment variables:
```bash
git add .
git commit -m "Fix serverless function configuration"
git push
```

Or trigger a redeploy in Vercel dashboard.

### 4. Verify Deployment

Check these endpoints:
- `https://your-vercel-url/api/health` - Should return `{"status": "ok"}`
- Check Vercel logs for any initialization errors

## Common Issues & Solutions

### Issue: Still getting 500 error
- **Check Vercel logs**: Runtime logs will show the actual error
- **Verify environment variables**: Make sure DATABASE_URL and JWT_SECRET_KEY are set
- **Check database connection**: Ensure your database allows connections from Vercel's IP ranges

### Issue: Database connection fails
- **Postgres URL format**: Should start with `postgresql://` (auto-fixed in config)
- **Connection string**: Include all parameters (host, port, database, user, password)
- **SSL requirement**: Many hosted Postgres require `?sslmode=require` at the end

### Issue: Tables don't exist
- You forgot to run the initialization step (Step 2 above)
- Run `init_db.py` or one of the migration scripts

### Issue: CORS errors from frontend
- Update `CORS_ORIGINS` in `backend/app/config.py` with your frontend URL
- Redeploy after making changes

## Monitoring & Logs

View logs in Vercel:
1. Go to your project dashboard
2. Click on "Deployments"
3. Click on the latest deployment
4. Click "View Function Logs"

Look for the debug messages:
```
Flask app created successfully
Database URL configured: Yes
JWT Secret configured: Yes
```

## Local Development Setup

For local development, create `backend/.env`:
```env
DATABASE_URL=postgresql://localhost/notemanagement
JWT_SECRET_KEY=dev-secret-key-change-in-production
GROQ_API_KEY=your_groq_api_key
FLASK_ENV=development
```

Then uncomment the `db.create_all()` line in `app/__init__.py` for initial setup.

## Need More Help?

1. Check Vercel function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test database connection independently
4. Ensure your Postgres database is accessible from Vercel
