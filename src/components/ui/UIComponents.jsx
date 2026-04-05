import React from 'react';

export const StatCard = ({ label, value, icon, trend, color }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: `4px solid ${color}` }}>
    <div style={{ fontSize: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>{icon}</div>
    <div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.2rem 0' }}>{value}</div>
      {trend && <div style={{ fontSize: '0.8rem', color: trend.includes('+') ? 'var(--success)' : 'var(--danger)' }}>{trend} from yesterday</div>}
    </div>
  </div>
);

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case 'fit':
      case 'inside':
      case 'verified':
      case 'resolved':
      case 'enrolled':
        return { background: 'rgba(46, 204, 113, 0.2)', color: 'var(--success)' };
      case 'unfit':
      case 'rejected':
      case 'critical':
      case 'not enrolled':
        return { background: 'rgba(231, 76, 60, 0.2)', color: 'var(--danger)' };
      case 'warning':
      case 'evening':
        return { background: 'rgba(241, 196, 15, 0.2)', color: 'var(--warning)' };
      default:
        return { background: 'rgba(209, 213, 223, 0.2)', color: 'var(--text-secondary)' };
    }
  };

  return (
    <span style={{ 
      padding: '4px 10px', 
      borderRadius: '20px', 
      fontSize: '0.75rem', 
      fontWeight: '600',
      ...getStyle()
    }}>
      {status}
    </span>
  );
};

export const TableCard = ({ title, children, action }) => (
  <div className="card" style={{ marginTop: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{title}</h3>
      {action && <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>{action}</button>}
    </div>
    <div style={{ overflowX: 'auto' }}>
      {children}
    </div>
  </div>
);

export const AlertCard = ({ type, title, message, time }) => (
  <div className="card" style={{ 
    display: 'flex', 
    gap: '1rem', 
    background: type === 'critical' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(241, 196, 15, 0.1)',
    borderLeft: `4px solid ${type === 'critical' ? 'var(--danger)' : 'var(--warning)'}`,
    marginBottom: '1rem'
  }}>
    <div style={{ fontSize: '1.5rem' }}>{type === 'critical' ? '🚨' : '⚠️'}</div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4 style={{ fontWeight: '600' }}>{title}</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{time}</span>
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{message}</p>
    </div>
  </div>
);

export const InfoBanner = ({ message, type = 'info' }) => (
  <div style={{ 
    padding: '1rem 1.5rem', 
    background: type === 'info' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(231, 76, 60, 0.1)',
    border: `1px solid ${type === 'info' ? 'var(--info)' : 'var(--danger)'}`,
    borderRadius: 'var(--radius-md)',
    color: type === 'info' ? 'var(--info)' : 'var(--danger)',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  }}>
    <span>ℹ️</span>
    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{message}</span>
  </div>
);

export const GraphCard = ({ title, value, unit, children }) => (
  <div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{title}</h3>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '4px' }}>{unit}</span></div>
      </div>
    </div>
    <div style={{ height: '150px', width: '100%' }}>
      {children}
    </div>
  </div>
);
