# Supabase Setup Guide

## Database Schema

The application uses SQLAlchemy ORM with Supabase PostgreSQL database. Tables are automatically created when the Flask app starts using `db.create_all()`.

### Getting Supabase Database Connection

1. Go to your Supabase project
2. Navigate to **Project Settings** > **Database**
3. Scroll down to **Connection string** section
4. Copy the **URI** connection string (not the session pooler)
5. Replace `[YOUR-PASSWORD]` with your actual database password

The connection string format:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

### Manual Table Creation (Optional)

If you prefer to create tables manually, run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes on email and username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
```

## Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials in `.env`:
   - `SUPABASE_URL`: Your Supabase project URL (from Project Settings > API)
   - `SUPABASE_KEY`: Your Supabase anon/public key (from Project Settings > API)
   - `DATABASE_URL`: Your PostgreSQL connection string (from Project Settings > Database)
   - `JWT_SECRET_KEY`: Generate a secure secret key

**Generate JWT Secret Key:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Installation

Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python run.py
```

The server will run on `http://localhost:5000`

**Note:** On first run, SQLAlchemy will automatically create all tables defined in models.py if they don't exist.

## API Endpoints

### Authentication

- **POST** `/api/auth/register`
  - Body: `{ "email": "user@example.com", "username": "user", "password": "password" }`
  - Response: `{ "token": "jwt_token", "user": {...} }`

- **POST** `/api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "token": "jwt_token", "user": {...} }`

- **GET** `/api/auth/verify`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "valid": true, "user": {...} }`

- **GET** `/api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "user": {...} }`
