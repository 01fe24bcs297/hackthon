from sklearn.linear_model import LinearRegression
import numpy as np
import joblib

# Example training data
# [distance, speed, hour]
X = np.array([
    [5, 30, 10],
    [3, 20, 12],
    [10, 40, 9],
    [2, 15, 18],
    [8, 35, 14]
])

# ETA in seconds
y = np.array([600, 500, 900, 400, 800])

model = LinearRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "eta_model.pkl")

print("Model trained and saved!")