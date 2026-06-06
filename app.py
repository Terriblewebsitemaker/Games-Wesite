import flask
from flask import Flask, render_template, request, session, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from socketio import WSGIApp
import sqlite3
import os
import gzip
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.secret_key = 'your-secret-key-here-change-in-production'
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000  # Cache static assets for one year

# Initialize SocketIO with long-polling only (for PythonAnywhere free tier)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading', transports=['polling'])

# Expose a WSGI application object for PythonAnywhere deployment.
# PythonAnywhere web apps typically use the `application` variable in the WSGI file.
application = WSGIApp(socketio.server, app)

# Database configuration: use absolute path to avoid current-directory issues on PythonAnywhere.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'chat.db')

def get_db():
    """Get database connection"""
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    """Initialize the chat database"""
    db = get_db()
    db.execute('''
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            avatar TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    db.commit()
    db.close()

def get_recent_messages(limit=20):
    """Get the most recent chat messages"""
    db = get_db()
    cursor = db.execute(
        'SELECT id, username, avatar, message, timestamp FROM chat_messages ORDER BY id DESC LIMIT ?',
        (limit,)
    )
    messages = [dict(row) for row in cursor.fetchall()]
    db.close()
    # Return in ascending order (oldest first)
    return list(reversed(messages))

def save_message(username, avatar, message):
    """Save a chat message to the database"""
    db = get_db()
    timestamp = datetime.utcnow().isoformat() + 'Z'
    db.execute(
        'INSERT INTO chat_messages (username, avatar, message, timestamp) VALUES (?, ?, ?, ?)',
        (username, avatar, message, timestamp)
    )
    db.commit()
    db.close()
    return timestamp

# Initialize database on startup
init_db()

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")


@app.route("/python-course")
def python_course():
    return render_template("python-course.html")


@app.route("/design-fundamentals")
def design_fundamentals():
    return render_template("design-fundamentals.html")


@app.route("/practice-challenges")
def practice_challenges():
    return render_template("practice-challenges.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    success = False

    if request.method == "POST":
        password = request.form.get("password", "").strip()
        if password == "ampro":
            success = True
            # Set session for pro access
            session['authenticated'] = True
        else:
            error = "Invalid password. Please try again."

    return render_template("login.html", error=error, success=success)


@app.route('/pro')
def pro():
    # Get username from session or generate a random one
    username = session.get('username')
    if not username:
        # Generate a random username for this session
        import random
        adjectives = ['Happy', 'Cool', 'Brave', 'Swift', 'Clever', 'Bold', 'Epic', 'Pro']
        nouns = ['Gamer', 'Player', 'User', 'Ninja', 'Hero', 'Star', 'Ace', 'Champ']
        username = f"{random.choice(adjectives)}{random.choice(nouns)}{random.randint(1, 999)}"
        session['username'] = username
    
    return render_template('pro.html', username=username)


# API endpoint to get recent chat messages
@app.route('/api/chat/messages', methods=['GET'])
def api_get_messages():
    """Get recent chat messages"""
    limit = request.args.get('limit', 20, type=int)
    if limit > 50:
        limit = 50
    messages = get_recent_messages(limit)
    return jsonify(messages)


# SocketIO events for real-time chat
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print(f'Client connected: {request.sid}')
    # Auto-join the global chat room
    join_room('global_chat')


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print(f'Client disconnected: {request.sid}')
    leave_room('global_chat')


@socketio.on('join_chat')
def handle_join_chat(data):
    """Handle client joining the chat"""
    username = data.get('username', 'Anonymous')
    session['username'] = username
    join_room('global_chat')
    print(f'{username} joined the chat')
    
    # Send recent messages to the user
    recent_messages = get_recent_messages(20)
    emit('chat_history', {'messages': recent_messages})


@socketio.on('send_message')
def handle_send_message(data):
    """Handle incoming chat message"""
    username = data.get('username', 'Anonymous')
    avatar = data.get('avatar', 'A')
    message = data.get('message', '').strip()
    
    if not message:
        return
    
    # Limit message length
    if len(message) > 500:
        message = message[:500]
    
    # Save to database
    timestamp = save_message(username, avatar, message)
    
    # Broadcast to all connected clients
    emit('new_message', {
        'username': username,
        'avatar': avatar,
        'message': message,
        'timestamp': timestamp
    }, broadcast=True, room='global_chat')
    
    print(f'[{username}]: {message}')


@socketio.on('typing')
def handle_typing(data):
    """Handle typing indicator"""
    username = data.get('username', 'Anonymous')
    emit('user_typing', {'username': username}, broadcast=True, room='global_chat')


@app.after_request
def apply_response_optimizations(response):
    """Apply compression and caching headers for faster page loads."""
    path = request.path
    accept_encoding = request.headers.get('Accept-Encoding', '')

    if path.startswith('/static/'):
        response.cache_control.public = True
        response.cache_control.max_age = 31536000
        response.cache_control.immutable = True
    elif response.content_type and response.content_type.startswith('text/html'):
        response.cache_control.public = True
        response.cache_control.max_age = 600

    if 'gzip' in accept_encoding.lower() and response.status_code == 200:
        content_type = response.headers.get('Content-Type', '')
        if response.headers.get('Content-Encoding', '') == 'gzip':
            return response
        if any(mime in content_type for mime in ('text/', 'application/javascript', 'application/json', 'image/svg+xml')):
            compressed = gzip.compress(response.get_data(), compresslevel=6)
            response.set_data(compressed)
            response.headers['Content-Encoding'] = 'gzip'
            response.headers['Vary'] = 'Accept-Encoding'
            response.headers['Content-Length'] = len(compressed)
    return response


if __name__ == "__main__":
    # Run with SocketIO server
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)