import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {
  const [view, setView] = useState<'login' | 'signup' | 'dashboard'>('login');

  return (
    <div className="app">
      {view === 'dashboard' && <Dashboard />}
      {view === 'login' && (
        <Login 
          onLogin={() => setView('dashboard')} 
          onSwitchToSignup={() => setView('signup')} 
        />
      )}
      {view === 'signup' && (
        <Signup 
          onSignup={() => setView('dashboard')} 
          onSwitchToLogin={() => setView('login')} 
        />
      )}
    </div>
  )
}

export default App
