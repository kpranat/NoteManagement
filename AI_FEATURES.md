# AI Features Setup Guide

## Overview

The Note Management application now includes premium AI features powered by Groq API. Premium subscribers get **45 AI requests per day** across various AI-powered tools.

## AI Features Available

### 1. **Summarize Note** 📝
Generates a concise summary of your note content, focusing on main points and key takeaways.

### 2. **Extract Key Points** 🎯
Extracts 5-8 key points from your notes in a clear, bullet-point format.

### 3. **Generate Flashcards** 🃏
Creates study flashcards with questions and answers based on your note content.

### 4. **Generate Quiz** ❓
Generates a quiz with 5-7 multiple choice questions to test understanding of the material.

### 5. **Rewrite & Improve** ✨
Rewrites and improves your text for better clarity, grammar, and flow while maintaining the original meaning.

### 6. **Transform Note** 🔄
Transforms notes into different formats:
- **Outline**: Structured outline with main points and sub-points
- **Essay**: Cohesive essay format with introduction, body, and conclusion
- **Bullets**: Clear, concise bullet points
- **Formal**: Professional/academic writing style

## Setup Instructions

### Prerequisites

1. **Premium Subscription**: AI features require an active premium subscription
2. **Groq API Key**: You need a free API key from Groq

### Step 1: Get Your Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (you'll need it for the next step)

### Step 2: Configure Environment Variables

1. Navigate to the `backend` directory
2. Create or update your `.env` file:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secret
JWT_SECRET_KEY=your_secret_key_here

# Flask Environment
FLASK_ENV=development

# Groq API Key (Required for AI features)
GROQ_API_KEY=your_groq_api_key_here
```

3. Replace `your_groq_api_key_here` with the API key you copied from Groq

### Step 3: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install the Groq Python SDK along with other dependencies.

### Step 4: Run Database Migration

Run the AI usage table migration:

```bash
cd backend
python migrate_ai_usage.py
```

This creates the `ai_usage` table that tracks daily AI request usage for each user.

### Step 5: Start the Backend Server

```bash
cd backend
python run.py
```

### Step 6: Start the Frontend

```bash
cd frontend
npm run dev
```

## Usage

### Accessing AI Features

1. **Log in** to your account
2. **Upgrade to Premium** (if you haven't already)
3. **Create or edit a note**
4. The **AI Assistant panel** appears on the right side of the editor
5. Write your note content
6. Click any AI tool button to process your content

### Daily Usage Limits

- **Free Users**: No AI access
- **Premium Users**: 45 requests per day
- Usage counter is displayed at the top of the AI panel
- Resets daily at midnight UTC

### Usage Counter

The AI Assistant panel shows:
- **Used**: Number of requests used today
- **Limit**: Total daily limit (45)
- **Remaining**: Requests remaining for today
- **Progress Bar**: Visual representation of usage

## Technical Architecture

### Backend Structure

```
backend/
├── app/
│   ├── ai/
│   │   ├── __init__.py
│   │   └── routes.py          # AI endpoints with Groq integration
│   ├── models.py               # AIUsage model for tracking
│   └── ...
├── migrate_ai_usage.py         # Migration script
└── requirements.txt            # Dependencies (includes groq)
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── AIToolsPanel.tsx   # AI UI panel
│   ├── lib/
│   │   └── subscriptionService.ts  # AI API calls
│   └── pages/
│       └── NoteEditor.tsx      # Note editor with AI panel
```

### API Endpoints

All endpoints require:
- Valid JWT token (authentication)
- Active premium subscription
- Not exceeding daily limit

#### `GET /api/ai/usage`
Get current AI usage statistics

**Response:**
```json
{
  "status": "success",
  "usage": {
    "used": 5,
    "remaining": 40,
    "limit": 45,
    "allowed": true
  }
}
```

#### `POST /api/ai/summarize`
Summarize text content

**Request:**
```json
{
  "text": "Your note content here..."
}
```

**Response:**
```json
{
  "status": "success",
  "summary": "AI-generated summary...",
  "original_length": 500,
  "usage": { "used": 6, "remaining": 39, "limit": 45, "allowed": true }
}
```

#### `POST /api/ai/extract-key-points`
Extract key points from text

**Request:**
```json
{
  "text": "Your note content here..."
}
```

**Response:**
```json
{
  "status": "success",
  "key_points": "• Point 1\n• Point 2\n...",
  "usage": { ... }
}
```

#### `POST /api/ai/generate-flashcards`
Generate study flashcards

**Request:**
```json
{
  "text": "Your note content here..."
}
```

**Response:**
```json
{
  "status": "success",
  "flashcards": "Q: Question 1\nA: Answer 1\n\nQ: Question 2\nA: Answer 2\n...",
  "usage": { ... }
}
```

#### `POST /api/ai/generate-quiz`
Generate a quiz with multiple choice questions

**Request:**
```json
{
  "text": "Your note content here..."
}
```

**Response:**
```json
{
  "status": "success",
  "quiz": "Question 1: ...\nA) Option A\nB) Option B\n...",
  "usage": { ... }
}
```

#### `POST /api/ai/rewrite-improve`
Rewrite and improve text

**Request:**
```json
{
  "text": "Your note content here..."
}
```

**Response:**
```json
{
  "status": "success",
  "original": "Original text...",
  "improved": "Improved text...",
  "usage": { ... }
}
```

#### `POST /api/ai/transform-note`
Transform note into different format

**Request:**
```json
{
  "text": "Your note content here...",
  "transform_type": "outline"  // or "essay", "bullets", "formal"
}
```

**Response:**
```json
{
  "status": "success",
  "original": "Original text...",
  "transformed": "Transformed text...",
  "transform_type": "outline",
  "usage": { ... }
}
```

## Database Schema

### `ai_usage` Table

```sql
CREATE TABLE ai_usage (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    request_count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Indexes:**
- `idx_ai_usage_user_date` on `(user_id, request_date)`
- `idx_ai_usage_date` on `(request_date)`

## Groq API Configuration

### Model Used
- **Model**: `llama-3.3-70b-versatile`
- **Temperature**: 0.7
- **Max Tokens**: 2048

### Features
- Fast inference times (< 1 second typically)
- High-quality responses
- Free tier available (100 requests per minute)
- No credit card required for testing

## Troubleshooting

### "Groq API key not configured"
- Make sure `GROQ_API_KEY` is set in your `.env` file
- Restart the backend server after adding the key

### "Daily AI request limit reached"
- Wait until midnight UTC for the limit to reset
- Check your usage statistics in the AI panel

### "Premium subscription required"
- Upgrade to premium in the Subscription page
- Make sure your subscription is active

### AI responses are slow
- Groq API is typically very fast (< 1 second)
- Check your internet connection
- Verify Groq API status: https://status.groq.com

### "Failed to get AI usage"
- Make sure the database migration was run successfully
- Verify the `ai_usage` table exists in your database

## Cost Considerations

### Groq API (Free Tier)
- **Limit**: 100 requests per minute
- **Cost**: Free
- **Sufficient for**: Most personal use cases

With 45 requests per day per user, and assuming average usage:
- Free tier can support many users easily
- Monitor usage if scaling to many users

## Security Notes

1. **API Key Security**
   - Never commit your `.env` file to version control
   - Keep your Groq API key secret
   - Rotate API keys periodically

2. **Rate Limiting**
   - Backend enforces 45 requests/day per user
   - Groq enforces 100 requests/minute (free tier)
   - Consider implementing IP-based rate limiting for production

3. **Content Filtering**
   - Backend validates input length (max 10,000 characters)
   - Frontend validates content exists before sending
   - Consider adding content moderation for production

## Future Enhancements

Potential improvements:
- [ ] Different tier limits (basic: 20/day, premium: 45/day, pro: 100/day)
- [ ] AI-powered note recommendations
- [ ] Automatic tagging based on content
- [ ] Multi-language support
- [ ] Voice-to-text with AI enhancement
- [ ] Collaborative AI features
- [ ] AI usage analytics dashboard

## Support

For issues or questions:
1. Check this documentation first
2. Review error messages in browser console
3. Check backend logs for detailed error information
4. Verify all environment variables are set correctly

## References

- [Groq Documentation](https://console.groq.com/docs)
- [Groq Python SDK](https://github.com/groq/groq-python)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
