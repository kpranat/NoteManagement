from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db
import re
import os

def is_allowed_origin(origin):
    """Check if the origin is allowed (production, preview, or localhost)"""
    if not origin:
        return False
    
    # Allow configured origins
    if origin in Config.CORS_ORIGINS:
        return True
    
    # Allow Vercel preview deployments (e.g., note-management-git-*.vercel.app)
    vercel_preview_pattern = r'^https://note-management-[a-zA-Z0-9-]+\.vercel\.app$'
    if re.match(vercel_preview_pattern, origin):
        return True
    
    return False

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    
    # Enable CORS with dynamic origin validation
    CORS(app, 
         resources={r"/api/*": {
             "origins": is_allowed_origin,
             "supports_credentials": Config.CORS_SUPPORTS_CREDENTIALS,
             "allow_headers": ["Content-Type", "Authorization"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
         }})
    
    # Import models before creating tables
    from app import models
    
    # Only create tables if explicitly requested (not in serverless environment)
    # For Vercel deployment, tables should be created via migration script
    # Uncomment below for local development initial setup:
    # with app.app_context():
    #     db.create_all()
    
    # Register blueprints with error handling
    try:
        from app.auth import auth_bp
        from app.notes import notes_bp
        from app.subscription import subscription_bp
        from app.ai import ai_bp
        from app.admin import admin_bp
        
        app.register_blueprint(auth_bp)
        app.register_blueprint(notes_bp)
        app.register_blueprint(subscription_bp)
        app.register_blueprint(ai_bp)
        app.register_blueprint(admin_bp)
    except Exception as e:
        print(f"Warning: Error registering blueprints: {str(e)}")
        import traceback
        traceback.print_exc()
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Enhanced health check with diagnostics"""
        status = {
            'status': 'ok',
            'message': 'Server is running',
            'environment': {
                'database_url_configured': bool(Config.SQLALCHEMY_DATABASE_URI and Config.SQLALCHEMY_DATABASE_URI != 'sqlite:///fallback.db'),
                'jwt_secret_configured': bool(Config.JWT_SECRET_KEY and Config.JWT_SECRET_KEY != 'your-secret-key-change-in-production'),
                'groq_configured': bool(os.getenv('GROQ_API_KEY'))
            }
        }
        
        # Try database connection
        try:
            db.engine.connect()
            status['database'] = 'connected'
        except Exception as e:
            status['database'] = f'error: {str(e)}'
            status['status'] = 'degraded'
        
        return status, 200 if status['status'] == 'ok' else 503
    
    @app.route('/', methods=['GET'])
    def root():
        """Root endpoint"""
        return {
            'message': 'Note Management API',
            'version': '1.0',
            'health': '/api/health',
            'docs': 'See README.md for API documentation'
        }, 200
    
    return app
