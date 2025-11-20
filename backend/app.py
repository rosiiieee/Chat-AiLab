import uuid
import time
from flask import Flask, request, jsonify
from flask_cors import CORS

from rag_service import run_state_graph, purge_stale_threads, get_history

app = Flask(__name__)
CORS(app)
THREAD_TIME_TO_LIVE = 86400  # in seconds
threads_last_update = {}
@app.route("/")
def hello_world():
    return "<p>Hellow, World!</p>"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    new_user_message = data.get('message', '')

    # generated random thread_id for stateless conversation
    user_thread_id = data.get('thread_id')
     # keep track of known thread_ids w/ their last_updated time, jus using py time obj
    time_now = time.time()
    threads_last_update[user_thread_id] = time_now
    # clean up old threads:
    # wouldn't scale well if there are like over 1k threads this works for now :KEKW: for scaling use a database for faster querying
    # not sure how this'd interact w/ multiple flask instances thru gunicorn either soooooo yea just use a database for that
    threads_to_purge = []
    for thread_id, last_update in list(threads_last_update.items()):
        if time_now - last_update > THREAD_TIME_TO_LIVE:
            threads_to_purge.append(thread_id)
            del threads_last_update[thread_id]
    # PURGE
    if threads_to_purge:
        print("(debug) purging ids: ", threads_to_purge)
        try:
            purge_stale_threads(threads_to_purge)
        except Exception as e:
            print(f"Error purging threads: {e}")

    # Use RAG service to generate response
    try:
        result = run_state_graph(new_user_message, user_thread_id)
        response_message = result['answer']
    except Exception as e:
        response_message = "An error occurred while processing your request."
    return jsonify({
        'response': response_message,
        'thread_id': user_thread_id,
        'status': 'success'
    })

@app.route("/history", methods=["POST"])
def history():
    data = request.get_json()
    user_thread_id = data.get('thread_id')

    if not user_thread_id:
        print("user_thread_id ERROR")
        return jsonify({
            "status": "error",
            "message": "thread_id is required"
        }), 400

    try:
        history = get_history(user_thread_id)  
        
    except Exception as e:
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