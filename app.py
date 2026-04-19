from flask import Flask, request, jsonify
from predict_eta import predict_eta

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    distance = data["distance"]
    speed = data["speed"]
    hour = data["hour"]

    eta = predict_eta(distance, speed, hour)

    return jsonify({"eta": eta})

app.run(port=6000)