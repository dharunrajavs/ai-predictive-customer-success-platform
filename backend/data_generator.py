import pandas as pd
import numpy as np
import os

def generate_mock_data(num_samples=1000):
    np.random.seed(42)
    
    # Generate user IDs
    user_ids = [f"USR{str(i).zfill(4)}" for i in range(1, num_samples + 1)]
    
    # Feature 1: Login frequency (per month)
    login_frequency = np.random.poisson(lam=10, size=num_samples)
    
    # Feature 2: Average session duration (in minutes)
    session_duration = np.random.normal(loc=15, scale=5, size=num_samples)
    session_duration = np.clip(session_duration, 1, 60) # Keep realistic bounds
    
    # Feature 3: Number of features used
    features_used = np.random.randint(1, 20, size=num_samples)
    
    # Feature 4: Number of support tickets
    support_tickets = np.random.poisson(lam=1.5, size=num_samples)
    
    # Feature 5: Inactivity period (days since last login)
    inactivity_days = np.random.exponential(scale=15, size=num_samples)
    inactivity_days = np.clip(inactivity_days, 0, 90)
    
    # Target: Churn Risk Score Calculation (Hidden logic to assign labels)
    # Higher inactivity + lower login + more support tickets => higher risk of churn
    risk_score = (inactivity_days * 1.5) - (login_frequency * 2) - (session_duration * 0.5) + (support_tickets * 3)
    
    # Assign categories based on risk score percentiles
    churn_risk = []
    for score in risk_score:
        if score > np.percentile(risk_score, 75):
            churn_risk.append("High")
        elif score > np.percentile(risk_score, 40):
            churn_risk.append("Medium")
        else:
            churn_risk.append("Low")
            
    # Assign segments based on somewhat different criteria
    segments = []
    for i in range(num_samples):
        if inactivity_days[i] > 30:
            segments.append("Inactive")
        elif churn_risk[i] == "High":
            segments.append("At-Risk")
        elif login_frequency[i] > 15 and session_duration[i] > 20:
            segments.append("Loyal")
        else:
            segments.append("Standard")

    df = pd.DataFrame({
        "user_id": user_ids,
        "login_frequency": login_frequency,
        "session_duration_min": np.round(session_duration, 1),
        "features_used": features_used,
        "support_tickets": support_tickets,
        "inactivity_days": np.round(inactivity_days, 0),
        "churn_risk": churn_risk,
        "segment": segments
    })
    
    os.makedirs(os.path.dirname(os.path.abspath(__file__)) + "/data", exist_ok=True)
    df.to_csv(os.path.dirname(os.path.abspath(__file__)) + "/data/sample_dataset.csv", index=False)
    print("Database `sample_dataset.csv` generated successfully.")

if __name__ == "__main__":
    generate_mock_data()
