from flask import Blueprint

subscription_bp = Blueprint('subscription', __name__, url_prefix='/api/subscription')

from app.subscription import routes
