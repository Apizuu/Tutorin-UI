from flask import Blueprint, request, jsonify
from bson.errors import InvalidId
from models.session import Session
from models.user import User
from utils.jwt import token_required
from config import Config

sessions_bp = Blueprint("sessions", __name__)

@sessions_bp.route("/create_session", methods=["POST"])
@token_required
def create_session(current_user):
    data = request.get_json()
    if not all(k in data for k in ["date", "location", "limit", "fee"]):
        return jsonify({"error": "Missing fields"}), 400

    session = Session(
        tutor=current_user,
        date=data["date"],
        location=data["location"],
        limit=int(data["limit"]),
        fee=float(data["fee"])
    )
    session.save()
    return jsonify({"message": "Session created", "session_id": str(session.id)}), 201

@sessions_bp.route("/sessions", methods=["GET"])
@token_required
def list_sessions(current_user):
    sessions = [s.to_dict() for s in Session.objects()]
    for s in sessions:
        s['fee'] = f"{Config.CURRENCY} {s['fee']:.2f}"
    return jsonify(sessions), 200

@sessions_bp.route("/join_session", methods=["POST"])
@token_required
def join_session(current_user):
    data = request.get_json()
    session_id = data.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id required"}), 400

    session = Session.objects(id=session_id).first()
    if not session:
        return jsonify({"error": "Session not found"}), 404
    if current_user == session.tutor:
        return jsonify({"error": "Tutor cannot join own session"}), 400
    if current_user in session.tutees:
        return jsonify({"message": "Already joined"}), 200
    if len(session.tutees) >= session.limit:
        return jsonify({"error": "Session full"}), 400
    if Session.has_conflict(current_user, session.date):
        return jsonify({"error": "User already joined another session at the same date"}), 400

    tutee = User.objects(username=current_user).first()
    tutor = User.objects(username=session.tutor).first()
    if not tutee or not tutor:
        return jsonify({"error": "User not found"}), 404
    if tutee.balance < session.fee:
        return jsonify({"error": "Insufficient balance"}), 400

    tutee.balance -= session.fee
    tutor.balance += session.fee
    tutee.save()
    tutor.save()

    session.tutees.append(current_user)
    session.save()
    return jsonify({"message": f"Tutee added and payment processed: {Config.CURRENCY} {session.fee:.2f}"}), 200

