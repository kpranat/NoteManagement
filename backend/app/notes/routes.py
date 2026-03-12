from flask import request, jsonify
from app.notes import notes_bp
from app.models import Note, User
from app.extensions import db
from app.auth.routes import token_required
import uuid


# ==================== Helper Functions ====================

def create_note(user_id, title, content, tags=None):
    """Create a new note in database"""
    try:
        note = Note(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title=title,
            content=content,
            tags=tags if tags else []
        )
        
        db.session.add(note)
        db.session.commit()
        
        return note
    except Exception as e:
        db.session.rollback()
        print(f"Error creating note: {e}")
        return None


def get_user_notes(user_id):
    """Get all notes for a user"""
    try:
        notes = Note.query.filter_by(user_id=user_id).order_by(Note.updated_at.desc()).all()
        return notes
    except Exception as e:
        print(f"Error getting notes: {e}")
        return []


def get_note_by_id(note_id, user_id):
    """Get a specific note by ID for a user"""
    try:
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        return note
    except Exception as e:
        print(f"Error getting note: {e}")
        return None


def update_note(note_id, user_id, title=None, content=None, tags=None):
    """Update an existing note"""
    try:
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        if not note:
            return None
        
        if title is not None:
            note.title = title
        if content is not None:
            note.content = content
        if tags is not None:
            note.tags = tags
        
        db.session.commit()
        return note
    except Exception as e:
        db.session.rollback()
        print(f"Error updating note: {e}")
        return None


def delete_note(note_id, user_id):
    """Delete a note"""
    try:
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        if not note:
            return False
        
        db.session.delete(note)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting note: {e}")
        return False


# ==================== Routes ====================

@notes_bp.route('/', methods=['POST'])
@token_required
def create_note_route(current_user):
    """Create a new note - JWT required"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        title = data.get('title')
        content = data.get('content', '')
        tags = data.get('tags', [])
        
        if not title:
            return jsonify({'error': 'Title is required'}), 400
        
        # Create note
        note = create_note(current_user['user_id'], title, content, tags)
        if not note:
            return jsonify({'error': 'Failed to create note'}), 500
        
        return jsonify({
            'message': 'Note created successfully',
            'note': note.to_dict()
        }), 201
        
    except Exception as e:
        print(f"Create note error: {e}")
        return jsonify({'error': 'An error occurred while creating note'}), 500


@notes_bp.route('/', methods=['GET'])
@token_required
def get_notes_route(current_user):
    """Get all notes for the current user - JWT required"""
    try:
        notes = get_user_notes(current_user['user_id'])
        
        return jsonify({
            'notes': [note.to_dict() for note in notes],
            'count': len(notes)
        }), 200
        
    except Exception as e:
        print(f"Get notes error: {e}")
        return jsonify({'error': 'An error occurred while fetching notes'}), 500


@notes_bp.route('/<note_id>', methods=['GET'])
@token_required
def get_note_route(current_user, note_id):
    """Get a specific note by ID - JWT required"""
    try:
        note = get_note_by_id(note_id, current_user['user_id'])
        
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        return jsonify({
            'note': note.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Get note error: {e}")
        return jsonify({'error': 'An error occurred while fetching note'}), 500


@notes_bp.route('/<note_id>', methods=['PUT'])
@token_required
def update_note_route(current_user, note_id):
    """Update a note - JWT required"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        title = data.get('title')
        content = data.get('content')
        tags = data.get('tags')
        
        # Update note
        note = update_note(note_id, current_user['user_id'], title, content, tags)
        if not note:
            return jsonify({'error': 'Note not found or failed to update'}), 404
        
        return jsonify({
            'message': 'Note updated successfully',
            'note': note.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Update note error: {e}")
        return jsonify({'error': 'An error occurred while updating note'}), 500


@notes_bp.route('/<note_id>', methods=['DELETE'])
@token_required
def delete_note_route(current_user, note_id):
    """Delete a note - JWT required"""
    try:
        success = delete_note(note_id, current_user['user_id'])
        
        if not success:
            return jsonify({'error': 'Note not found or failed to delete'}), 404
        
        return jsonify({
            'message': 'Note deleted successfully'
        }), 200
        
    except Exception as e:
        print(f"Delete note error: {e}")
        return jsonify({'error': 'An error occurred while deleting note'}), 500
