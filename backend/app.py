import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS

from rag_service import run_state_graph, get_history

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hellow, World!</p>"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    new_user_message = data.get('message', '')

    # generated random thread_id for stateless conversation
    user_thread_id = data.get('thread_id')
    
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