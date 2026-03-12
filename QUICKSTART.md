# Quick Start Guide

## Prerequisites

- Python 3.8+ installed
- Node.js 18+ and npm installed
- Supabase account (free tier works)

## Setup (First Time Only)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file from template
cp .env.example .env

# Edit .env with your Supabase credentials
# You'll need:
# - SUPABASE_URL from your Supabase project settings > API
# - SUPABASE_KEY (anon/public key) from your Supabase project > API
# - DATABASE_URL (PostgreSQL connection string) from your Supabase project > Database
# - JWT_SECRET_KEY (generate using: python -c "import secrets; print(secrets.token_hex(32))")
```

### 2. Get Supabase Database Connection String

1. Go to your Supabase project
2. Open **Project Settings** > **Database**
3. Scroll to **Connection string** section
4. Copy the **URI** format (not session pooler)
5. Replace `[YOUR-PASSWORD]` with your database password
6. Add this to `.env` as `DATABASE_URL`

Example:
```
DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### 3. Supabase Database Setup

Tables will be created automatically when you first run the server. Alternatively, you can create them manually using the SQL script in `backend/SETUP.md`.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env to point to your backend (default: http://localhost:5000/api)
```

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Option 2: Quick Start (Windows PowerShell)

From the root directory, run:
```powershell
# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python run.py"

# Start frontend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

## Testing the Setup

1. Open your browser to `http://localhost:5173`
2. Click "Click to sign up" or navigate to `/register`
3. Create a new account with:
   - Name (username)
   - Email
   - Password (at least 6 characters)
4. You should be automatically logged in and redirected to the dashboard
5. Your username should appear in the top-right navbar
6. Click on your avatar to see the logout option

## Troubleshooting

### Backend won't start
- Make sure Python 3.8+ is installed: `python --version`
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check that `.env` file exists and has valid Supabase credentials
- Ensure port 5000 is not in use by another application

### Frontend won't start  
- Make sure Node.js is installed: `node --version`
- Verify dependencies are installed: `npm install`
- Check that `.env` file exists with VITE_API_URL
- Ensure port 5173 is not in use

### Can't login/register
- Verify backend is running on http://localhost:5000
- Check browser console for any errors (F12)
- Verify Supabase credentials are correct in backend `.env`
- Ensure database tables are created in Supabase
- Check Network tab in browser DevTools to see API responses

### TypeScript errors about '@/' imports
- Restart VS Code or your editor
- Run: `npm run dev` - Vite will handle the path alias correctly at runtime
- The TypeScript server might need to reload the configuration

## Default Test User

After creating your first user through the registration page, you can test with:
- Email: (the one you registered with)
- Password: (the password you set)

## Next Steps

- Explore the dashboard at `/dashboard`
- Try creating a note at `/notes/create`
- Check your profile settings at `/settings`
- View all your notes at `/notes`

For more detailed information, see `AUTH_SETUP.md`
