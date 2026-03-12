"""
Database initialization script for production environments.
Run this once after deployment to create all database tables.

Usage:
    python init_db.py

Make sure DATABASE_URL environment variable is set before running.
"""
import os
import sys
from app import create_app
from app.extensions import db

def init_database():
    """Initialize database tables"""
    try:
        app = create_app()
        
        with app.app_context():
            print("Creating database tables...")
            db.create_all()
            print("✓ Database tables created successfully!")
            
            # Verify tables were created
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"\nCreated tables: {', '.join(tables)}")
            
            return True
            
    except Exception as e:
        print(f"✗ Error initializing database: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    if not os.getenv('DATABASE_URL'):
        print("ERROR: DATABASE_URL environment variable is not set!", file=sys.stderr)
        sys.exit(1)
    
    success = init_database()
    sys.exit(0 if success else 1)
