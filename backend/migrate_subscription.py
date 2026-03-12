"""
Database migration script to add subscription fields to users table
and create access_logs table
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def migrate_database():
    """Add subscription columns to users table and create access_logs table"""
    
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("Error: DATABASE_URL not found in environment variables")
        return False
    
    try:
        # Connect to database
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("=" * 60)
        print("DATABASE MIGRATION - Adding Subscription Features")
        print("=" * 60)
        
        # 1. Add subscription columns to users table
        print("\n1. Adding subscription columns to users table...")
        
        subscription_columns = [
            ("subscription_plan", "VARCHAR(20) DEFAULT 'free' NOT NULL"),
            ("subscription_status", "VARCHAR(20) DEFAULT 'active' NOT NULL"),
            ("subscribed_at", "TIMESTAMP WITH TIME ZONE"),
            ("subscription_expires_at", "TIMESTAMP WITH TIME ZONE"),
        ]
        
        for column_name, column_type in subscription_columns:
            try:
                # Check if column exists
                cur.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='users' AND column_name=%s
                """, (column_name,))
                
                if cur.fetchone():
                    print(f"  ✓ Column '{column_name}' already exists")
                else:
                    # Add column
                    cur.execute(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}")
                    print(f"  ✓ Added column '{column_name}'")
            except Exception as e:
                print(f"  ✗ Error with column '{column_name}': {e}")
                conn.rollback()
                return False
        
        conn.commit()
        
        # 2. Create access_logs table
        print("\n2. Creating access_logs table...")
        
        try:
            # Check if table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'access_logs'
                )
            """)
            
            if cur.fetchone()[0]:
                print("  ✓ Table 'access_logs' already exists")
            else:
                # Create table
                cur.execute("""
                    CREATE TABLE access_logs (
                        id VARCHAR(36) PRIMARY KEY,
                        user_id VARCHAR(36) NOT NULL,
                        endpoint VARCHAR(255) NOT NULL,
                        method VARCHAR(10) NOT NULL,
                        ip_address VARCHAR(45),
                        user_agent TEXT,
                        accessed_at TIMESTAMP WITH TIME ZONE NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                """)
                print("  ✓ Created table 'access_logs'")
                
                # Create index for better query performance
                cur.execute("""
                    CREATE INDEX idx_access_logs_user_id ON access_logs(user_id)
                """)
                cur.execute("""
                    CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at)
                """)
                print("  ✓ Created indexes on 'access_logs'")
            
            conn.commit()
        except Exception as e:
            print(f"  ✗ Error creating access_logs table: {e}")
            conn.rollback()
            return False
        
        print("\n" + "=" * 60)
        print("MIGRATION COMPLETED SUCCESSFULLY")
        print("=" * 60)
        
        # Close connection
        cur.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        return False

if __name__ == "__main__":
    success = migrate_database()
    exit(0 if success else 1)
