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
    static_folder=None,  # React static files
    static_url_path=None             # served at root
)

# If you're serving frontend + backend from SAME origin in prod,
# you technically don't need CORS, but keeping it doesn't hurt much.
CORS(app)

THREAD_TIME_TO_LIVE = 86400  # in seconds
threads_last_update = {}


# ============ API ROUTES ============

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    new_user_message = data.get("message", "")

    # generate random thread_id if not provided
    user_thread_id = data.get("thread_id")
    if not user_thread_id:
        user_thread_id = str(uuid.uuid4())

    # keep track of known thread_ids w/ their last_updated time
    time_now = time.time()
    threads_last_update[user_thread_id] = time_now

    # clean up old threads
    threads_to_purge = []
    for thread_id, last_update in list(threads_last_update.items()):
        if time_now - last_update > THREAD_TIME_TO_LIVE:
            threads_to_purge.append(thread_id)
            del threads_last_update[thread_id]

    if threads_to_purge:
        print("(debug) purging ids: ", threads_to_purge)
        try:
            purge_stale_threads(threads_to_purge)
        except Exception as e:
            print(f"Error purging threads: {e}")

    # Use RAG service to generate response
    try:
        result = run_state_graph(new_user_message, user_thread_id)
        response_message = result["answer"]
    except Exception as e:
        print("Error in run_state_graph:", e)
        response_message = "An error occurred while processing your request."

    return jsonify({
        "response": response_message,
        "thread_id": user_thread_id,
        "status": "success"
    })


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

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    """
    Serve React app - handle both static files and SPA routing.
    """
    # Try to serve as a static file first
    file_path = os.path.join(REACT_BUILD_DIR, path)
    if path and os.path.isfile(file_path):
        return send_from_directory(REACT_BUILD_DIR, path)
    
    # Otherwise serve index.html for SPA routing
    return send_from_directory(REACT_BUILD_DIR, "index.html")

if __name__ == "__main__":
    # debug only; in production Render will use gunicorn
    app.run(debug=True)


