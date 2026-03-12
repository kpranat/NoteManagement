import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    # SQLAlchemy configuration for PostgreSQL database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_HOURS = 24
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
