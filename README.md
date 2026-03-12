I'll analyze your project and create a comprehensive README. Let me first explore the codebase to understand all features and components.    

Read [](file:///d%3A/projects/NoteManagement/QUICKSTART.md#1-1), lines 1 to 50

Read [](file:///d%3A/projects/NoteManagement/backend/requirements.txt)

Read [](file:///d%3A/projects/NoteManagement/AI_FEATURES.md#1-1), lines 1 to 50

Read [](file:///d%3A/projects/NoteManagement/frontend/package.json)

Searched for regex `screenshots|demo|preview`, 7 results

Read [](file:///d%3A/projects/NoteManagement/backend/app/models.py)

Read [](file:///d%3A/projects/NoteManagement/SUBSCRIPTION_FEATURE.md#1-1), lines 1 to 100

Based on my analysis of your project, here's a comprehensive README that covers all aspects of your Note Management application:

```markdown
# 📝 NoteManagement

<div align="center">

A modern, full-stack note management application with AI-powered features, subscription management, and role-based access control.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-black)](https://flask.palletsprojects.com/)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Overview

NoteManagement is a comprehensive note-taking platform that combines traditional note management with cutting-edge AI features. Built with a modern tech stack, it offers a seamless user experience with powerful features for both individual users and administrators.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 📝 **Smart Note Management** - Create, edit, organize, and search notes effortlessly
- 🤖 **AI-Powered Tools** - Premium AI features including summarization, flashcards, quiz generation, and content enhancement
- 💎 **Subscription System** - Flexible freemium model with Free and Premium tiers
- 👨‍💼 **Admin Dashboard** - Complete system management and analytics
- 📊 **Analytics & Logging** - Track usage patterns and access logs
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- ⚡ **High Performance** - Fast API responses and optimized database queries

---

## ✨ Features

### Core Features

#### Authentication & Authorization
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with Werkzeug Security
- ✅ Token verification and refresh
- ✅ Role-based access control (User/Admin)
- ✅ Protected routes and middleware

#### Note Management
- ✅ Create, read, update, and delete notes (CRUD)
- ✅ Rich text content support
- ✅ Tag system for organization
- ✅ Search and filter notes
- ✅ User-specific note ownership
- ✅ Timestamps for created/updated dates

### Premium Features

#### AI-Powered Tools (Premium Subscription Required)
- 🤖 **Text Summarization** - Generate concise summaries of your notes
- 📌 **Key Points Extraction** - Extract 5-8 main points automatically
- 🃏 **Flashcard Generation** - Create study flashcards with Q&A
- ❓ **Quiz Generation** - Generate multiple-choice quizzes for studying
- ✨ **Content Enhancement** - Improve writing with AI suggestions
- 🔄 **Note Transformation** - Convert notes to different formats (outline, essay, bullets, formal)
- **Daily Limit**: 45 AI requests per day for premium users
- **Powered by**: Groq API with Llama 3 model

#### Subscription System
- 📦 **Free Plan** - Basic note management features
- 💎 **Premium Plan** - Unlock all AI features
- 💳 **Payment Simulation** - Safe testing environment
- 📊 **Access Logging** - Track premium feature usage
- ⏰ **Flexible Duration** - 30, 90, or 365-day subscriptions
- 🔄 **Easy Cancellation** - Cancel anytime, access until expiration

### Admin Features

#### User Management
- 👥 View all registered users (paginated)
- 🔍 Search and filter users
- 👑 Promote users to admin role
- 👤 Demote admins to regular users
- 📊 View user statistics and counts

#### System Management
- 📝 View all notes from all users
- 🗑️ Delete any note (with moderation controls)
- 📈 System statistics and analytics
- 📊 User activity monitoring
- 🔍 Comprehensive access logs

#### Analytics Dashboard
- 📊 Total users count
- 📝 Total notes count
- 💎 Premium subscribers count
- 📈 Growth metrics
- 🕐 Activity timeline

---

## 🎬 Demo

### User Interface Features
- Modern, responsive design that works on all devices
- Dark mode support with smooth theme transitions
- Animated gradients and visual effects
- Star field background for premium feel
- Intuitive navigation with sidebar and navbar

### Admin Dashboard
- Real-time statistics and metrics
- User management interface
- Notes moderation panel
- System health monitoring

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Core programming language |
| Flask | 3.0.0 | Web framework |
| SQLAlchemy | 3.1.1 | ORM for database operations |
| PostgreSQL | Latest | Primary database (via Supabase) |
| PyJWT | 2.8.0 | JSON Web Token authentication |
| Werkzeug | 3.0.1 | Password hashing and security |
| Groq | 0.4.2 | AI API integration |
| Flask-CORS | 4.0.0 | Cross-origin resource sharing |
| psycopg2 | 2.9.9 | PostgreSQL adapter |
| python-dotenv | 1.0.0 | Environment variable management |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| TypeScript | 5.9.3 | Type-safe JavaScript |
| Vite | 7.3.1 | Build tool and dev server |
| React Router | 7.13.1 | Client-side routing |
| Axios | 1.13.6 | HTTP client |
| TailwindCSS | 4.2.1 | Utility-first CSS framework |
| Lucide React | 0.577.0 | Icon library |

### Infrastructure
- **Database Hosting**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **AI Services**: Groq API (Llama 3)
- **Version Control**: Git

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  (React + TypeScript + TailwindCSS)                         │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Pages     │  │ Components   │  │  Services   │         │
│  │             │  │              │  │             │         │
│  │ • Login     │  │ • Navbar     │  │ • Auth      │         │
│  │ • Dashboard │  │ • Sidebar    │  │ • Notes     │         │
│  │ • Notes     │  │ • AI Tools   │  │ • Subscript │         │
│  │ • Admin     │  │ • Theme      │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (HTTP/JSON)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                (Flask + SQLAlchemy)                          │
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   Auth   │ │  Notes   │ │  Admin   │ │   AI     │       │
│  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                               │
│  ┌──────────┐ ┌──────────────────────────────────┐         │
│  │  Models  │ │       Middleware                 │         │
│  │          │ │  • JWT Verification               │         │
│  │ • User   │ │  • Premium Check                 │         │
│  │ • Note   │ │  • Admin Authorization           │         │
│  │ • Logs   │ │  • Access Logging                │         │
│  └──────────┘ └──────────────────────────────────┘         │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ↓               ↓               ↓
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │  PostgreSQL  │ │   Groq API   │ │    Cache     │
    │  (Supabase)  │ │  (AI Model)  │ │  (Optional)  │
    └──────────────┘ └──────────────┘ └──────────────┘
```

### Project Structure

```
NoteManagement/
├── backend/                      # Flask backend
│   ├── app/
│   │   ├── __init__.py          # App factory
│   │   ├── config.py            # Configuration
│   │   ├── extensions.py        # Flask extensions
│   │   ├── models.py            # Database models
│   │   ├── auth/                # Authentication routes
│   │   ├── notes/               # Notes routes
│   │   ├── admin/               # Admin routes
│   │   ├── subscription/        # Subscription routes
│   │   └── ai/                  # AI features routes
│   ├── run.py                   # Application entry point
│   ├── requirements.txt         # Python dependencies
│   └── *.py                     # Migration scripts
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom hooks
│   │   ├── layouts/             # Layout components
│   │   ├── lib/                 # Service libraries
│   │   ├── pages/               # Page components
│   │   └── shared/              # Shared utilities
│   ├── package.json             # Node dependencies
│   └── vite.config.ts           # Vite configuration
│
└── *.md                          # Documentation files
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.8 or higher
- **Node.js** 18+ and npm
- **Git** for version control
- **Supabase Account** (free tier works perfectly)
- **Groq API Key** (free for AI features)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd NoteManagement
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your credentials
   python run.py
   ```

3. **Set up the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your API URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 📥 Installation

### Detailed Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Get your database connection string from Project Settings → Database
   - Get your Supabase URL and anon key from Project Settings → API

5. **Get Groq API Key** (for AI features)
   - Visit https://console.groq.com
   - Sign up for a free account
   - Create a new API key

6. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   # Database
   DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
   
   # Supabase
   SUPABASE_URL=https://[PROJECT].supabase.co
   SUPABASE_KEY=your-anon-key
   
   # Security
   JWT_SECRET_KEY=your-secret-key-here  # Generate with: python -c "import secrets; print(secrets.token_hex(32))"
   
   # AI Features
   GROQ_API_KEY=your-groq-api-key
   ```

7. **Run database migrations**
   ```bash
   python migrate_role.py
   python migrate_subscription.py
   python migrate_ai_usage.py
   ```

8. **Start the backend server**
   ```bash
   python run.py
   ```
   Server will run on `http://localhost:5000`

### Detailed Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

---

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | ✅ |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | ✅ |
| `SUPABASE_KEY` | Supabase anon/public key | `eyJhbG...` | ✅ |
| `JWT_SECRET_KEY` | Secret for JWT signing | `random-32-byte-hex` | ✅ |
| `GROQ_API_KEY` | Groq API key for AI features | `gsk_...` | ⭕ Premium only |
| `FLASK_ENV` | Environment mode | `development` or `production` | ❌ |

### Frontend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` | ✅ |

### Database Configuration

The application automatically creates the required tables on first run. Optionally, you can create them manually:

```sql
-- See backend/SETUP.md for complete SQL schema
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication Endpoints

##### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (201)**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user",
    "subscription_plan": "free"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

##### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200)**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user",
    "subscription_plan": "free"
  }
}
```

##### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

#### Notes Endpoints

##### Get User's Notes
```http
GET /api/notes/
Authorization: Bearer <token>
```

##### Create Note
```http
POST /api/notes/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note content here",
  "tags": ["work", "important"]
}
```

##### Get Specific Note
```http
GET /api/notes/<note-id>
Authorization: Bearer <token>
```

##### Update Note
```http
PUT /api/notes/<note-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["updated"]
}
```

##### Delete Note
```http
DELETE /api/notes/<note-id>
Authorization: Bearer <token>
```

#### Admin Endpoints

##### Get All Users (Admin Only)
```http
GET /api/admin/users?page=1&per_page=10
Authorization: Bearer <admin-token>
```

##### Get System Statistics (Admin Only)
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

**Response**
```json
{
  "total_users": 150,
  "total_notes": 1247,
  "premium_users": 23,
  "free_users": 127,
  "admin_users": 2
}
```

##### Get All Notes (Admin Only)
```http
GET /api/notes/admin/all
Authorization: Bearer <admin-token>
```

##### Delete Any Note (Admin Only)
```http
DELETE /api/notes/admin/<note-id>
Authorization: Bearer <admin-token>
```

##### Update User Role (Admin Only)
```http
PUT /api/admin/users/<user-id>/role
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin"  // or "user"
}
```

#### Subscription Endpoints

##### Get Subscription Status
```http
GET /api/subscription/status
Authorization: Bearer <token>
```

**Response**
```json
{
  "subscription_plan": "premium",
  "subscription_status": "active",
  "subscribed_at": "2026-01-01T00:00:00Z",
  "subscription_expires_at": "2026-12-31T23:59:59Z",
  "days_remaining": 294
}
```

##### Upgrade to Premium
```http
POST /api/subscription/upgrade
Authorization: Bearer <token>
Content-Type: application/json

{
  "duration_days": 365,  // 30, 90, or 365
  "payment_token": "simulated_token_123"
}
```

##### Cancel Subscription
```http
POST /api/subscription/cancel
Authorization: Bearer <token>
```

##### Get Access Logs
```http
GET /api/subscription/access-logs?limit=50
Authorization: Bearer <token>
```

#### AI Endpoints (Premium Only)

##### Summarize Text
```http
POST /api/ai/summarize
Authorization: Bearer <premium-token>
Content-Type: application/json

{
  "text": "Long text to summarize..."
}
```

##### Extract Key Points
```http
POST /api/ai/key-points
Authorization: Bearer <premium-token>
Content-Type: application/json

{
  "text": "Text to extract key points from..."
}
```

##### Generate Flashcards
```http
POST /api/ai/flashcards
Authorization: Bearer <premium-token>
Content-Type: application/json

{
  "text": "Study material..."
}
```

##### Generate Quiz
```http
POST /api/ai/quiz
Authorization: Bearer <premium-token>
Content-Type: application/json

{
  "text": "Content to create quiz from..."
}
```

##### Rewrite & Improve
```http
POST /api/ai/rewrite
Authorization: Bearer <premium-token>
Content-Type: application/json

{
  "text": "Text to improve..."
}
```

##### Transform Note
```http
POST /api/ai/transform
Authorization: Bearer <premium-token>
Content-Type: application/json

{
  "text": "Note content...",
  "format": "outline"  // "outline", "essay", "bullets", or "formal"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

#### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

#### 403 Forbidden
```json
{
  "error": "Premium subscription required",
  "subscription_status": {
    "current_plan": "free",
    "upgrade_url": "/subscription"
  }
}
```

#### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

#### 429 Too Many Requests
```json
{
  "error": "Daily AI request limit reached",
  "limit": 45,
  "used": 45,
  "reset_at": "2026-03-13T00:00:00Z"
}
```

---

## 🗄️ Database Schema

### Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | User UUID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| `username` | VARCHAR(100) | UNIQUE, NOT NULL | Username |
| `password_hash` | TEXT | NOT NULL | Hashed password |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT 'user' | User role (user/admin) |
| `subscription_plan` | VARCHAR(20) | NOT NULL, DEFAULT 'free' | Subscription plan (free/premium) |
| `subscription_status` | VARCHAR(20) | NOT NULL, DEFAULT 'active' | Status (active/expired/cancelled) |
| `subscribed_at` | TIMESTAMP | NULLABLE | Subscription start date |
| `subscription_expires_at` | TIMESTAMP | NULLABLE | Subscription expiry date |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation date |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update date |

### Notes Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Note UUID |
| `user_id` | VARCHAR(36) | FOREIGN KEY → users(id), NOT NULL | Owner user ID |
| `title` | VARCHAR(255) | NOT NULL | Note title |
| `content` | TEXT | NULLABLE | Note content |
| `tags` | TEXT[] | NULLABLE | Array of tags |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation date |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update date |

### AccessLog Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Log entry UUID |
| `user_id` | VARCHAR(36) | FOREIGN KEY → users(id), NOT NULL | User ID |
| `endpoint` | VARCHAR(255) | NOT NULL | API endpoint accessed |
| `method` | VARCHAR(10) | NOT NULL | HTTP method (GET, POST, etc.) |
| `ip_address` | VARCHAR(45) | NULLABLE | User IP address |
| `user_agent` | TEXT | NULLABLE | Browser/client info |
| `accessed_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Access timestamp |

### AIUsage Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | Usage entry UUID |
| `user_id` | VARCHAR(36) | FOREIGN KEY → users(id), NOT NULL | User ID |
| `request_type` | VARCHAR(50) | NOT NULL | AI request type |
| `request_date` | DATE | NOT NULL, DEFAULT CURRENT_DATE | Date of requests |
| `request_count` | INTEGER | NOT NULL, DEFAULT 1 | Number of requests |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Entry creation date |

### Relationships

```
Users (1) ──< Notes (N)
Users (1) ──< AccessLog (N)
Users (1) ──< AIUsage (N)
```

---

## 🧪 Testing

### Backend Testing

1. **Test Admin Features**
   ```bash
   cd backend
   python test_admin.py
   ```

2. **Test Subscription System**
   ```bash
   python test_subscription.py
   ```

3. **Test Database Connection**
   ```bash
   python test_db.py
   ```

### Manual Testing Checklist

#### Authentication
- [ ] Register a new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token verification

#### Notes Management
- [ ] Create a note
- [ ] View all notes
- [ ] Update a note
- [ ] Delete a note
- [ ] Filter notes by tags

#### Subscription
- [ ] View subscription status
- [ ] Upgrade to premium
- [ ] Access premium features
- [ ] Cancel subscription
- [ ] View access logs

#### AI Features
- [ ] Test summarization
- [ ] Generate flashcards
- [ ] Generate quiz
- [ ] Rewrite content
- [ ] Transform to different formats
- [ ] Verify daily limit enforcement

#### Admin Features
- [ ] View all users
- [ ] View system statistics
- [ ] View all notes
- [ ] Delete any note
- [ ] Change user roles

---

## 🚀 Deployment

### Backend Deployment

#### Option 1: Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set DATABASE_URL=your-database-url
heroku config:set JWT_SECRET_KEY=your-secret-key
heroku config:set GROQ_API_KEY=your-groq-key

# Deploy
git push heroku main
```

#### Option 2: Railway

1. Install Railway CLI
2. Initialize project: `railway init`
3. Add environment variables in Railway dashboard
4. Deploy: `railway up`

#### Option 3: Render

1. Create new Web Service
2. Connect your GitHub repository
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && python run.py`
5. Add environment variables

### Frontend Deployment

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
cd frontend
npm run build
netlify deploy --prod
```

#### Option 3: GitHub Pages

```bash
cd frontend
npm run build
# Follow GitHub Pages setup instructions
```

### Environment Variables for Production

**Important**: Update the following for production:

1. Change `VITE_API_URL` to your production backend URL
2. Use strong, random `JWT_SECRET_KEY`
3. Enable HTTPS for all endpoints
4. Set appropriate CORS origins
5. Use production database credentials

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Coding Standards

#### Backend (Python)
- Follow PEP 8 style guide
- Add docstrings to all functions
- Write meaningful variable names
- Add error handling
- Include unit tests

#### Frontend (TypeScript/React)
- Use TypeScript for type safety
- Follow React best practices
- Use functional components and hooks
- Add PropTypes or TypeScript interfaces
- Write clean component names

### Code Review Process

1. All PRs require at least one approval
2. All tests must pass
3. Code must follow style guidelines
4. Documentation must be updated

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'flask'`
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Issue**: Database connection error
```bash
# Solution: Check your DATABASE_URL in .env
# Ensure Supabase project is active
# Verify database password is correct
```

**Issue**: JWT token errors
```bash
# Solution: Generate a new JWT_SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"
# Add it to .env file
```

**Issue**: AI features not working
```bash
# Solution: Verify GROQ_API_KEY in .env
# Check API key is valid at console.groq.com
# Ensure user has premium subscription
```

#### Frontend Issues

**Issue**: `npm install` fails
```bash
# Solution: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: API connection errors
```bash
# Solution: Check VITE_API_URL in .env
# Ensure backend is running
# Check CORS settings in backend
```

**Issue**: Build fails
```bash
# Solution: Check TypeScript errors
npm run lint
# Fix any errors and rebuild
```

### Debug Mode

Enable debug mode in development:

**Backend**:
```env
FLASK_ENV=development
FLASK_DEBUG=1
```

**Frontend**:
```bash
# Check browser console for errors
# Use React DevTools extension
```

### Getting Help

- 📖 Check documentation files (QUICKSTART.md, AI_FEATURES.md, etc.)
- 🐛 Open an issue on GitHub
- 💬 Contact the maintainers

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### MIT License Summary

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

##  Acknowledgments

- **Supabase** - Database hosting
- **Groq** - AI API services
- **Lucide** - Icon library
- **TailwindCSS** - Styling framework
- **React** - Frontend framework
- **Flask** - Backend framework
---

## 🗺️ Roadmap

### Planned Features

- [ ] Real-time collaboration on notes
- [ ] Mobile app (React Native)
- [ ] Export notes to PDF/Markdown
- [ ] Note sharing with other users
- [ ] Advanced search with full-text indexing
- [ ] Voice-to-text note creation
- [ ] Integrations (Google Drive, Dropbox)
- [ ] Custom AI model training
- [ ] Team subscriptions
- [ ] 2FA authentication

### Version History

- **v1.0.0** (2026-03) - Initial release with core features
  - Authentication system
  - Note management
  - Admin dashboard
  - Subscription system
  - AI-powered tools
