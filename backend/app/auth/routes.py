from flask import request, jsonify
from app.auth import auth_bp
from app.models import User
from app.extensions import db
from app.config import Config
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import uuid


# ==================== Helper Functions ====================

def hash_password(password):
    """Hash a password using werkzeug security"""
    return generate_password_hash(password)


def verify_password(password_hash, password):
    """Verify a password against its hash"""
    return check_password_hash(password_hash, password)


def create_user(email, username, password):
    """Create a new user in database"""
    try:
        password_hash = hash_password(password)
        
        # Create new user with UUID
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            username=username,
            password_hash=password_hash
        )
        
        db.session.add(user)
        db.session.commit()
        
        return user
    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}")
        return None


def get_user_by_email(email):
    """Get user by email from database"""
    try:
        return User.query.filter_by(email=email).first()
    except Exception as e:
        print(f"Error getting user: {e}")
        return None


def get_user_by_username(username):
    """Get user by username from database"""
    try:
        return User.query.filter_by(username=username).first()
    except Exception as e:
        print(f"Error getting user: {e}")
        return None


def generate_auth_token(user):
    """Generate JWT token for the user"""
    payload = {
        'user_id': user.id,
        'email': user.email,
        'username': user.username,
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
    return token


def verify_auth_token(token):
    """Verify JWT token and return user data"""
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# ==================== Decorators ====================

def token_required(f):
    """Decorator to require JWT token for protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Verify token
            payload = verify_auth_token(token)
            if not payload:
                return jsonify({'error': 'Token is invalid or expired'}), 401
            
            current_user = payload
        except Exception as e:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated


# ==================== Routes ====================

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        
        if not email or not username or not password:
            return jsonify({'error': 'Email, username, and password are required'}), 400
        
        # Check if user already exists
        existing_user = get_user_by_email(email)
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        existing_username = get_user_by_username(username)
        if existing_username:
            return jsonify({'error': 'Username already taken'}), 409
        
        # Create new user
        user = create_user(email, username, password)
        if not user:
            return jsonify({'error': 'Failed to create user'}), 500
        
        # Generate JWT token
        token = generate_auth_token(user)
        
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'An error occurred during registration'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Get user by email
        user = get_user_by_email(email)
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Verify password
        if not verify_password(user.password_hash, password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate JWT token
        token = generate_auth_token(user)
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'An error occurred during login'}), 500


@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify_token(current_user):
    """Verify if token is valid"""
    return jsonify({
        'valid': True,
        'user': {
            'id': current_user['user_id'],
            'email': current_user['email'],
            'username': current_user['username']
        }
    }), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user info"""
    return jsonify({
        'user': {
            'id': current_user['user_id'],
            'email': current_user['email'],
            'username': current_user['username']
        }
    }), 200
