from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_service import graph

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hellow, World!</p>"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    # Use RAG service to generate response
    try:
        result = graph.invoke({"question": user_message})
        response_message = result['answer']
    except Exception as e:
        response_message = "An error occurred while processing your request."

    return jsonify({
        'response': response_message,
        'status': 'success'
    })