import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Activity } from 'lucide-react';

interface SignupProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}

export default function Signup({ onSignup, onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for registration
    setTimeout(() => {
      setLoading(false);
      onSignup();
    }, 1000);
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card">
        <div className="login-header">
          <div className="icon-wrapper">
            <Activity color="var(--accent-color)" size={32} />
          </div>
          <h1>Create an Account</h1>
          <p>Join Optima-AI Intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-group">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                id="name" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                id="email" 
                placeholder="john@example.com"
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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-full" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Creating Account...' : (
              <>
                Sign Up & Enter Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
            Log in here
          </a>
        </div>
      </div>
    </div>
  );
}
