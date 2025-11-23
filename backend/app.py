import os
import uuid
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from rag_service import run_state_graph, purge_stale_threads, get_history

# Path to your React build folder (relative to this file)
REACT_BUILD_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")

app = Flask(
    __name__,
    static_folder=REACT_BUILD_DIR,  # React static files
    static_url_path="/"             # served at root
)

# If you're serving frontend + backend from SAME origin in prod,
# you technically don't need CORS, but keeping it doesn't hurt much.
CORS(app)

THREAD_TIME_TO_LIVE = 86400  # in seconds
threads_last_update = {}


# ============ API ROUTES ============

@app.route("/api/chat", methods=["POST"])
def chat():
    return {"response": "Hello from backend!"}



@app.route("/api/history", methods=["POST"])
def history():
    data = request.get_json() or {}
    user_thread_id = data.get("thread_id")

    if not user_thread_id:
        print("user_thread_id ERROR")
        return jsonify({
            "status": "error",
            "message": "thread_id is required"
        }), 400

    try:
        history = get_history(user_thread_id)
    except Exception as e:
        print("Error in get_history:", e)
        return jsonify({
            "status": "error",
            "message": "Could not retrieve history",
            "details": str(e)
        }), 500

    return jsonify({
        "status": "success",
        "thread_id": user_thread_id,
        "history": history
    })


# ============ REACT FRONTEND ROUTES ============

# Serve static files and SPA fallback
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    """
    If the file exists in the React build, serve it.
    Otherwise, serve index.html so React Router can handle the route.
    """
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # default: index.html
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    # debug only; in production Render will use gunicorn
    app.run(debug=True)
