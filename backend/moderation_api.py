from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/moderate_comment', methods=['POST'])
def moderate_comment():
    data = request.get_json()
    comment = data.get("comment", "")
    # For testing, if the comment contains "garbage", mark it as toxic.
    if "garbage" in comment.lower():
        return jsonify({"is_toxic": True})
    return jsonify({"is_toxic": False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

