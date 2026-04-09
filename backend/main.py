from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import pandas as pd
import os
import sys

# Add current dir to path to import local modules
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from ml.churn_model import predict, train_model
from services.outreach import generate_outreach_message

app = FastAPI(title="Customer Success platform API")

# Add CORS middleware to allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserActivity(BaseModel):
    user_id: str
    login_frequency: int
    session_duration_min: float
    features_used: int
    support_tickets: int
    inactivity_days: int
    
@app.post("/api/ingest")
async def ingest_data(activity: UserActivity):
    """
    Simulate ingesting user data. 
    In reality, we'd store this in PostgreSQL.
    """
    # Simply log it and return success for now
    print(f"Received data for {activity.user_id}: {activity.dict()}")
    return {"status": "success", "message": f"Data for {activity.user_id} ingested!"}

@app.get("/api/predict/{user_id}")
async def predict_churn(user_id: str):
    """
    Predict churn for a specific user ID based on our mock dataset.
    """
    data_path = os.path.join(current_dir, "data", "sample_dataset.csv")
    if not os.path.exists(data_path):
        raise HTTPException(status_code=500, detail="Data not available")
        
    df = pd.read_csv(data_path)
    user_data = df[df["user_id"] == user_id]
    
    if user_data.empty:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_dict = user_data.to_dict(orient="records")[0]
    
    prediction = predict(user_dict)
    
    if isinstance(prediction, str): # Error in prediction (e.g. model not trained)
        raise HTTPException(status_code=500, detail=prediction)
        
    return {
        "user_id": user_id,
        "prediction": prediction,
        "segment": user_dict.get('segment', 'Standard')
    }

@app.get("/api/segments")
async def get_segments():
    """
    Returns data grouped by segments.
    """
    data_path = os.path.join(current_dir, "data", "sample_dataset.csv")
    if not os.path.exists(data_path):
        raise HTTPException(status_code=500, detail="Data not available")
        
    df = pd.read_csv(data_path)
    segments_count = df['segment'].value_counts().to_dict()
    churn_count = df['churn_risk'].value_counts().to_dict()
    
    return {
        "segments": segments_count,
        "churn_risk_distribution": churn_count
    }

@app.post("/api/campaign/trigger")
async def trigger_campaign(user_id: str, risk_level: str, segment: str):
    """
    Trigger automated outreach campaign for a specific user.
    """
    message_details = generate_outreach_message(segment, risk_level)
    return {
        "user_id": user_id,
        "outreach": message_details
    }

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """
    Aggregated stats for the frontend dashboard.
    """
    data_path = os.path.join(current_dir, "data", "sample_dataset.csv")
    if not os.path.exists(data_path):
        return {"error": "No data"}
        
    df = pd.read_csv(data_path)
    
    total_users = len(df)
    high_risk = len(df[df['churn_risk'] == 'High'])
    avg_session = df['session_duration_min'].mean()
    
    # Recent users mock
    recent_users_df = df.head(10).to_dict(orient='records')
    
    return {
        "total_users": total_users,
        "high_risk_users": high_risk,
        "churn_rate": round(high_risk / total_users * 100, 1),
        "average_session_min": round(avg_session, 1),
        "customer_health_score": 82.5,
        "recent_activity": recent_users_df,
        "prediction_trend": [
            {"month": "Jan", "churn_risk": 32},
            {"month": "Feb", "churn_risk": 28},
            {"month": "Mar", "churn_risk": 25},
            {"month": "Apr", "churn_risk": 29},
            {"month": "May", "churn_risk": 22},
            {"month": "Jun", "churn_risk": 18},
        ],
        "usage_trend": [
            {"month": "Jan", "logins": 4200, "avg_session": 12.5},
            {"month": "Feb", "logins": 5100, "avg_session": 14.2},
            {"month": "Mar", "logins": 4800, "avg_session": 13.8},
            {"month": "Apr", "logins": 5600, "avg_session": 15.1},
            {"month": "May", "logins": 6200, "avg_session": 16.5},
            {"month": "Jun", "logins": 7100, "avg_session": 18.2},
        ],
        "campaign_performance": [
            {"campaign": "Win-back", "sent": 1200, "opened": 450, "clicked": 120, "converted": 45},
            {"campaign": "Onboarding", "sent": 850, "opened": 600, "clicked": 350, "converted": 200},
            {"campaign": "Upsell", "sent": 2100, "opened": 800, "clicked": 250, "converted": 80},
            {"campaign": "Newsletter", "sent": 4500, "opened": 1200, "clicked": 400, "converted": 10},
        ]
    }

if __name__ == "__main__":
    import uvicorn
    # Train model if not trained
    model_path = os.path.join(current_dir, "ml", "rf_model.joblib")
    if not os.path.exists(model_path):
        print("Training model for the first time...")
        train_model()
        
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
