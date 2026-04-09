import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def train_model():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "sample_dataset.csv")
    
    if not os.path.exists(data_path):
        print(f"Data not found at {data_path}. Please run data_generator.py first.")
        return
        
    df = pd.read_csv(data_path)
    
    # Features and Target
    features = ['login_frequency', 'session_duration_min', 'features_used', 'support_tickets', 'inactivity_days']
    X = df[features]
    y = df['churn_risk']
    
    # Encode target variable
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    # Train Random Forest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    
    # Evaluate
    accuracy = rf.score(X_test, y_test)
    print(f"Model trained. Accuracy on test set: {accuracy:.4f}")
    
    # Save the model and the label encoder
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    joblib.dump(rf, os.path.join(base_dir, "ml", "rf_model.joblib"))
    joblib.dump(le, os.path.join(base_dir, "ml", "label_encoder.joblib"))
    print("Model saved to rf_model.joblib")
    
    # Analyze Feature Importance
    importances = rf.feature_importances_
    for name, imp in zip(features, importances):
        print(f"{name}: {imp:.4f}")

def predict(features_dict):
    """
    Predict churn risk given a dictionary of features.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "ml", "rf_model.joblib")
    le_path = os.path.join(base_dir, "ml", "label_encoder.joblib")
    
    if not os.path.exists(model_path) or not os.path.exists(le_path):
        return "Model not found. Train the model first."
        
    rf = joblib.load(model_path)
    le = joblib.load(le_path)
    
    # Ensure features are in the right order
    feature_names = ['login_frequency', 'session_duration_min', 'features_used', 'support_tickets', 'inactivity_days']
    X = pd.DataFrame([[features_dict.get(f, 0) for f in feature_names]], columns=feature_names)
    
    prediction = rf.predict(X)
    probability = rf.predict_proba(X).max()
    
    risk_level = le.inverse_transform(prediction)[0]
    return {"risk_level": risk_level, "confidence": float(probability)}

if __name__ == "__main__":
    train_model()
