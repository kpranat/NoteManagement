from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db
import re

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
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Register blueprints
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
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'ok', 'message': 'Server is running'}, 200
    
    return app
