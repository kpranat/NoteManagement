from flask import Flask, request
from flask_cors import CORS
from app.config import Config
from app.extensions import db

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    
    # Enable CORS with simple configuration
    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:5173", 
                "http://127.0.0.1:5173",
                "https://note-management-zeta.vercel.app",
                # Allow all Vercel preview deployments with regex pattern
                r"https://.*\.vercel\.app"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    }, automatic_options=True, supports_credentials=True)
    
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
        """Health check endpoint"""
        return {
            'status': 'ok',
            'message': 'Server is running'
        }, 200
    
    @app.route('/', methods=['GET'])
    def root():
        """Root endpoint"""
        return {
            'message': 'Note Management API',
            'version': '1.0',
            'health': '/api/health',
            'docs': 'See README.md for API documentation'
        }, 200
    
    @app.errorhandler(404)
    def not_found(e):
        """Handle 404 errors"""
        return {
            'error': 'Not Found',
            'message': 'The requested URL was not found on the server.'
        }, 404
    
    @app.errorhandler(500)
    def internal_error(e):
        """Handle 500 errors"""
        return {
            'error': 'Internal Server Error',
            'message': 'An internal server error occurred.'
        }, 500
    
    return app
