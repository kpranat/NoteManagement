from flask import request, jsonify
from app.admin import admin_bp
from app.models import User, Note, AccessLog, AIUsage
from app.extensions import db
from app.auth.routes import token_required, admin_required
from datetime import datetime, timezone
from sqlalchemy import func


# ==================== Admin Statistics Routes ====================

@admin_bp.route('/users/count', methods=['GET'])
@token_required
@admin_required
def get_users_count(current_user):
    """Get total number of registered users - Admin only"""
    try:
        total_users = User.query.count()
        admin_count = User.query.filter_by(role='admin').count()
        regular_users = User.query.filter_by(role='user').count()
        premium_users = User.query.filter_by(subscription_plan='premium').count()
        free_users = User.query.filter_by(subscription_plan='free').count()
        
        return jsonify({
            'total_users': total_users,
            'admin_users': admin_count,
            'regular_users': regular_users,
            'premium_users': premium_users,
            'free_users': free_users
        }), 200
        
    except Exception as e:
        print(f"Error getting user count: {e}")
        return jsonify({'error': 'An error occurred while fetching user statistics'}), 500


@admin_bp.route('/users', methods=['GET'])
@token_required
@admin_required
def get_all_users(current_user):
    """Get list of all users with their details - Admin only"""
    try:
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        per_page = min(per_page, 100)  # Max 100 per page
        
        # Query users with pagination
        users_pagination = User.query.order_by(User.created_at.desc()).paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        users_list = []
        for user in users_pagination.items:
            user_dict = user.to_dict()
            # Add note count
            note_count = Note.query.filter_by(user_id=user.id).count()
            user_dict['note_count'] = note_count
            users_list.append(user_dict)
        
        return jsonify({
            'users': users_list,
            'total': users_pagination.total,
            'page': users_pagination.page,
            'per_page': users_pagination.per_page,
            'pages': users_pagination.pages
        }), 200
        
    except Exception as e:
        print(f"Error getting users: {e}")
        return jsonify({'error': 'An error occurred while fetching users'}), 500


@admin_bp.route('/stats', methods=['GET'])
@token_required
@admin_required
def get_admin_stats(current_user):
    """Get comprehensive admin statistics - Admin only"""
    try:
        # User statistics
        total_users = User.query.count()
        admin_count = User.query.filter_by(role='admin').count()
        premium_users = User.query.filter_by(subscription_plan='premium', subscription_status='active').count()
        
        # Notes statistics
        total_notes = Note.query.count()
        
        # Access log statistics (last 30 days)
        total_access_logs = AccessLog.query.count()
        
        # AI usage statistics
        total_ai_requests = db.session.query(func.sum(AIUsage.request_count)).scalar() or 0
        
        return jsonify({
            'users': {
                'total': total_users,
                'admins': admin_count,
                'regular_users': total_users - admin_count,
                'premium_active': premium_users
            },
            'notes': {
                'total': total_notes,
                'average_per_user': round(total_notes / total_users, 2) if total_users > 0 else 0
            },
            'premium_access': {
                'total_accesses': total_access_logs
            },
            'ai_usage': {
                'total_requests': int(total_ai_requests)
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting admin stats: {e}")
        return jsonify({'error': 'An error occurred while fetching statistics'}), 500


@admin_bp.route('/users/<user_id>/role', methods=['PUT'])
@token_required
@admin_required
def update_user_role(current_user, user_id):
    """Update a user's role - Admin only"""
    try:
        data = request.get_json()
        
        if not data or 'role' not in data:
            return jsonify({'error': 'Role is required'}), 400
        
        new_role = data.get('role')
        
        if new_role not in ['user', 'admin']:
            return jsonify({'error': 'Invalid role. Must be "user" or "admin"'}), 400
        
        # Get user
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Prevent admin from removing their own admin role
        if user.id == current_user['user_id'] and new_role != 'admin':
            return jsonify({'error': 'You cannot remove your own admin role'}), 400
        
        old_role = user.role
        user.role = new_role
        db.session.commit()
        
        print(f"[ADMIN ACTION] Admin {current_user['username']} changed user {user.username} role from '{old_role}' to '{new_role}'")
        
        return jsonify({
            'message': f'User role updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating user role: {e}")
        return jsonify({'error': 'An error occurred while updating user role'}), 500
