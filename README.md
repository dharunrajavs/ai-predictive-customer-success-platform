# AI-Powered Predictive Customer Success Platform

An advanced, full-stack AI platform designed to predict customer churn, visualize health scores, and automate personalized outreach.

## 🚀 Key Features
- **AI Churn Prediction**: Machine Learning model (Random Forest) predicting user churn probability.
- **Customer Intelligence Dashboard**: Real-time visualization of health scores, usage trends, and segmentation.
- **Automated Outreach**: Intelligent campaign trigger engine for proactive customer engagement.
- **Live Monitoring**: Real-time tracking of user activity and risk levels.

## 🛠 Tech Stack
- **Frontend**: React (Vite), TypeScript, Recharts, Lucide-React, CSS3 (Glassmorphism).
- **Backend**: FastAPI (Python), Pandas, Scikit-learn, Uvicorn.
- **Data**: Synthetic dataset generating realistic customer behaviors.

## 🏃 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

## 📂 Project Structure
- `/frontend`: React application with dashboard and automation UI.
- `/backend`: FastAPI server with ML models and data processing logic.
- `/backend/ml`: Churn prediction models and encoders.
- `/backend/data`: Sample datasets and data generation scripts.

---
Built with ❤️ by Antigravity AI
