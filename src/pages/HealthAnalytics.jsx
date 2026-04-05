import React from 'react';
import { GraphCard, StatCard, TableCard, StatusBadge } from '../components/ui/UIComponents';
import { analyticsData } from '../data/dummyData';

const HealthAnalytics = () => {
  const { sevenDayHistory, safetyScore, abnormalDays, currentStatus } = analyticsData;

  const renderSimplifiedChart = (data, color, min, max, label) => {
    const height = 120;
    const width = 400;
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{label}</span>
          <span style={{ fontSize: '0.8rem', color: color, fontWeight: 'bold' }}>Range: {min}-{max}</span>
        </div>
        <div style={{ height: '120px', width: '100%' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <path d={`M ${points} V ${height} H 0 Z`} fill={color} fillOpacity="0.1" />
            <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} style={{ filter: `drop-shadow(0 0 5px ${color}44)` }} />
            {data.map((val, i) => (
              <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - ((val - min) / (max - min)) * height} r="4" fill={color} />
            ))}
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {sevenDayHistory.map(d => <span key={d.day}>{d.day}</span>)}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Worker Health Analytics</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Simplified 7-day health trends and safety reporting.</p>

      {/* Summary Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ textAlign: 'center', borderTop: `5px solid ${currentStatus === 'Safe' ? 'var(--success)' : 'var(--danger)'}` }}>
           <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Current Health Status</div>
           <div style={{ fontSize: '2rem', fontWeight: 'bold', color: currentStatus === 'Safe' ? 'var(--success)' : 'var(--danger)' }}>{currentStatus.toUpperCase()}</div>
           <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Vitals are within stable range</div>
        </div>
        <div className="card" style={{ textAlign: 'center', borderTop: '5px solid var(--accent-primary)' }}>
           <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Weekly Safety Score</div>
           <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{safetyScore}%</div>
           <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Calculated from 21 sensor points</div>
        </div>
        <div className="card" style={{ textAlign: 'center', borderTop: '5px solid var(--warning)' }}>
           <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Abnormal Days (7d)</div>
           <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{abnormalDays}</div>
           <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Days with health warnings</div>
        </div>
        <div className="card" style={{ textAlign: 'center', borderTop: '5px solid var(--info)' }}>
           <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Last Entry Decision</div>
           <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--info)' }}>APPROVED</div>
           <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Verified 08:00 AM Today</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        {/* Profile Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👷</div>
            <div>
              <h3 style={{ fontWeight: 'bold' }}>John Doe</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Excavation | ID: W101</span>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', background: 'rgba(245, 179, 1, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
             <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Health Summary</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem' }}>Safe Work Days</span>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>6 Days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem' }}>Warning Incidents</span>
                  <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>1 Days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem' }}>Critical Events</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>0 Days</span>
                </div>
             </div>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>DOWNLOAD ANALYTICS REPORT</button>
        </div>

        {/* Charts Section */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '2rem' }}>Simplified Health Trends (Last 7 Days)</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {renderSimplifiedChart(sevenDayHistory.map(d => d.temp), 'var(--danger)', 97, 102, 'Body Temperature (°F)')}
            {renderSimplifiedChart(sevenDayHistory.map(d => d.heartRate), 'var(--accent-primary)', 60, 110, 'Heart Rate (BPM)')}
            {renderSimplifiedChart(sevenDayHistory.map(d => d.spo2), 'var(--info)', 90, 100, 'Oxygen Level (SpO2 %)')}
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '5px solid var(--success)' }}>
             <h4 style={{ marginBottom: '0.5rem' }}>Overall Condition Result</h4>
             <p style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem' }}>Condition: STABLE & SAFE</p>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Based on the last 7 days of shift data, worker exhibits consistent vital signs within the safety regulations. High weekly safety score detected.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalytics;
