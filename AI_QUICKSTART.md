# Quick Setup for AI Features

Follow these steps to enable AI features in your Note Management app:

## 1. Get Groq API Key

1. Visit: https://console.groq.com
2. Sign up for free
3. Create an API key (no credit card required)
4. Copy the API key

## 2. Configure Backend

Add to `backend/.env`:
```bash
GROQ_API_KEY=your_api_key_here
```

## 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 4. Run Database Migration

```bash
cd backend
python migrate_ai_usage.py
```

## 5. Start Services

**Backend:**
```bash
cd backend
python run.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 6. Test AI Features

1. Log in to your account
2. Upgrade to Premium (if not already)
3. Create or edit a note
4. Write some content
5. Click any AI tool in the right panel

## That's it! 🎉

You now have:
- ✅ AI-powered summarization
- ✅ Key points extraction
- ✅ Flashcard generation
- ✅ Quiz generation
- ✅ Text improvement
- ✅ Note transformation
- ✅ 45 requests per day (per premium user)
- ✅ Usage tracking and display

For detailed documentation, see [AI_FEATURES.md](AI_FEATURES.md)
