import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS

from rag_service import run_state_graph

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
        chat_history = result['history']
    except Exception as e:
        response_message = "An error occurred while processing your request."
        chat_history = []
        
    return jsonify({
        'response': response_message,
        'thread_id': user_thread_id,
        'history': chat_history,
        'status': 'success'
    })