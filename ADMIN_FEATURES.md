# Admin Role-Based Access Control

## Overview

The Note Management application now supports **role-based access control (RBAC)** with two roles:
- **user** - Regular users who can only manage their own notes
- **admin** - Administrators who can view all notes, delete any note, and access user statistics

## Features Implemented

### 1. User Roles
- Every user has a `role` field (default: `'user'`)
- Roles: `'user'` or `'admin'`
- Role is included in JWT tokens for authorization

### 2. Admin Capabilities

Admins can:
- ✅ View all notes from all users
- ✅ Delete any note (not just their own)
- ✅ View the number of registered users
- ✅ View detailed user statistics
- ✅ List all users with pagination
- ✅ Update user roles (promote/demote users)
- ✅ Access comprehensive system statistics

### 3. Regular User Restrictions

Regular users:
- ✅ Can only view their own notes
- ✅ Can only update their own notes
- ✅ Can only delete their own notes
- ❌ Cannot access admin endpoints
- ❌ Cannot view other users' notes

## API Endpoints

### Admin Notes Management

#### Get All Notes (All Users)
```http
GET /api/notes/admin/all
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK)**:
```json
{
  "notes": [
    {
      "id": "note-uuid",
      "user_id": "user-uuid",
      "title": "Note Title",
      "content": "Note content...",
      "tags": ["tag1", "tag2"],
      "created_at": "2026-03-12T10:00:00Z",
      "updated_at": "2026-03-12T10:00:00Z",
      "user": {
        "id": "user-uuid",
        "username": "johndoe",
        "email": "john@example.com"
      }
    }
  ],
  "count": 42
}
```

#### Delete Any Note (Admin)
```http
DELETE /api/notes/admin/<note_id>
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK)**:
```json
{
  "message": "Note deleted successfully by admin",
  "note_id": "note-uuid"
}
```

### Admin User Management

#### Get User Count
```http
GET /api/admin/users/count
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK)**:
```json
{
  "total_users": 150,
  "admin_users": 2,
  "regular_users": 148,
  "premium_users": 45,
  "free_users": 105
}
```

#### Get All Users
```http
GET /api/admin/users?page=1&per_page=20
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK)**:
```json
{
  "users": [
    {
      "id": "user-uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user",
      "subscription_plan": "premium",
      "subscription_status": "active",
      "note_count": 15,
      "created_at": "2026-01-15T08:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "per_page": 20,
  "pages": 8
}
```

#### Get System Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK)**:
```json
{
  "users": {
    "total": 150,
    "admins": 2,
    "regular_users": 148,
    "premium_active": 45
  },
  "notes": {
    "total": 2340,
    "average_per_user": 15.6
  },
  "premium_access": {
    "total_accesses": 5678
  },
  "ai_usage": {
    "total_requests": 1234
  }
}
```

#### Update User Role
```http
PUT /api/admin/users/<user_id>/role
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "role": "admin"
}
```

**Response (200 OK)**:
```json
{
  "message": "User role updated successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "admin",
    ...
  }
}
```

## Error Responses

### Non-Admin Access
```json
{
  "error": "Admin access required",
  "message": "You do not have permission to access this resource"
}
```
**Status Code**: 403 Forbidden

### Invalid Token
```json
{
  "error": "Token is missing"
}
```
**Status Code**: 401 Unauthorized

## Setup & Migration

### 1. Run Database Migration

If you have existing users, run the migration script to add the `role` field:

```bash
cd backend
python migrate_role.py
```

This will:
- Add the `role` column to the users table
- Set all existing users to `'user'` role by default
- Display migration statistics

### 2. Create Your First Admin User

After migration, manually promote a user to admin:

**Option A: Using PostgreSQL/Supabase SQL Editor**
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Option B: Using Python**
```python
from app import create_app
from app.extensions import db
from app.models import User

app = create_app()
with app.app_context():
    user = User.query.filter_by(email='your-email@example.com').first()
    if user:
        user.role = 'admin'
        db.session.commit()
        print(f"✓ User {user.username} is now an admin")
```

### 3. Verify Admin Access

Login with your admin account and verify the JWT token includes the role:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "your-password"}'

# The response token will contain the admin role in the JWT payload
```

## Security Considerations

### Authentication
- All admin endpoints require valid JWT authentication
- Admin endpoints use the `@admin_required` decorator
- Tokens include the user's role for authorization

### Authorization
- Admin role is checked on every admin endpoint request
- Regular users receive 403 Forbidden when accessing admin routes
- Admins cannot remove their own admin role

### Audit Logging
- Admin actions are logged to console with details
- Example: `[ADMIN ACTION] Admin john deleted note 'Meeting Notes' owned by user 123`

## Testing

### Test Admin Endpoints

```bash
# 1. Create a regular user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "username": "regularuser", "password": "password123"}'

# 2. Try to access admin endpoint (should fail with 403)
curl -X GET http://localhost:5000/api/admin/users/count \
  -H "Authorization: Bearer <regular_user_token>"

# 3. Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin-password"}'

# 4. Access admin endpoint (should succeed)
curl -X GET http://localhost:5000/api/admin/users/count \
  -H "Authorization: Bearer <admin_token>"

# 5. View all notes as admin
curl -X GET http://localhost:5000/api/notes/admin/all \
  -H "Authorization: Bearer <admin_token>"

# 6. Delete any note as admin
curl -X DELETE http://localhost:5000/api/notes/admin/<note-id> \
  -H "Authorization: Bearer <admin_token>"
```

## Implementation Details

### Decorator Chain
Admin routes use two decorators in this order:
```python
@notes_bp.route('/admin/all', methods=['GET'])
@token_required
@admin_required
def get_all_notes_admin_route(current_user):
    # Admin logic here
    pass
```

1. `@token_required` - Validates JWT token and extracts user info
2. `@admin_required` - Checks if user has admin role

### Database Schema
```sql
-- Users table includes role field
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    -- ... other fields
);
```

## Roadmap / Future Enhancements

Optional features that could be added:
- [ ] Admin dashboard UI in frontend
- [ ] Bulk user operations
- [ ] User activity logs visible in admin panel
- [ ] Export user/note data to CSV
- [ ] Admin notification system
- [ ] Multi-level roles (e.g., moderator, super-admin)

## Summary

✅ **Role-based access control** is now fully implemented
✅ **Admin users** can manage all notes and view user statistics
✅ **Regular users** are restricted to their own notes
✅ **Secure authentication** with JWT tokens including role information
✅ **Comprehensive admin API** for user and system management
