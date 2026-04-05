import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard, TableCard, StatusBadge, AlertCard } from '../components/ui/UIComponents';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Dashboard = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();

    socket.on('new_scan', (data) => {
      // Update specific worker's health status in the list
      setWorkers(prev => prev.map(w => 
        w.id === data.worker.id ? { ...w, healthEligibility: data.status } : w
      ));

      // Append new alert to feed if it's Warning or Critical
      if (data.status !== 'Safe') {
        const newAlert = {
          id: Date.now(),
          type: data.status === 'Critical' ? 'CRITICAL PULSE' : 'HEALTH WARNING',
          name: data.worker.name,
          workerId: data.worker.id,
          value: `${data.vitals.heartRate} BPM / ${data.vitals.spo2}% SpO2`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: data.status
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep last 10 alerts
      }
    });

    return () => socket.off('new_scan');
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workers');
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error('Core sync failure:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // derived statistics
  const dashStats = [
    { id: 1, label: 'Total Force', value: workers.length.toString(), icon: '👷', color: 'var(--info)' },
    { id: 2, label: 'Active (Inside)', value: workers.filter(w => w.status === 'Inside').length.toString(), icon: '⛏️', color: 'var(--success)' },
    { id: 3, label: 'Off-Shift (Surface)', value: workers.filter(w => w.status === 'Outside').length.toString(), icon: '🏠', color: 'var(--text-secondary)' },
    { id: 4, label: 'Critical Alerts', value: workers.filter(w => w.healthEligibility === 'Critical').length.toString(), icon: '🚨', color: 'var(--danger)' }
  ];

  const activeWorkforce = workers.filter(w => w.status === 'Inside').slice(0, 5);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Command Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: '500' }}>
            Shift Operations & Real-time Biometric Monitoring
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <button className="btn btn-outline" style={{ border: '1px solid var(--border-color)' }} onClick={() => navigate('/worker-records')}>
            <span style={{ fontSize: '1.1rem' }}>📊</span> DATA LOGS
          </button>
          <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', color: '#fff' }}>
            🚨 EMERGENCY EVAC
          </button>
        </div>
      </div>
      
      {/* Stat Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {dashStats.map(stat => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '2.5rem'
      }}>
        {/* Quick Actions & Personnel Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card glass">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administrative Control Pulse</h3>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem' 
            }}>
              <div onClick={() => navigate('/worker-attendance')} className="card" style={{ cursor: 'pointer', textAlign: 'center', background: 'rgba(245, 179, 1, 0.03)', border: '1.5px solid rgba(245, 179, 1, 0.2)', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px var(--accent-primary))' }}>🆔</div>
                <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: '800', letterSpacing: '0.05em' }}>ATTENDANCE TERMINAL</span>
              </div>
              
              <div onClick={() => navigate('/worker-registration')} className="card" style={{ cursor: 'pointer', textAlign: 'center', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', padding: '2rem 1rem' }}>
                <span style={{ fontSize: '2.2rem' }}>👷</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>REGISTER WORKER</span>
              </div>
              
              <div onClick={() => navigate('/worker-records')} className="card" style={{ cursor: 'pointer', textAlign: 'center', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', padding: '2rem 1rem' }}>
                <span style={{ fontSize: '2.2rem' }}>📑</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>MASTER RECORDS</span>
              </div>
              
              <div onClick={() => navigate('/settings')} className="card" style={{ cursor: 'pointer', textAlign: 'center', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', padding: '2rem 1rem' }}>
                <span style={{ fontSize: '2.2rem' }}>⚙️</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>SITE CONFIG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
