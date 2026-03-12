from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
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
