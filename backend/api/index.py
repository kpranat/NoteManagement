import os
import sys
from app import create_app

# Add error handling for serverless environment
try:
    # Create the Flask app instance for Vercel
    app = create_app()
    
    # Debug logging (will appear in Vercel logs)
    print("=" * 60, file=sys.stderr)
    print("🚀 Flask app created successfully", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    print(f"📦 Database URL configured: {'✓ Yes' if os.getenv('DATABASE_URL') else '✗ No (WARNING!)'}", file=sys.stderr)
    print(f"🔑 JWT Secret configured: {'✓ Yes' if os.getenv('JWT_SECRET_KEY') else '✗ No (WARNING!)'}", file=sys.stderr)
    print(f"🤖 Groq API Key configured: {'✓ Yes' if os.getenv('GROQ_API_KEY') else '✗ No (AI features disabled)'}", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    
except Exception as e:
    print("=" * 60, file=sys.stderr)
    print(f"❌ Error creating Flask app: {str(e)}", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)
    
    # Create a minimal error app
    from flask import Flask, jsonify
    app = Flask(__name__)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return jsonify({
            'error': 'Application initialization failed',
            'message': str(e),
            'hint': 'Check Vercel logs and environment variables (DATABASE_URL, JWT_SECRET_KEY, GROQ_API_KEY)',
            'path': path
        }), 500

# Vercel will use this app instance
