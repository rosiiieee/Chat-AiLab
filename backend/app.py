from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    response_message = "I received your message. This is a placeholder response from the PLM Assistant."
    
    return jsonify({
        'response': response_message,
        'status': 'success'
    })