from sklearn.linear_model import LinearRegression
import numpy as np
import pandas as pd
import os

# Load the real training data from the CSV provided
current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_dir, 'training_data.csv')

try:
    df = pd.read_csv(csv_path)
    # Features: Number of Skills, Experience, Certifications
    X_train = df[['skills', 'experience', 'certifications']].values
    # Labels: Employability Score (0-100)
    y_train = df['employability_score'].values
except Exception as e:
    # Fallback mock data if CSV fails to load
    X_train = np.array([[2, 0, 0], [5, 1, 1], [8, 2, 1], [10, 5, 2], [15, 8, 3]])
    y_train = np.array([30, 55, 78, 90, 98])

# Train the model
model = LinearRegression()
model.fit(X_train, y_train)

def predict_employability(num_skills: int, experience_years: float, certifications_count: int) -> float:
    # Prepare input feature array
    features = np.array([[num_skills, experience_years, certifications_count]])
    
    # Predict
    predicted_score = model.predict(features)[0]
    
    # Bound the score between 0 and 100
    predicted_score = float(max(0.0, min(100.0, float(predicted_score))))
    
    return float(f"{predicted_score:.2f}")
