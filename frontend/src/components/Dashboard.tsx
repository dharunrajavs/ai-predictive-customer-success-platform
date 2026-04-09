import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line, AreaChart, Area, CartesianGrid
} from 'recharts';
import { Users, AlertTriangle, Clock, Send, X, HeartPulse } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
const CHURN_COLORS = { "Low": "#10b981", "Medium": "#f59e0b", "High": "#ef4444" };

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [segments, setSegments] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal state for triggering outreach
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [outreachResult, setOutreachResult] = useState<any>(null);
  const [triggerLoading, setTriggerLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch("http://localhost:8000/api/dashboard/stats");
        const statsData = await statsRes.json();
        
        const segmentsRes = await fetch("http://localhost:8000/api/segments");
        const segmentsData = await segmentsRes.json();
        
        setStats(statsData);
        setSegments({
          segments: Object.keys(segmentsData.segments).map(key => ({
            name: key,
            value: segmentsData.segments[key]
          })),
          churnDistribution: Object.keys(segmentsData.churn_risk_distribution).map(key => ({
            name: key,
            value: segmentsData.churn_risk_distribution[key]
          }))
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTriggerCampaign = async (user: any) => {
    setSelectedUser(user);
    setModalOpen(true);
    setTriggerLoading(true);
    setOutreachResult(null);
    
    try {
      const res = await fetch(`http://localhost:8000/api/campaign/trigger?user_id=${user.user_id}&risk_level=${user.churn_risk}&segment=${user.segment}`, {
        method: 'POST'
      });
      const data = await res.json();
      setOutreachResult(data.outreach);
    } catch (err) {
      console.error(err);
    } finally {
      setTriggerLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--accent-color)' }}>Loading Intelligence...</div>;
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="header">
        <h1>Customer Success Intelligence</h1>
        <div style={{ color: "var(--text-secondary)" }}>
          AI Predictive Engine Active
        </div>
      </div>
      
      {/* Top Stats Cards */}
      <div className="stats-grid">
        <div className="card">
          <div className="flex-between">
            <h2>Health Score</h2>
            <HeartPulse color="var(--success-color)" size={24} />
          </div>
          <div className="stat-value stat-low">{stats?.customer_health_score}/100</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Overall wellness index</div>
        </div>

        <div className="card">
          <div className="flex-between">
            <h2>Total Users</h2>
            <Users color="var(--accent-color)" size={24} />
          </div>
          <div className="stat-value">{stats?.total_users.toLocaleString()}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Active monitored users</div>
        </div>
        
        <div className="card">
          <div className="flex-between">
            <h2>High Risk Churn</h2>
            <AlertTriangle color="var(--danger-color)" size={24} />
          </div>
          <div className="stat-value stat-high">{stats?.high_risk_users.toLocaleString()}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Requires immediate attention</div>
        </div>
        
        <div className="card">
          <div className="flex-between">
            <h2>Avg Session Time</h2>
            <Clock color="var(--warning-color)" size={24} />
          </div>
          <div className="stat-value stat-medium">{stats?.average_session_min} min</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>30-day rolling average</div>
        </div>
      </div>
      
      {/* NEW CHARTS: Prediction & Usage Trends */}
      <div className="charts-grid">
        <div className="card">
          <h2 style={{ marginBottom: "1.5rem" }}>Churn Prediction Trend</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.prediction_trend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'var(--danger-color)' }}
                />
                <Line type="monotone" dataKey="churn_risk" stroke="var(--danger-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Predicted Churn Risk (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: "1.5rem" }}>Usage & Engagement Trends</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.usage_trend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', borderRadius: '0.5rem' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="logins" stroke="var(--accent-color)" fill="var(--accent-color)" fillOpacity={0.3} name="Total Logins" />
                <Area yAxisId="right" type="monotone" dataKey="avg_session" stroke="var(--success-color)" fill="var(--success-color)" fillOpacity={0.3} name="Avg Session (min)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS: Segmentation & Campaign Performance */}
      <div className="charts-grid">
        <div className="card">
          <h2 style={{ marginBottom: "1.5rem" }}>Customer Segmentation</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segments?.segments} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {segments?.segments.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card">
          <h2 style={{ marginBottom: "1.5rem" }}>Outreach Campaign Performance</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.campaign_performance} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} layout="vertical">
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="campaign" type="category" stroke="var(--text-secondary)" width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', borderRadius: '0.5rem' }}
                />
                <Legend />
                <Bar dataKey="sent" fill="rgba(148, 163, 184, 0.5)" name="Sent" stackId="a" />
                <Bar dataKey="opened" fill="var(--warning-color)" name="Opened" stackId="a" />
                <Bar dataKey="converted" fill="var(--success-color)" name="Converted" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Active Monitoring Table */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
          <h2>Live User Monitoring & Actions</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Segment</th>
                <th>Inactivity</th>
                <th>Risk Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_activity.map((user: any) => (
                <tr key={user.user_id}>
                  <td style={{ fontWeight: 500 }}>{user.user_id}</td>
                  <td>{user.segment}</td>
                  <td>{user.inactivity_days} days</td>
                  <td>
                    <span className={`badge badge-${user.churn_risk.toLowerCase()}`}>
                      {user.churn_risk} Risk
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn" 
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                      onClick={() => handleTriggerCampaign(user)}
                    >
                      <Send size={14} /> Send Outreach
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between">
              <h2>AI Outreach Generator</h2>
              <button 
                onClick={() => setModalOpen(false)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X />
              </button>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <p>Target: <strong>{selectedUser?.user_id}</strong></p>
              <p>Segment Context: <strong>{selectedUser?.segment}</strong> ({selectedUser?.churn_risk} Risk)</p>
              
              {triggerLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--accent-color)' }}>
                  Generating personalized message via AI...
                </div>
              ) : outreachResult && (
                <div className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
                  <p style={{ color: 'var(--success-color)', fontWeight: 500 }}>✓ Optimal Channel Selected: {outreachResult.channel.toUpperCase()}</p>
                  <div className="message-box">
                    "{outreachResult.message}"
                  </div>
                  <button 
                    className="btn" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                    onClick={() => setModalOpen(false)}
                  >
                    Confirm & Send Campaign
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
