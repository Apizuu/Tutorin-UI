from flask import Flask
from flask_cors import CORS
from mongoengine import connect
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for /auth/* dan /sessions/*
CORS(app, resources={
    r"/auth/*": {"origins": "http://localhost:5173"},
    r"/sessions/*": {"origins": "http://localhost:5173"}
}, 
supports_credentials=True,
methods=["GET", "POST", "OPTIONS"],
allow_headers=["Content-Type", "Authorization"])

# MongoDB
connect(host=Config.MONGO_URI)

# Routes
from routes.auth import auth_bp
from routes.sessions import sessions_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(sessions_bp, url_prefix="/sessions")

if __name__ == "__main__":
    app.run(debug=True)
