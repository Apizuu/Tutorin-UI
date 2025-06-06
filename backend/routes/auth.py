from flask import Blueprint, request, jsonify
from models.user import User
import jwt
import datetime
from config import Config
from utils.jwt import token_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required_fields = ["username", "password", "year_joined", "major", "faculty"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required user fields"}), 400

    if User.objects(username=data["username"]).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(
        username=data["username"],
        password=data["password"],
        year_joined=data["year_joined"],
        major=data["major"],
        faculty=data["faculty"],
        balance=0.0
    )
    user.save()
    return jsonify({"message": "Registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.objects(username=data.get("username")).first()
    if not user or user.password != data.get("password"):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        'username': user.username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, Config.SECRET_KEY, algorithm="HS256")

    return jsonify({'token': token}), 200

@auth_bp.route("/topup", methods=["POST"])
def topup():
    data = request.get_json()
    user = User.objects(username=data.get("username")).first()
    amount = float(data.get("amount", 0))
    if not user or amount <= 0:
        return jsonify({"error": "Invalid user or amount"}), 400
    user.balance += amount
    user.save()
    return jsonify({"message": f"Top-up successful. New balance: {Config.CURRENCY} {user.balance:.2f}"}), 200

@auth_bp.route("/balance", methods=["GET"])
@token_required
def get_balance(current_user):
    user = User.objects(username=current_user).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "username": user.username,
        "balance": f"{Config.CURRENCY} {user.balance:.2f}"
    }), 200