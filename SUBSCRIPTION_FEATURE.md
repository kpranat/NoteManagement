# Subscription Feature Documentation

This document explains how the subscription feature works in the Note Management application.

## Overview

The subscription feature enables a freemium model where:
- **Free users** have limited access to basic features
- **Premium users** get unlimited access to AI-powered features

## Backend Implementation

### 1. Database Models

#### User Model (app/models.py)
Added subscription fields to the User model:
- `subscription_plan`: 'free' or 'premium'
- `subscription_status`: 'active', 'expired', or 'cancelled'
- `subscribed_at`: When the subscription started
- `subscription_expires_at`: When the subscription expires
- `has_active_premium()`: Method to check if user has active premium

#### AccessLog Model (app/models.py)
Tracks premium content access for analytics:
- `user_id`: Who accessed the content
- `endpoint`: Which endpoint was accessed
- `method`: HTTP method (GET, POST, etc.)
- `ip_address`: User's IP address
- `user_agent`: Browser/client information
- `accessed_at`: Timestamp of access

### 2. Subscription Routes (app/subscription/routes.py)

#### Endpoints:

**GET /api/subscription/status**
- Returns current user's subscription information
- Requires JWT authentication
- Response includes plan, status, expiration date, days remaining

**POST /api/subscription/upgrade**
- Upgrades user from Free to Premium
- Simulates payment processing
- Accepts duration_days parameter (30, 90, or 365)
- Updates user's subscription status
- Requires JWT authentication

**POST /api/subscription/cancel**
- Cancels premium subscription
- Subscription remains active until expiration date
- Requires JWT authentication

**GET /api/subscription/access-logs**
- Returns user's premium access logs
- Only available to premium users
- Supports limit parameter (max 100)
- Requires JWT authentication

### 3. Premium Middleware (app/subscription/routes.py)

#### `@premium_required` Decorator
- Must be used after `@token_required`
- Checks if user has active premium subscription
- Logs premium content access automatically
- Returns 403 error if user doesn't have premium
- Includes subscription details in error response

Usage:
```python
@ai_bp.route('/summarize', methods=['POST'])
@token_required
@premium_required
def ai_summarize(current_user):
    # Only premium users can access this
    ...
```

### 4. Access Logging

Every premium route access is automatically logged with:
- User ID
- Endpoint path
- HTTP method
- IP address
- User agent (browser info)
- Timestamp

Console logs show:
```
[PREMIUM ACCESS] User {user_id} accessed {method} {endpoint} from {ip_address}
```

### 5. AI Features Routes (app/ai/routes.py)

Premium-only AI endpoints:

**POST /api/ai/summarize**
- AI-powered text summarization
- Input: `text` (string)
- Returns summary, word counts, metadata

**POST /api/ai/enhance**
- AI-powered content enhancement
- Input: `text` (string)
- Returns original and enhanced text with improvements

**POST /api/ai/suggest-tags**
- AI-powered tag suggestions
- Input: `text` (string)
- Returns suggested tags with confidence scores

**POST /api/ai/sentiment-analysis**
- AI-powered sentiment analysis
- Input: `text` (string)
- Returns sentiment (positive/neutral/negative) with scores

**POST /api/ai/generate-insights**
- AI-powered insights from notes
- Input: `note_id` (string)
- Returns themes, action items, related topics, scores

All AI routes require:
1. JWT token (`@token_required`)
2. Active premium subscription (`@premium_required`)

### 6. JWT Token Enhancement

JWT tokens now include subscription information:
- `subscription_plan`: User's current plan
- `subscription_status`: Subscription status
- `has_active_premium`: Boolean flag for quick checks

This allows frontend to make decisions without additional API calls.

### 7. Payment Simulation

The upgrade endpoint simulates payment processing:
```
[PAYMENT SIMULATION] Processing payment for user {user_id}
[PAYMENT SIMULATION] Amount: $12 (for 30 days)
[PAYMENT SIMULATION] Duration: 30 days
[PAYMENT SIMULATION] Status: SUCCESS
```

In production, this would integrate with Stripe, PayPal, or other payment processors.

## Frontend Implementation

### 1. Subscription Service (lib/subscriptionService.ts)

Provides methods for:
- `getStatus()`: Get subscription status
- `upgrade(durationDays)`: Upgrade to premium
- `cancel()`: Cancel subscription
- `getAccessLogs(limit)`: Get access logs

AI Service methods:
- `summarize(text)`
- `enhance(text)`
- `suggestTags(text)`
- `analyzeSentiment(text)`
- `generateInsights(noteId)`

### 2. Auth Context Updates (contexts/AuthContext.tsx)

Added to AuthContext:
- `isPremium`: Boolean indicating premium status
- `refreshSubscription()`: Method to refresh subscription data

The context automatically refreshes subscription status on login.

### 3. User Interface Updates (lib/authService.ts)

User interface now includes subscription fields:
- `subscription_plan`
- `subscription_status`
- `subscribed_at`
- `subscription_expires_at`

### 4. Subscription Page (pages/Subscription.tsx)

Features:
- Shows current subscription status
- Displays Free vs Premium plan comparison
- Upgrade button (disabled if already premium)
- Success/error messages
- Expiration date display
- Real-time status updates

### 5. AI Tools Panel (components/AIToolsPanel.tsx)

Premium integration:
- Shows lock icons on premium features for free users
- Redirects to subscription page when free users click AI tools
- Shows "Premium Active" badge for premium users
- Shows "Upgrade for unlimited access" for free users
- Handles API errors (including premium requirement errors)
- Displays processing state and results

## How to Test the Subscription Feature

### 1. Start the Backend
```bash
cd backend
python run.py
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Create a User Account
1. Navigate to Register page
2. Create an account (starts with Free plan)

### 4. Check Subscription Status
```bash
# Get auth token from localStorage after login
# Then test the subscription endpoint
curl -X GET http://localhost:5000/api/subscription/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "user_id": "...",
  "subscription_plan": "free",
  "subscription_status": "active",
  "has_active_premium": false,
  "days_remaining": 0
}
```

### 5. Try AI Features (Free User)
Click any AI tool in the sidebar:
- Should redirect to subscription page
- Shows premium requirement message

### 6. Upgrade to Premium
On the subscription page:
1. Click "Upgrade to Premium"
2. Watch console for payment simulation logs
3. Success message appears
4. Status updates to Premium

### 7. Test AI Features (Premium User)
Click any AI tool in the sidebar:
- Should see processing indicator
- Should see success message
- Should see result in console
- Access is logged in backend

### 8. Check Access Logs
```bash
curl -X GET http://localhost:5000/api/subscription/access-logs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "logs": [
    {
      "id": "...",
      "user_id": "...",
      "endpoint": "/api/ai/summarize",
      "method": "POST",
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0...",
      "accessed_at": "2026-03-12T..."
    }
  ],
  "count": 1
}
```

### 9. Test Premium Route Protection
Try accessing AI endpoint without premium:
```bash
# With free user token
curl -X POST http://localhost:5000/api/ai/summarize \
  -H "Authorization: Bearer FREE_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Test content"}'
```

Expected response (403):
```json
{
  "error": "Premium subscription required",
  "message": "This feature requires an active Premium subscription. Please upgrade your account.",
  "subscription_plan": "free",
  "subscription_status": "active"
}
```

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Premium Verification**: Premium routes check subscription status in real-time
3. **User Isolation**: Users can only access their own data
4. **Access Logging**: All premium access is logged for security auditing
5. **Expiration Checks**: Subscriptions are validated against expiration dates

## Analytics Capabilities

The access logs enable:
- Track premium feature usage
- Identify popular features
- Monitor user engagement
- Detect unusual access patterns
- Generate usage reports

## Future Enhancements

1. **Real Payment Integration**: Replace simulation with Stripe/PayPal
2. **Subscription Plans**: Add quarterly/annual plans with discounts
3. **Usage Metrics**: Track AI request counts and quotas
4. **Webhook Handlers**: Process payment provider webhooks
5. **Subscription History**: Track all subscription changes
6. **Cancellation Flow**: Add cancellation reasons and feedback
7. **Email Notifications**: Send expiration reminders
8. **Auto-Renewal**: Implement recurring payments
9. **Proration**: Handle mid-cycle upgrades/downgrades
10. **Team Plans**: Support organization subscriptions

## Key Files Modified/Created

### Backend:
- `app/models.py` - Added subscription fields and AccessLog model
- `app/subscription/__init__.py` - Subscription blueprint
- `app/subscription/routes.py` - Subscription endpoints and middleware
- `app/ai/__init__.py` - AI features blueprint
- `app/ai/routes.py` - Premium AI feature endpoints
- `app/auth/routes.py` - Updated JWT token generation
- `app/__init__.py` - Registered new blueprints

### Frontend:
- `lib/subscriptionService.ts` - Subscription and AI API client
- `lib/authService.ts` - Updated User interface
- `contexts/AuthContext.tsx` - Added subscription state management
- `pages/Subscription.tsx` - Complete subscription UI
- `components/AIToolsPanel.tsx` - Premium-aware AI tools

## Environment Variables

No new environment variables required. Uses existing:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET_KEY` - Token signing
- `FLASK_ENV` - Environment mode

## Database Migration

Run the backend once to auto-create new tables:
```bash
cd backend
python run.py
```

This creates:
- New columns in `users` table
- New `access_logs` table

## Summary

The subscription feature is fully implemented with:
✅ User subscription management
✅ Premium route protection middleware
✅ Access logging for analytics
✅ Simulated payment processing
✅ Upgrade/cancel functionality
✅ Premium-only AI features
✅ Frontend integration with subscription awareness
✅ JWT token enhancements
✅ Complete API documentation
✅ Security and isolation

All requirements from the specification have been met!
