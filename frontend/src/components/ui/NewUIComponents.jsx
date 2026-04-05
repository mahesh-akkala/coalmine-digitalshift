import React from 'react';

export const StepFlowCard = ({ steps, currentStep }) => (
  <div className="card glass animate-fade-in" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '5%', 
        right: '5%', 
        height: '2px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        zIndex: 1 
      }}>
        <div style={{ 
          width: `${(currentStep / (steps.length - 1)) * 100}%`, 
          height: '100%', 
          background: 'var(--accent-primary)', 
          boxShadow: '0 0 10px var(--accent-primary)',
          transition: 'var(--transition)'
        }}></div>
      </div>
      {steps.map((step, index) => (
        <div key={index} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          zIndex: 2, 
          flex: 1,
          opacity: index > currentStep ? 0.3 : 1,
          transition: 'var(--transition)'
        }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: index < currentStep ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : (index === currentStep ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' : 'var(--bg-tertiary)'),
            color: (index <= currentStep) ? '#000' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1rem',
            border: index === currentStep ? '2px solid rgba(255,255,255,0.2)' : 'none',
            boxShadow: index === currentStep ? '0 0 20px var(--accent-glow)' : 'none',
            transform: index === currentStep ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span style={{ 
            marginTop: '1rem', 
            fontSize: '0.8rem', 
            fontWeight: index === currentStep ? '700' : '500',
            color: index === currentStep ? 'var(--accent-primary)' : 'var(--text-secondary)',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {step}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const HealthDecisionCard = ({ decision, vitals }) => {
  const getColors = () => {
    const d = decision.toUpperCase();
    if (d.includes('SAFE')) {
      return { bg: 'rgba(16, 185, 129, 0.05)', border: 'var(--success)', text: 'var(--success)', icon: '🛡️', glow: 'rgba(16, 185, 129, 0.2)' };
    }
    if (d.includes('WARNING')) {
      return { bg: 'rgba(245, 158, 11, 0.05)', border: 'var(--warning)', text: 'var(--warning)', icon: '⚠️', glow: 'rgba(245, 158, 11, 0.2)' };
    }
    if (d.includes('NOT ALLOWED') || d.includes('CRITICAL') || d.includes('EMERGENCY')) {
      return { bg: 'rgba(239, 68, 68, 0.05)', border: 'var(--danger)', text: 'var(--danger)', icon: '⛔', glow: 'rgba(239, 68, 68, 0.2)' };
    }
    return { bg: 'var(--bg-tertiary)', border: 'var(--border-color)', text: 'var(--text-primary)', icon: '📊', glow: 'transparent' };
  };

  const colors = getColors();

  return (
    <div className="card glass animate-fade-in" style={{ 
      background: colors.bg, 
      border: `2px solid ${colors.border}`, 
      textAlign: 'center',
      padding: '3rem 2rem',
      boxShadow: `0 0 30px ${colors.glow}`
    }}>
      <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem', filter: `drop-shadow(0 0 10px ${colors.border})` }}>{colors.icon}</div>
      <h2 style={{ color: colors.text, fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{decision}</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem' }}>
        {decision.includes('SAFE') 
          ? 'Vitals are optimized for underground operations. Permission granted.' 
          : 'Health threshold exceeded. Immediate assessment required by medical team.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${vitals.length}, 1fr)`, gap: '1.5rem', marginTop: '2rem' }}>
        {vitals.map((v, i) => (
          <div key={i} style={{ 
            background: 'rgba(255,255,255,0.02)', 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>{v.label}</div>
            <div style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{v.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
