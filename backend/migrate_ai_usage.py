"""
Migration script to create the AI usage tracking table
Run this script to add the ai_usage table to your existing database.
"""

import os
import sys
from dotenv import load_dotenv
import psycopg2

# Load environment variables
load_dotenv()

# Database configuration from environment
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'notes_db'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres')
}

def create_ai_usage_table():
    """Create the ai_usage table"""
    
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS ai_usage (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        request_type VARCHAR(50) NOT NULL,
        request_date DATE NOT NULL DEFAULT CURRENT_DATE,
        request_count INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    
    -- Create index for better query performance
    CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date 
    ON ai_usage(user_id, request_date);
    
    CREATE INDEX IF NOT EXISTS idx_ai_usage_date 
    ON ai_usage(request_date);
    """
    
    try:
        # Connect to database
        print("Connecting to database...")
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Create table
        print("Creating ai_usage table...")
        cursor.execute(create_table_sql)
        conn.commit()
        
        print("✅ AI usage table created successfully!")
        print("✅ Indexes created for optimal performance!")
        
        # Verify table creation
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'ai_usage'
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        print("\nTable structure:")
        for col_name, col_type in columns:
            print(f"  - {col_name}: {col_type}")
        
        cursor.close()
        conn.close()
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Main migration function"""
    print("=" * 60)
    print("AI Usage Table Migration")
    print("=" * 60)
    print()
    
    # Check if database credentials are set
    if not os.getenv('DB_PASSWORD'):
        print("⚠️  Warning: DB_PASSWORD not set in environment variables")
        print("Please create a .env file with your database credentials")
        sys.exit(1)
    
    print(f"Database: {DB_CONFIG['database']}")
    print(f"Host: {DB_CONFIG['host']}")
    print(f"User: {DB_CONFIG['user']}")
    print()
    
    # Run migration
    success = create_ai_usage_table()
    
    print()
    print("=" * 60)
    if success:
        print("Migration completed successfully! ✅")
        print("You can now use the AI features with usage tracking.")
    else:
        print("Migration failed! ❌")
        print("Please check the error messages above.")
    print("=" * 60)


if __name__ == "__main__":
    main()
