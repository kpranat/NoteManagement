from .extensions import db
from datetime import datetime, timezone

# ============================== User Table =====================================
class User(db.Model):
    """User model - represents the users table structure"""
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, nullable=False)  # UUID as string
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def to_dict(self):
        """Convert user to dictionary (exclude password_hash)"""
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


# ============================== Notes Table =====================================
class Note(db.Model):
    """Note model - represents the notes table structure"""
    __tablename__ = 'notes'
    
    id = db.Column(db.String(36), primary_key=True, nullable=False)  # UUID as string
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text)
    tags = db.Column(db.ARRAY(db.String))  # PostgreSQL array type
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationship
    user = db.relationship('User', backref=db.backref('notes', lazy=True, cascade='all, delete-orphan'))
    
    def to_dict(self):
        """Convert note to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'tags': self.tags,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
