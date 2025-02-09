from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

toxicity_model = pipeline("text-classification", model="unitary/unbiased-toxic-roberta")

@app.route('/check_toxicity', methods=['POST'])
def check_toxicity():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = toxicity_model(text)[0]  # Classify the text
    return jsonify({"label": result["label"], "score": result["score"]})

if __name__ == '__main__':
    app.run(debug=True, port=5000)