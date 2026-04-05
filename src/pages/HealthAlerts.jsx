import React from 'react';
import { StatCard, TableCard, StatusBadge, AlertCard } from '../components/ui/UIComponents';
import { healthAlerts } from '../data/dummyData';

const HealthAlerts = () => {
  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px' }}>Active Health Alerts</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '20px' }}>
        <StatCard label="Critical Alerts" value="2" icon="🚨" trend="-1" color="var(--danger)" />
        <StatCard label="Warning Alerts" value="1" icon="⚠️" trend="+0" color="var(--warning)" />
        <StatCard label="Resolved Today" value="8" icon="✅" trend="+2" color="var(--success)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>🚩 Active Alert List</h3>
          {healthAlerts.map(alert => (
            <div key={alert.id} className="card" style={{ 
               background: '#252525', 
               borderLeft: `4px solid ${alert.status === 'Critical' ? 'var(--danger)' : 'var(--warning)'}`,
               marginBottom: '1rem',
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>{alert.status === 'Critical' ? '🚨' : '⚠️'}</span>
                  <div>
                    <h4 style={{ fontWeight: 'bold' }}>{alert.type}: {alert.name} ({alert.workerId})</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recorded {alert.value} at {alert.time}</p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>MANAGE</button>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>RESOLVE</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ background: 'rgba(231,76,60, 0.05)', border: '1px dashed var(--danger)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--danger)' }}>🚨 Emergency Protocol</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            In case of critical health metrics (SpO2 &lt; 90% or Heart Rate &gt; 130bpm), immediate evacuation is recommended.
          </p>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>1. Alert nearest supervisor zone.</li>
            <li>2. Send secondary medical response team to Area Sector B.</li>
            <li>3. Trigger vibrating alert on worker's digital badge.</li>
            <li>4. Initiate shaft ventilation boost if gas levels are rising.</li>
          </ul>
          <button className="btn btn-danger" style={{ width: '100%', marginTop: '2rem' }}>SEND EMERGENCY BROADCAST</button>
        </div>
      </div>
    </div>
  );
};

export default HealthAlerts;
