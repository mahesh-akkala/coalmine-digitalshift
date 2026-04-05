import React from 'react';

export const StatCard = ({ label, value, icon, trend, color }) => (
  <div className="card animate-fade-in" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1.5rem',
    background: 'linear-gradient(145deg, var(--bg-secondary) 0%, rgba(20, 22, 26, 0.4) 100%)',
    borderLeft: `4px solid ${color}` 
  }}>
    <div style={{ 
      fontSize: '2rem', 
      background: 'rgba(255,255,255,0.03)', 
      padding: '1.25rem', 
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color
    }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: '700', margin: '0.2rem 0', color: 'var(--text-primary)' }}>{value}</div>
      {trend && (
        <div style={{ 
          fontSize: '0.8rem', 
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: trend.includes('+') ? 'var(--success)' : 'var(--danger)',
          fontWeight: '600'
        }}>
          {trend.includes('+') ? '↗' : '↘'} {trend} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>vs last shift</span>
        </div>
      )}
    </div>
  </div>
);

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    const s = status.toLowerCase();
    if (s.includes('safe') || s.includes('inside') || s.includes('verified') || s.includes('fit') || s.includes('enrolled')) {
      return { background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' };
    }
    if (s.includes('unfit') || s.includes('critical') || s.includes('danger') || s.includes('blocked') || s.includes('rejected')) {
      return { background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' };
    }
    if (s.includes('warning') || s.includes('caution')) {
      return { background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)' };
    }
    return { background: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-secondary)', border: '1px solid rgba(148, 163, 184, 0.2)' };
  };

  return (
    <span className="badge" style={{ ...getStyle(), display: 'inline-block' }}>
      {status}
    </span>
  );
};

export const TableCard = ({ title, children, action }) => (
  <div className="card animate-fade-in" style={{ padding: '0' }}>
    <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.01em' }}>{title}</h3>
      {action && (
        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
          {action}
        </button>
      )}
    </div>
    <div className="table-container">
      {children}
    </div>
  </div>
);

export const AlertCard = ({ type, title, message, time }) => (
  <div className="card animate-fade-in" style={{ 
    display: 'flex', 
    gap: '1.25rem', 
    background: type === 'critical' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)',
    borderLeft: `4px solid ${type === 'critical' ? 'var(--danger)' : 'var(--warning)'}`,
    marginBottom: '1.25rem',
    padding: '1.25rem 1.5rem'
  }}>
    <div style={{ 
      fontSize: '1.75rem',
      height: '50px',
      width: '50px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {type === 'critical' ? '🚨' : '⚠️'}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ fontWeight: '700', color: type === 'critical' ? 'var(--danger)' : 'var(--warning)', fontSize: '1.05rem' }}>{title}</h4>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{time}</span>
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: '1.5' }}>{message}</p>
    </div>
  </div>
);

export const InfoBanner = ({ message, type = 'info' }) => (
  <div style={{ 
    padding: '1.25rem 1.75rem', 
    background: type === 'info' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 68, 68, 0.08)',
    border: `1px solid ${type === 'info' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
    borderRadius: 'var(--radius-md)',
    color: type === 'info' ? '#93c5fd' : '#fca5a5',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  }}>
    <span style={{ fontSize: '1.2rem' }}>{type === 'info' ? 'ℹ️' : '🚫'}</span>
    <span style={{ fontSize: '0.95rem', fontWeight: '600', letterSpacing: '0.01em' }}>{message}</span>
  </div>
);

export const GraphCard = ({ title, value, unit, children }) => (
  <div className="card animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{title}</h3>
        <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.25rem' }}>
          {value}
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: '400' }}>{unit}</span>
        </div>
      </div>
    </div>
    <div style={{ height: '180px', width: '100%', position: 'relative' }}>
      {children}
    </div>
  </div>
);
