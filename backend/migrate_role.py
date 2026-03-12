"""
Database Migration Script: Add Role Field to Users
===================================================

This script migrates the users table to add the 'role' field.
All existing users will be assigned the 'user' role by default.

Run this after updating the User model with the role field.
"""

from app import create_app
from app.extensions import db
from app.models import User
from sqlalchemy import text

def migrate_add_role_field():
    """Add role field to existing users table"""
    app = create_app()
    
    with app.app_context():
        try:
            print("Starting migration: Add role field to users table")
            print("=" * 60)
            
            # Check if role column exists
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('users')]
            
            if 'role' in columns:
                print("✓ Role column already exists")
            else:
                print("Adding role column...")
                # Add role column with default value
                db.session.execute(text(
                    "ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' NOT NULL"
                ))
                db.session.commit()
                print("✓ Role column added successfully")
            
            # Update any NULL values to 'user' (just in case)
            result = db.session.execute(text(
                "UPDATE users SET role = 'user' WHERE role IS NULL"
            ))
            db.session.commit()
            
            if result.rowcount > 0:
                print(f"✓ Updated {result.rowcount} users with default 'user' role")
            
            # Get statistics
            total_users = User.query.count()
            admin_users = User.query.filter_by(role='admin').count()
            regular_users = User.query.filter_by(role='user').count()
            
            print("\nMigration Summary:")
            print("=" * 60)
            print(f"Total users: {total_users}")
            print(f"Admin users: {admin_users}")
            print(f"Regular users: {regular_users}")
            print("\n✅ Migration completed successfully!")
            print("\nNote: To create an admin user, update a user's role manually:")
            print("UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Migration failed: {e}")
            raise

if __name__ == '__main__':
    migrate_add_role_field()
