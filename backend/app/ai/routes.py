from flask import request, jsonify
from app.ai import ai_bp
from app.models import User, Note, AIUsage
from app.auth.routes import token_required
from app.subscription.routes import premium_required
from app.extensions import db
import os
from datetime import datetime, timezone
import uuid
from groq import Groq

# Initialize Groq client
GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')
try:
    groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
except Exception as e:
    print(f"Warning: Failed to initialize Groq client: {str(e)}")
    groq_client = None

# Daily AI request limit for premium users
DAILY_AI_LIMIT = 45

# ==================== Helper Functions ====================

def check_daily_limit(user_id):
    """Check if user has exceeded daily AI request limit"""
    today = datetime.now(timezone.utc).date()
    
    # Get total requests for today
    usage_records = AIUsage.query.filter_by(
        user_id=user_id,
        request_date=today
    ).all()
    
    total_requests = sum(record.request_count for record in usage_records)
    
    remaining = DAILY_AI_LIMIT - total_requests
    
    return {
        'allowed': remaining > 0,
        'used': total_requests,
        'remaining': max(0, remaining),
        'limit': DAILY_AI_LIMIT
    }


def track_ai_usage(user_id, request_type):
    """Track AI request usage"""
    today = datetime.now(timezone.utc).date()
    
    # Check if record exists for today and request type
    usage_record = AIUsage.query.filter_by(
        user_id=user_id,
        request_type=request_type,
        request_date=today
    ).first()
    
    if usage_record:
        usage_record.request_count += 1
    else:
        usage_record = AIUsage(
            id=str(uuid.uuid4()),
            user_id=user_id,
            request_type=request_type,
            request_date=today,
            request_count=1
        )
        db.session.add(usage_record)
    
    db.session.commit()


def call_groq_api(prompt, system_prompt="You are a helpful AI assistant for note-taking and productivity."):
    """Call Groq API with the given prompt"""
    if not groq_client:
        raise Exception("Groq API key not configured")
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=2048,
        )
        
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Groq API Error: {e}")
        raise Exception(f"AI service error: {str(e)}")


def clean_ai_response(text):
    """Clean markdown formatting and citations from AI response"""
    import re
    
    if not text:
        return text
    
    # Remove code blocks (``` or `)
    text = re.sub(r'```[\s\S]*?```', '', text)
    text = re.sub(r'`([^`]+)`', r'\1', text)
    
    # Remove bold formatting (**text** or __text__)
    text = re.sub(r'\*\*([^\*]+)\*\*', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    
    # Remove italic formatting (*text* or _text_)
    text = re.sub(r'\*([^\*]+)\*', r'\1', text)
    text = re.sub(r'_([^_]+)_', r'\1', text)
    
    # Convert headers to plain text (keep the text, remove #)
    text = re.sub(r'^#{1,6}\s+(.+)$', r'\1', text, flags=re.MULTILINE)
    
    # Remove links but keep the text [text](url) -> text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    
    # Remove image links ![alt](url)
    text = re.sub(r'!\[([^\]]*)\]\([^\)]+\)', r'\1', text)
    
    # Remove horizontal rules (---, ___, ***)
    text = re.sub(r'^[\*\-_]{3,}$', '', text, flags=re.MULTILINE)
    
    # Remove citations like [1], [2], etc.
    text = re.sub(r'\[\d+\]', '', text)
    
    # Remove remaining standalone asterisks and hashtags
    text = re.sub(r'(?<!\w)\*(?!\w)', '', text)
    text = re.sub(r'(?<!\w)#(?!\w)', '', text)
    
    # Clean up multiple newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Clean up extra spaces
    text = re.sub(r' {2,}', ' ', text)
    
    return text.strip()


# ==================== AI Feature Routes (Premium Only) ====================

@ai_bp.route('/usage', methods=['GET'])
@token_required
@premium_required
def get_ai_usage(current_user):
    """Get current AI usage statistics"""
    try:
        usage_info = check_daily_limit(current_user['user_id'])
        
        return jsonify({
            'status': 'success',
            'usage': usage_info
        }), 200
        
    except Exception as e:
        print(f"Error getting AI usage: {e}")
        return jsonify({'error': 'Failed to get usage information'}), 500


@ai_bp.route('/summarize', methods=['POST'])
@token_required
@premium_required
def ai_summarize(current_user):
    """
    AI-powered text summarization - Premium feature only.
    Requires active Premium subscription and JWT token.
    """
    try:
        # Check daily limit
        usage_info = check_daily_limit(current_user['user_id'])
        if not usage_info['allowed']:
            return jsonify({
                'error': 'Daily AI request limit reached',
                'usage': usage_info
            }), 429
        
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text content is required'}), 400
        
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        if len(text) > 10000:
            return jsonify({'error': 'Text is too long (max 10,000 characters)'}), 400
        
        # Call Groq API
        prompt = f"""Please provide a concise summary of the following text. 
Focus on the main points and key takeaways.

Text:
{text}

Provide your summary in a clear, organized format."""
        
        system_prompt = "You are an expert at summarizing text and extracting key information. Provide clear, concise summaries in plain text without markdown formatting, asterisks, or special characters."
        
        summary = call_groq_api(prompt, system_prompt)
        summary = clean_ai_response(summary)
        
        # Track usage
        track_ai_usage(current_user['user_id'], 'summarize')
        
        # Get updated usage info
        usage_info = check_daily_limit(current_user['user_id'])
        
        return jsonify({
            'status': 'success',
            'summary': summary,
            'original_length': len(text),
            'usage': usage_info
        }), 200
        
    except Exception as e:
        print(f"Error in AI summarization: {e}")
        return jsonify({'error': str(e) if 'AI service error' in str(e) else 'An error occurred during summarization'}), 500


@ai_bp.route('/extract-key-points', methods=['POST'])
@token_required
@premium_required
def ai_extract_key_points(current_user):
    """
    AI-powered key points extraction - Premium feature only.
    """
    try:
        # Check daily limit
        usage_info = check_daily_limit(current_user['user_id'])
        if not usage_info['allowed']:
            return jsonify({
                'error': 'Daily AI request limit reached',
                'usage': usage_info
            }), 429
        
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text content is required'}), 400
        
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Call Groq API
        prompt = f"""Extract the key points from the following text. 
List them as bullet points in a clear and organized manner.

Text:
{text}

Provide 5-8 key points that capture the essence of the content."""
        
        system_prompt = "You are an expert at analyzing text and extracting key points. Provide clear, actionable bullet points using simple dashes or numbers, without markdown formatting or special characters."
        
        key_points = call_groq_api(prompt, system_prompt)
        key_points = clean_ai_response(key_points)
        
        # Track usage
        track_ai_usage(current_user['user_id'], 'extract_key_points')
        
        # Get updated usage info
        usage_info = check_daily_limit(current_user['user_id'])
        
        return jsonify({
            'status': 'success',
            'key_points': key_points,
            'usage': usage_info
        }), 200
        
    except Exception as e:
        print(f"Error in key points extraction: {e}")
        return jsonify({'error': str(e) if 'AI service error' in str(e) else 'An error occurred during extraction'}), 500


@ai_bp.route('/generate-flashcards', methods=['POST'])
@token_required
@premium_required
def ai_generate_flashcards(current_user):
    """
    AI-powered flashcard generation - Premium feature only.
    """
    try:
        # Check daily limit
        usage_info = check_daily_limit(current_user['user_id'])
        if not usage_info['allowed']:
            return jsonify({
                'error': 'Daily AI request limit reached',
                'usage': usage_info
            }), 429
        
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text content is required'}), 400
        
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Call Groq API
        prompt = f"""Based on the following text, generate 5-10 flashcards for studying.
Each flashcard should have a question and an answer.

Text:
{text}

Format your response as:
Q: [Question]
A: [Answer]

Make sure the flashcards cover the most important concepts."""
        
        system_prompt = "You are an expert educator who creates effective study materials. Generate clear, focused flashcards in plain text without markdown formatting or special characters."
        
        flashcards = call_groq_api(prompt, system_prompt)
        flashcards = clean_ai_response(flashcards)
        
        # Track usage
        track_ai_usage(current_user['user_id'], 'generate_flashcards')
        
        # Get updated usage info
        usage_info = check_daily_limit(current_user['user_id'])
        
        return jsonify({
            'status': 'success',
            'flashcards': flashcards,
            'usage': usage_info
        }), 200
        
    except Exception as e:
        print(f"Error in flashcard generation: {e}")
        return jsonify({'error': str(e) if 'AI service error' in str(e) else 'An error occurred during generation'}), 500


@ai_bp.route('/generate-quiz', methods=['POST'])
@token_required
@premium_required
def ai_generate_quiz(current_user):
    """
    AI-powered quiz generation - Premium feature only.
    """
    try:
        # Check daily limit
        usage_info = check_daily_limit(current_user['user_id'])
        if not usage_info['allowed']:
            return jsonify({
                'error': 'Daily AI request limit reached',
                'usage': usage_info
            }), 429
        
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text content is required'}), 400
        
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Call Groq API
        prompt = f"""Based on the following text, create a quiz with 5-7 multiple choice questions.
Each question should have 4 options (A, B, C, D) with one correct answer.

Text:
{text}

Format your response as:
Question 1: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [Letter]

Make sure questions test understanding of key concepts."""
        
        system_prompt = "You are an expert educator who creates effective assessments. Generate clear, challenging quiz questions in plain text without markdown formatting or special characters."
        
        quiz = call_groq_api(prompt, system_prompt)
        quiz = clean_ai_response(quiz)
        
        # Track usage
        track_ai_usage(current_user['user_id'], 'generate_quiz')
        
        # Get updated usage info
        usage_info = check_daily_limit(current_user['user_id'])
        
        return jsonify({
            'status': 'success',
            'quiz': quiz,
            'usage': usage_info
        }), 200
        
    except Exception as e:
        print(f"Error in quiz generation: {e}")
        return jsonify({'error': str(e) if 'AI service error' in str(e) else 'An error occurred during generation'}), 500


@ai_bp.route('/rewrite-improve', methods=['POST'])
@token_required
@premium_required
def ai_rewrite_improve(current_user):
    """
    AI-powered text rewriting and improvement - Premium feature only.
    """
    try:
        # Check daily limit
        usage_info = check_daily_limit(current_user['user_id'])
        if not usage_info['allowed']:
            return jsonify({
                'error': 'Daily AI request limit reached',
                'usage': usage_info
            }), 429
        
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text content is required'}), 400
        
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Call Groq API
        prompt = f"""Please rewrite and improve the following text.
Make it clearer, more concise, and better structured while maintaining the original meaning.

Text:
{text}

Provide the improved version with better clarity, grammar, and flow."""
        
        system_prompt = "You are an expert editor and writer. Improve text while maintaining its original intent. Provide plain text output without markdown formatting or special characters."
        
        improved_text = call_groq_api(prompt, system_prompt)
        improved_text = clean_ai_response(improved_text)
        
        # Track usage
        track_ai_usage(current_user['user_id'], 'rewrite_improve')
        
        # Get updated usage info
        usage_info = check_daily_limit(current_user['user_id'])
        
        return jsonify({
            'status': 'success',
            'original': text,
            'improved': improved_text,
            'usage': usage_info
        }), 200
        
    except Exception as e:
        print(f"Error in text improvement: {e}")
        return jsonify({'error': str(e) if 'AI service error' in str(e) else 'An error occurred during improvement'}), 500


@ai_bp.route('/transform-note', methods=['POST'])
@token_required
@premium_required
def ai_transform_note(current_user):
    """
    AI-powered note transformation - Premium feature only.
    Transform notes into different formats (e.g., outline, essay, bullet points).
    """
    try:
        # Check daily limit
        usage_info = check_daily_limit(current_user['user_id'])
        if not usage_info['allowed']:
            return jsonify({
                'error': 'Daily AI request limit reached',
                'usage': usage_info
            }), 429
        
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text content is required'}), 400
        
        text = data.get('text', '')
        transform_type = data.get('transform_type', 'outline')  # outline, essay, bullets, formal
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Define transformation prompts
        transform_prompts = {
            'outline': 'Transform this into a well-structured outline with main points and sub-points.',
            'essay': 'Transform this into a cohesive essay with introduction, body paragraphs, and conclusion.',
            'bullets': 'Transform this into clear, concise bullet points.',
            'formal': 'Transform this into formal, professional writing suitable for business or academic contexts.',
        }
        
        transform_instruction = transform_prompts.get(transform_type, transform_prompts['outline'])
        
        # Call Groq API
        prompt = f"""{transform_instruction}

Original Text:
{text}

Provide the transformed version."""
        
        system_prompt = "You are an expert at transforming content into different formats while maintaining the core message. Provide plain text output without markdown formatting or special characters."
        
        transformed_text = call_groq_api(prompt, system_prompt)
        transformed_text = clean_ai_response(transformed_text)
        
        # Track usage
        track_ai_usage(current_user['user_id'], 'transform_note')
        
        # Get updated usage info
        usage_info = check_daily_limit(current_user['user_id'])
        
        return jsonify({
            'status': 'success',
            'original': text,
            'transformed': transformed_text,
            'transform_type': transform_type,
            'usage': usage_info
        }), 200
        
    except Exception as e:
        print(f"Error in note transformation: {e}")
        return jsonify({'error': str(e) if 'AI service error' in str(e) else 'An error occurred during transformation'}), 500
