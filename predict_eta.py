import joblib
import numpy as np

model = joblib.load("eta_model.pkl")

def predict_eta(distance, speed, hour):
    X = np.array([[distance, speed, hour]])
    eta = model.predict(X)
    return int(eta[0])