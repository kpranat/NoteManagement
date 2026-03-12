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
    role = db.Column(db.String(20), default='user', nullable=False)  # 'user' or 'admin'
    
    # Subscription fields
    subscription_plan = db.Column(db.String(20), default='free', nullable=False)  # 'free' or 'premium'
    subscription_status = db.Column(db.String(20), default='active', nullable=False)  # 'active', 'expired', 'cancelled'
    subscribed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    subscription_expires_at = db.Column(db.DateTime(timezone=True), nullable=True)
    
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def to_dict(self):
        """Convert user to dictionary (exclude password_hash)"""
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'role': self.role,
            'subscription_plan': self.subscription_plan,
            'subscription_status': self.subscription_status,
            'subscribed_at': self.subscribed_at.isoformat() if self.subscribed_at else None,
            'subscription_expires_at': self.subscription_expires_at.isoformat() if self.subscription_expires_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def has_active_premium(self):
        """Check if user has an active premium subscription"""
        if self.subscription_plan != 'premium':
            return False
        if self.subscription_status != 'active':
            return False
        if self.subscription_expires_at and self.subscription_expires_at < datetime.now(timezone.utc):
            return False
        return True


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


# ============================== AccessLog Table =====================================
class AccessLog(db.Model):
    """AccessLog model - tracks premium content access for analytics"""
    __tablename__ = 'access_logs'
    
    id = db.Column(db.String(36), primary_key=True, nullable=False)  # UUID as string
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    endpoint = db.Column(db.String(255), nullable=False)
    method = db.Column(db.String(10), nullable=False)  # GET, POST, etc.
    ip_address = db.Column(db.String(45), nullable=True)  # IPv4 or IPv6
    user_agent = db.Column(db.Text, nullable=True)
    accessed_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationship
    user = db.relationship('User', backref=db.backref('access_logs', lazy=True, cascade='all, delete-orphan'))
    
    def to_dict(self):
        """Convert access log to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'endpoint': self.endpoint,
            'method': self.method,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'accessed_at': self.accessed_at.isoformat() if self.accessed_at else None
        }


# ============================== AIUsage Table =====================================
class AIUsage(db.Model):
    """AIUsage model - tracks daily AI request usage per user"""
    __tablename__ = 'ai_usage'
    
    id = db.Column(db.String(36), primary_key=True, nullable=False)  # UUID as string
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    request_type = db.Column(db.String(50), nullable=False)  # summarize, enhance, flashcards, quiz, rewrite, transform
    request_date = db.Column(db.Date, nullable=False, default=lambda: datetime.now(timezone.utc).date())
    request_count = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationship
    user = db.relationship('User', backref=db.backref('ai_usage', lazy=True, cascade='all, delete-orphan'))
    
    def to_dict(self):
        """Convert AI usage to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'request_type': self.request_type,
            'request_date': self.request_date.isoformat() if self.request_date else None,
            'request_count': self.request_count,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
