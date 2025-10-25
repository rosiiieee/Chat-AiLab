from flask import Flask, request, jsonify
from flask_cors import CORS
from langgraph.checkpoint.memory import InMemorySaver

from rag_service import invoke

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hellow, World!</p>"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    new_user_message = data.get('message', '')
    user_thread_id = request.headers.get('thread_id')
    
    # Use RAG service to generate response
    try:
        result = invoke(new_user_message, user_thread_id)
        response_message = result['answer']
    except Exception as e:
        response_message = "An error occurred while processing your request."

    return jsonify({
        'response': response_message,
        'status': 'success'
    })