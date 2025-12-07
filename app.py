from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

MODEL_FILE = "bp_model.pkl"
CSV_FILE = "blood_pressure_sata.csv"

# -----------------------------------------
# TRAIN MODEL FROM CSV
# -----------------------------------------
def train_model():
    if os.path.exists(CSV_FILE):
        df = pd.read_csv(CSV_FILE)

        # Normalize gender
        df["gender"] = df["gender"].map({"male": 1, "female": 0})

        X = df[["age", "weight", "height", "gender"]]
        y_sys = df["systolic"]
        y_dia = df["diastolic"]

        model_sys = LinearRegression()
        model_dia = LinearRegression()

        model_sys.fit(X, y_sys)
        model_dia.fit(X, y_dia)

        joblib.dump((model_sys, model_dia), MODEL_FILE)
        print("Model trained from CSV file.")
    else:
        print("CSV not found. Cannot train model.")

if not os.path.exists(MODEL_FILE):
    train_model()

model_sys, model_dia = joblib.load(MODEL_FILE)

# -----------------------------------------
# SERVE INDEX.HTML
# -----------------------------------------
@app.route("/")
def home():
    return render_template("index.html")
@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/resources")
def resources():
    return render_template("resources.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")


# -----------------------------------------
# PREDICTION API
# -----------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        age = data["age"]
        weight = data["weight"]
        height = data["height"]
        gender = 1 if data["gender"] == "male" else 0

        features = np.array([[age, weight, height, gender]])

        systolic = int(model_sys.predict(features)[0])
        diastolic = int(model_dia.predict(features)[0])

        # classify BP
        if systolic < 90 or diastolic < 60:
            status = "low"
        elif systolic < 120 and diastolic < 80:
            status = "normal"
        elif systolic <= 129 and diastolic < 80:
            status = "elevated"
        else:
            status = "high"

        return jsonify({"systolic": systolic, "diastolic": diastolic, "status": status})

    except Exception as e:
        return jsonify({"error": str(e)})

# -----------------------------------------
# RUN APP
# -----------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
