"""
Quick diagnostic script to test app initialization and configuration.
Run this locally to verify your setup before deploying.

Usage:
    python diagnose.py

Set DATABASE_URL and other env vars before running.
"""
import os
import sys

print("=" * 60)
print("Note Management API - Diagnostic Tool")
print("=" * 60)
print()

# Check environment variables
print("1. Checking Environment Variables...")
print("-" * 60)

database_url = os.getenv('DATABASE_URL')
jwt_secret = os.getenv('JWT_SECRET_KEY')
groq_key = os.getenv('GROQ_API_KEY')

print(f"   DATABASE_URL: {'✓ SET' if database_url else '✗ NOT SET'}")
if database_url:
    # Don't print the full URL for security
    if database_url.startswith('postgres://'):
        print(f"   ⚠️  WARNING: URL starts with 'postgres://' (should be 'postgresql://')")
    elif database_url.startswith('postgresql://'):
        print(f"   ✓ URL format correct (postgresql://)")
    
print(f"   JWT_SECRET_KEY: {'✓ SET' if jwt_secret else '✗ NOT SET'}")
if jwt_secret and jwt_secret == 'your-secret-key-change-in-production':
    print(f"   ⚠️  WARNING: Using default JWT secret (insecure!)")
    
print(f"   GROQ_API_KEY: {'✓ SET' if groq_key else '○ NOT SET (optional)'}")
print()

if not database_url:
    print("✗ CRITICAL: DATABASE_URL is required!")
    print("Set it with: $env:DATABASE_URL='your_database_url'")
    sys.exit(1)

if not jwt_secret:
    print("✗ CRITICAL: JWT_SECRET_KEY is required!")
    print("Set it with: $env:JWT_SECRET_KEY='your_secret_key'")
    sys.exit(1)

# Test config loading
print("2. Testing Configuration...")
print("-" * 60)
try:
    from app.config import Config
    print("   ✓ Config loaded successfully")
    print(f"   Database URI set: {bool(Config.SQLALCHEMY_DATABASE_URI)}")
    print(f"   JWT Secret set: {bool(Config.JWT_SECRET_KEY)}")
    print()
except Exception as e:
    print(f"   ✗ Config loading failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test database connection
print("3. Testing Database Connection...")
print("-" * 60)
try:
    from sqlalchemy import create_engine
    
    # Fix URL if needed
    db_url = database_url
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
    
    engine = create_engine(db_url)
    connection = engine.connect()
    connection.close()
    print("   ✓ Database connection successful")
    print()
except Exception as e:
    print(f"   ✗ Database connection failed: {e}")
    print()
    print("   Possible issues:")
    print("   - Database server not running")
    print("   - Incorrect credentials")
    print("   - Network/firewall blocking connection")
    print("   - Missing SSL requirements")
    print()
    sys.exit(1)

# Test app initialization
print("4. Testing Flask App Initialization...")
print("-" * 60)
try:
    from app import create_app
    app = create_app()
    print("   ✓ Flask app created successfully")
    print(f"   Registered blueprints: {len(app.blueprints)}")
    print(f"   Registered routes: {len(list(app.url_map.iter_rules()))}")
    print()
except Exception as e:
    print(f"   ✗ App initialization failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test database tables
print("5. Checking Database Tables...")
print("-" * 60)
try:
    from app.extensions import db
    with app.app_context():
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        if tables:
            print(f"   ✓ Found {len(tables)} tables:")
            for table in tables:
                print(f"     - {table}")
        else:
            print("   ⚠️  No tables found!")
            print("   Run: python init_db.py")
        print()
except Exception as e:
    print(f"   ✗ Failed to check tables: {e}")
    print()

# Test Groq client
print("6. Testing Groq AI Client...")
print("-" * 60)
try:
    from groq import Groq
    if groq_key:
        groq_client = Groq(api_key=groq_key)
        print("   ✓ Groq client initialized")
    else:
        print("   ○ Groq API key not set (AI features will be unavailable)")
    print()
except Exception as e:
    print(f"   ⚠️  Groq initialization issue: {e}")
    print("   (AI features may not work)")
    print()

# Summary
print("=" * 60)
print("Diagnostic Summary")
print("=" * 60)
print()
print("✓ All critical checks passed!")
print()
print("Your app is ready to deploy to Vercel.")
print()
print("Next steps:")
print("1. Set environment variables in Vercel dashboard")
print("2. Push your code: git push")
print("3. Run database initialization: python init_db.py")
print("4. Test health endpoint: /api/health")
print()
