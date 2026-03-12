from flask import request, jsonify
from app.subscription import subscription_bp
from app.models import User, AccessLog
from app.extensions import db
from app.auth.routes import token_required
from functools import wraps
from datetime import datetime, timedelta, timezone
import uuid


# ==================== Access Logging ====================

def log_premium_access(user_id, endpoint, method):
    """Log premium content access for analytics"""
    try:
        access_log = AccessLog(
            id=str(uuid.uuid4()),
            user_id=user_id,
            endpoint=endpoint,
            method=method,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
        
        db.session.add(access_log)
        db.session.commit()
        
        print(f"[PREMIUM ACCESS] User {user_id} accessed {method} {endpoint} from {request.remote_addr}")
    except Exception as e:
        db.session.rollback()
        print(f"Error logging premium access: {e}")


# ==================== Decorators ====================

def premium_required(f):
    """
    Decorator to require active premium subscription for protected routes.
    Must be used after token_required decorator.
    """
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        try:
            # Get user from database
            user = User.query.filter_by(id=current_user['user_id']).first()
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Check if user has active premium subscription
            if not user.has_active_premium():
                return jsonify({
                    'error': 'Premium subscription required',
                    'message': 'This feature requires an active Premium subscription. Please upgrade your account.',
                    'subscription_plan': user.subscription_plan,
                    'subscription_status': user.subscription_status
                }), 403
            
            # Log premium content access
            log_premium_access(
                user_id=user.id,
                endpoint=request.path,
                method=request.method
            )
            
            return f(current_user, *args, **kwargs)
        except Exception as e:
            print(f"Premium check error: {e}")
            return jsonify({'error': 'An error occurred checking subscription status'}), 500
    
    return decorated


# ==================== Helper Functions ====================

def upgrade_user_to_premium(user_id, duration_days=30):
    """Upgrade user from Free to Premium subscription"""
    try:
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return None
        
        now = datetime.now(timezone.utc)
        
        user.subscription_plan = 'premium'
        user.subscription_status = 'active'
        user.subscribed_at = now
        user.subscription_expires_at = now + timedelta(days=duration_days)
        
        db.session.commit()
        return user
    except Exception as e:
        db.session.rollback()
        print(f"Error upgrading user: {e}")
        return None


def get_user_subscription_info(user_id):
    """Get detailed subscription information for a user"""
    try:
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return None
        
        return {
            'user_id': user.id,
            'subscription_plan': user.subscription_plan,
            'subscription_status': user.subscription_status,
            'subscribed_at': user.subscribed_at.isoformat() if user.subscribed_at else None,
            'subscription_expires_at': user.subscription_expires_at.isoformat() if user.subscription_expires_at else None,
            'has_active_premium': user.has_active_premium(),
            'days_remaining': (user.subscription_expires_at - datetime.now(timezone.utc)).days if user.subscription_expires_at and user.has_active_premium() else 0
        }
    except Exception as e:
        print(f"Error getting subscription info: {e}")
        return None


# ==================== Routes ====================

@subscription_bp.route('/status', methods=['GET'])
@token_required
def get_subscription_status(current_user):
    """Get current user's subscription status - JWT required"""
    try:
        subscription_info = get_user_subscription_info(current_user['user_id'])
        
        if not subscription_info:
            return jsonify({'error': 'Failed to retrieve subscription information'}), 500
        
        return jsonify(subscription_info), 200
        
    except Exception as e:
        print(f"Error getting subscription status: {e}")
        return jsonify({'error': 'An error occurred'}), 500


@subscription_bp.route('/upgrade', methods=['POST'])
@token_required
def upgrade_subscription(current_user):
    """
    Upgrade user from Free to Premium subscription.
    Simulates a successful payment process.
    JWT required.
    """
    try:
        data = request.get_json() or {}
        duration_days = data.get('duration_days', 30)  # Default 30 days
        
        # Validate duration
        if duration_days not in [30, 90, 365]:
            duration_days = 30  # Default to monthly
        
        # Get current user
        user = User.query.filter_by(id=current_user['user_id']).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if already premium
        if user.has_active_premium():
            return jsonify({
                'message': 'You already have an active Premium subscription',
                'subscription': get_user_subscription_info(user.id)
            }), 200
        
        # Simulate payment processing
        print(f"[PAYMENT SIMULATION] Processing payment for user {user.id}")
        print(f"[PAYMENT SIMULATION] Amount: ${12 if duration_days == 30 else 30 if duration_days == 90 else 120}")
        print(f"[PAYMENT SIMULATION] Duration: {duration_days} days")
        print(f"[PAYMENT SIMULATION] Status: SUCCESS")
        
        # Upgrade user to premium
        upgraded_user = upgrade_user_to_premium(user.id, duration_days)
        
        if not upgraded_user:
            return jsonify({'error': 'Failed to upgrade subscription'}), 500
        
        subscription_info = get_user_subscription_info(upgraded_user.id)
        
        return jsonify({
            'message': 'Successfully upgraded to Premium subscription',
            'subscription': subscription_info,
            'payment_status': 'success'
        }), 200
        
    except Exception as e:
        print(f"Error upgrading subscription: {e}")
        return jsonify({'error': 'An error occurred during upgrade'}), 500


@subscription_bp.route('/cancel', methods=['POST'])
@token_required
def cancel_subscription(current_user):
    """Cancel premium subscription - JWT required"""
    try:
        user = User.query.filter_by(id=current_user['user_id']).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user has premium subscription
        if user.subscription_plan != 'premium':
            return jsonify({'message': 'You are currently on the Free plan'}), 200
        
        # Cancel subscription (will remain active until expiration)
        user.subscription_status = 'cancelled'
        db.session.commit()
        
        return jsonify({
            'message': 'Subscription cancelled. Premium features will remain active until expiration date.',
            'subscription': get_user_subscription_info(user.id)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error cancelling subscription: {e}")
        return jsonify({'error': 'An error occurred'}), 500


@subscription_bp.route('/access-logs', methods=['GET'])
@token_required
def get_access_logs(current_user):
    """Get user's premium access logs - JWT required"""
    try:
        # Get user
        user = User.query.filter_by(id=current_user['user_id']).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Only allow premium users to view their logs
        if not user.has_active_premium():
            return jsonify({'error': 'Premium subscription required'}), 403
        
        # Get limit from query params
        limit = request.args.get('limit', 50, type=int)
        limit = min(limit, 100)  # Max 100 records
        
        # Get access logs
        logs = AccessLog.query.filter_by(user_id=user.id).order_by(AccessLog.accessed_at.desc()).limit(limit).all()
        
        return jsonify({
            'logs': [log.to_dict() for log in logs],
            'count': len(logs)
        }), 200
        
    except Exception as e:
        print(f"Error getting access logs: {e}")
        return jsonify({'error': 'An error occurred'}), 500
