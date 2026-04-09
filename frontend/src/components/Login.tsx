import { useState } from 'react';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
}

export default function Login({ onLogin, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card">
        <div className="login-header">
          <div className="icon-wrapper">
            <Activity color="var(--accent-color)" size={32} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to Optima-AI Intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                id="email" 
                placeholder="admin@optima-ai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-full" disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>
                Sign In to Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
}
