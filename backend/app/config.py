import os
from dotenv import load_dotenv

# Load .env file if it exists (for local development)
# In production (Vercel), environment variables are set in the dashboard
load_dotenv()

class Config:
    """Application configuration"""
    # SQLAlchemy configuration for PostgreSQL database
    database_url = os.getenv('DATABASE_URL', '')
    
    # Vercel Postgres URLs start with 'postgres://', but SQLAlchemy 1.4+ requires 'postgresql://'
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    # For serverless, database URL is required
    if not database_url:
        print("ERROR: DATABASE_URL environment variable is not set!")
    
    SQLALCHEMY_DATABASE_URI = database_url or 'sqlite:///fallback.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_HOURS = 24
    FLASK_ENV = os.getenv('FLASK_ENV', 'production')
    
    # CORS Configuration
    CORS_ORIGINS = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://note-management-zeta.vercel.app',
    ]
    CORS_SUPPORTS_CREDENTIALS = True
