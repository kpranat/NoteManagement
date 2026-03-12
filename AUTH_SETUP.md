# Authentication Setup Guide

This guide explains the complete authentication system setup for the NoteManagement application.

## Overview

The application uses:
- **Backend**: Flask + Supabase + JWT tokens
- **Password Hashing**: Werkzeug Security
- **Frontend**: React + TypeScript with Context API

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to your project settings and copy:
   - Project URL
   - Anon/Public API Key

### 3. Create Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public registration
CREATE POLICY "Allow public read access to users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert for registration" ON users
    FOR INSERT WITH CHECK (true);
```

### 4. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET_KEY=your_secret_jwt_key_here
FLASK_ENV=development
```

**Important**: Generate a strong JWT secret key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 5. Start Backend Server

```bash
python run.py
```

Server will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or similar)

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response (201 Created)**:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "created_at": "2026-03-12T..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200 OK)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "created_at": "2026-03-12T..."
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

## Frontend Architecture

### Auth Context
Located at `frontend/src/contexts/AuthContext.tsx`
- Manages global authentication state
- Provides login, register, and logout functions
- Automatically verifies token on app load

### Auth Service
Located at `frontend/src/lib/authService.ts`
- Handles all API calls to backend
- Manages token storage in localStorage
- Provides authentication helper methods

### Protected Routes
Located at `frontend/src/components/ProtectedRoute.tsx`
- Wraps protected pages
- Redirects to login if not authenticated
- Shows loading state during verification

### Usage in Components

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using `werkzeug.security.generate_password_hash` before storing
2. **JWT Tokens**: Secure JWT tokens with expiration (24 hours by default)
3. **Token Verification**: All protected routes verify JWT token validity
4. **CORS Protection**: Backend configured with CORS for specified origins
5. **SQL Injection Protection**: Supabase client handles parameterized queries

## Testing the Setup

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173/register`
3. Register a new account
4. You should be:
   - Redirected to the dashboard
   - See your username in the navbar
   - Be able to access protected routes

5. Test logout functionality
6. Test login with your credentials

## Troubleshooting

### Backend Issues

**"Module not found" errors**:
```bash
pip install -r requirements.txt
```

**Supabase connection errors**:
- Verify SUPABASE_URL and SUPABASE_KEY in `.env`
- Check Supabase project is active
- Ensure database tables are created

**CORS errors**:
- Verify backend is running on port 5000
- Check CORS configuration in `app/__init__.py`

### Frontend Issues

**API connection errors**:
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env`
- Inspect browser console for specific errors

**Token issues**:
- Clear localStorage and try logging in again
- Verify JWT_SECRET_KEY matches between requests
- Check token expiration time

### Development vs Production

For production deployment:
1. Use a strong JWT_SECRET_KEY
2. Set appropriate CORS origins (not `*`)
3. Use HTTPS for all connections
4. Set `FLASK_ENV=production`
5. Configure proper environment variables in hosting platform

## Next Steps

- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Implement refresh tokens
- [ ] Add rate limiting to prevent brute force
- [ ] Add OAuth providers (Google, GitHub, etc.)
- [ ] Implement user profile management

## File Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app initialization
│   ├── config.py            # Configuration
│   ├── extensions.py        # Supabase client
│   ├── models.py            # User model
│   └── auth/
│       ├── __init__.py      # Auth blueprint
│       └── routes.py        # Auth routes
├── run.py                   # Entry point
├── requirements.txt         # Python dependencies
├── .env.example            # Environment template
└── SETUP.md                # Setup instructions

frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx  # Auth context provider
│   ├── lib/
│   │   └── authService.ts   # API service
│   ├── components/
│   │   ├── Navbar.tsx       # Updated with logout
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Login.tsx        # Updated login page
│   │   └── Register.tsx     # Updated register page
│   └── main.tsx             # App entry with AuthProvider
├── .env.example            # Environment template
└── package.json            # Dependencies
```
