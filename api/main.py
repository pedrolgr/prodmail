from flask import Flask, request, jsonify
from flask_cors import CORS
from api.gemini.gemini import gemini
from api.training.training_model import preprocess, get_features
import pickle
from pathlib import Path

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "https://prodmail.vercel.app"}})

BASE_DIR = Path(__file__).resolve().parent.parent
CLASSIFIER_PATH = BASE_DIR / "api" / "classifier" / "emailclassifier.pkl"
with open(CLASSIFIER_PATH, "rb") as f:
    classifier = pickle.load(f)

@app.route("/api/classify", methods=["POST"])
def classify_email():
    data = request.json
    if "email" not in data or not data["email"].strip():
        return jsonify({"message": "É necessário enviar um e-mail para o modelo classificar."}), 400

    tokens = preprocess(data["email"])
    features = get_features(tokens)
    label = classifier.classify(features)
    suggestions = gemini(data["email"])

    return jsonify({
        "email": data["email"],
        "label": label,
        "classification": "PRODUTIVO" if label == 1 else "IMPRODUTIVO",
        "suggestions": [suggestions]
    })

if __name__ == "__main__":
    app.run()