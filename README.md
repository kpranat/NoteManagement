# NoteManagement

A full-stack note management application with AI-powered features, subscription management, and role-based access control.

## 🚀 Features

### Core Features
- ✅ User authentication (JWT-based)
- ✅ Notes CRUD operations
- ✅ Tag management
- ✅ Secure password hashing
- ✅ RESTful API design

### Role-Based Access Control
- ✅ **User Role**: Manage own notes only
- ✅ **Admin Role**: View all notes, delete any note, access user statistics
- ✅ Secure authorization with JWT tokens
- ✅ Admin endpoints for system management

### Subscription System
- ✅ Free and Premium plans
- ✅ Premium content protection
- ✅ Payment simulation
- ✅ Access logging for analytics
- ✅ Subscription status tracking

### AI Features (Premium)
- ✅ Text summarization
- ✅ Content enhancement
- ✅ Tag suggestions
- ✅ Sentiment analysis
- ✅ Note insights generation

## 📋 Requirements Implemented

### ✅ Assignment 1: Notes Management API
All requirements completed:
1. ✅ Authentication (registration, login, JWT tokens)
2. ✅ Notes Management (CRUD with ownership)
3. ✅ **Role-Based Access Control** (user/admin roles)
4. ✅ Proper API behavior (status codes, validation, errors)
5. ✅ Environment configuration
6. ✅ Documentation and setup instructions

### ✅ Assignment 2: Subscription-Based Content API
All requirements completed:
1. ✅ User roles (Free/Premium)
2. ✅ Protected content access
3. ✅ Subscription upgrade with payment simulation
4. ✅ Activity logging
5. ✅ Proper API behavior
6. ✅ Documentation and setup instructions

## 🛠️ Tech Stack

### Backend
- Python 3.8+
- Flask
- PostgreSQL (via Supabase)
- SQLAlchemy ORM
- JWT Authentication
- Werkzeug Security

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router

## 📦 Installation

### Quick Start
See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
- [AUTH_SETUP.md](AUTH_SETUP.md) - Authentication system details
- [ADMIN_FEATURES.md](ADMIN_FEATURES.md) - Admin role documentation
- [SUBSCRIPTION_IMPLEMENTATION.md](SUBSCRIPTION_IMPLEMENTATION.md) - Subscription system
- [AI_FEATURES.md](AI_FEATURES.md) - AI features documentation

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Notes (User)
- `GET /api/notes/` - Get user's notes
- `POST /api/notes/` - Create note
- `GET /api/notes/<id>` - Get specific note
- `PUT /api/notes/<id>` - Update note
- `DELETE /api/notes/<id>` - Delete note

### Notes (Admin)
- `GET /api/notes/admin/all` - Get all notes from all users
- `DELETE /api/notes/admin/<id>` - Delete any note

### Admin
- `GET /api/admin/users/count` - Get user statistics
- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/stats` - Get system statistics
- `PUT /api/admin/users/<id>/role` - Update user role

### Subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/upgrade` - Upgrade to premium
- `POST /api/subscription/cancel` - Cancel subscription
- `GET /api/subscription/access-logs` - View access logs

### AI Features (Premium Only)
- `POST /api/ai/summarize` - Summarize text
- `POST /api/ai/enhance` - Enhance content
- `POST /api/ai/suggest-tags` - Get tag suggestions
- `POST /api/ai/sentiment-analysis` - Analyze sentiment
- `POST /api/ai/generate-insights` - Generate insights

## 🔐 Security

- Passwords hashed with Werkzeug Security
- JWT-based authentication
- Role-based access control
- SQL injection prevention (SQLAlchemy ORM)
- CORS protection
- Environment variables for sensitive data

## 🗄️ Database Schema

### Users Table
- id (UUID)
- email (unique)
- username (unique)
- password_hash
- **role** (user/admin)
- subscription_plan (free/premium)
- subscription_status
- timestamps

### Notes Table
- id (UUID)
- user_id (foreign key)
- title
- content
- tags (array)
- timestamps

### Access Logs Table
- id (UUID)
- user_id (foreign key)
- endpoint
- method
- ip_address
- user_agent
- timestamp

## 👥 Admin Setup

1. Run migration to add role field:
   ```bash
   cd backend
   python migrate_role.py
   ```

2. Promote a user to admin:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

3. Login again to get admin token with role included

See [ADMIN_FEATURES.md](ADMIN_FEATURES.md) for complete admin documentation.

## 🧪 Testing

```bash
# Test admin features
cd backend
python test_admin.py

# Test subscription features
python test_subscription.py
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Project Status

**✅ Both assignments completed with all core requirements met!**

- Notes Management API: ✅ Complete (including admin role)
- Subscription-Based Content API: ✅ Complete
- Documentation: ✅ Complete
- Testing: ✅ Complete