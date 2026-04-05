import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard, TableCard, StatusBadge, AlertCard } from '../components/ui/UIComponents';
import { stats, healthAlerts } from '../data/dummyData';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Supervisor Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Coal Mine Manual Monitoring & Shift Portal</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ fontSize: '0.85rem' }}>SYSTEM LOGS</button>
          <button className="btn btn-primary" style={{ fontSize: '0.85rem', background: 'var(--danger)', color: '#fff', border: 'none' }}>EMERGENCY STOP</button>
        </div>
      </div>
      
      {/* Stat Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.25rem' 
      }}>
        {stats.map(stat => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1.2fr', 
        gap: '2rem',
        marginTop: '2.5rem'
      }}>
        {/* Quick Actions Panel */}
        <div className="card" style={{ height: 'fit-content' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Manual Admin Controls</h3>
           <div style={{ 
             display: 'grid', 
             gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
             gap: '1rem' 
           }}>
             <button onClick={() => navigate('/worker-attendance')} className="card" style={{ textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--accent-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', padding: '1.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🆔</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>Worker Attendance</span>
             </button>
             <button onClick={() => navigate('/worker-registration')} className="card" style={{ textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', padding: '1.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>👷</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Register Worker</span>
             </button>
             <button onClick={() => navigate('/worker-records')} className="card" style={{ textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', padding: '1.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📜</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Master Status</span>
             </button>
             <button onClick={() => navigate('/admin-register')} className="card" style={{ textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', padding: '1.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>👨‍💼</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Add Admin</span>
             </button>
             <button onClick={() => navigate('/health-analytics')} className="card" style={{ textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', padding: '1.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📈</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Health Insights</span>
             </button>
           </div>
        </div>
        
        {/* Alerts Center */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Health Alerts Today</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {healthAlerts.map(alert => (
              <AlertCard 
                key={alert.id}
                type={alert.status === 'Critical' ? 'critical' : 'warning'}
                title={alert.type}
                message={`${alert.name} (${alert.workerId}) - Recorded ${alert.value}`}
                time={alert.time}
              />
            ))}
          </div>
          
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'rgba(231, 76, 60, 0.05)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px dashed var(--danger)',
            textAlign: 'center'
          }}>
             <h5 style={{ color: 'var(--danger)', fontWeight: 'bold' }}>SYSTEM ALERT</h5>
             <button className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', marginTop: '0.75rem', width: '100%', fontWeight: 'bold' }}>TRIGGER EVACUATION</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
