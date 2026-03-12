"""Test database connection and display counts"""
from app import create_app
from app.extensions import db
from app.models import Note, User

app = create_app()

with app.app_context():
    # Create tables if they don't exist
    db.create_all()
    print("✅ Database tables created successfully!")
    
    # Count records
    users_count = User.query.count()
    notes_count = Note.query.count()
    
    print(f"\n📊 Database Status:")
    print(f"   Users: {users_count}")
    print(f"   Notes: {notes_count}")
    
    # Show recent notes
    if notes_count > 0:
        print(f"\n📝 Recent Notes:")
        notes = Note.query.order_by(Note.created_at.desc()).limit(5).all()
        for note in notes:
            print(f"   - {note.title} (by user {note.user_id[:8]}...)")
