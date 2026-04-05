import React from 'react';

export const StepFlowCard = ({ steps, currentStep }) => (
  <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '18px', 
        left: '5%', 
        right: '5%', 
        height: '2px', 
        background: 'var(--border-color)', 
        zIndex: 1 
      }}></div>
      {steps.map((step, index) => (
        <div key={index} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          zIndex: 2, 
          flex: 1,
          opacity: index <= currentStep ? 1 : 0.4
        }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: index < currentStep ? 'var(--success)' : (index === currentStep ? 'var(--accent-primary)' : 'var(--bg-tertiary)'),
            color: (index <= currentStep) ? '#000' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            border: index === currentStep ? '2px solid #fff' : 'none',
            transition: 'all 0.3s ease'
          }}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span style={{ 
            marginTop: '0.75rem', 
            fontSize: '0.75rem', 
            fontWeight: index === currentStep ? '600' : '400',
            color: index === currentStep ? 'var(--accent-primary)' : 'var(--text-secondary)',
            textAlign: 'center'
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
    switch (decision) {
      case 'SAFE':
      case 'SAFE TO ENTER':
      case 'SAFE EXIT':
        return { bg: 'rgba(46, 204, 113, 0.1)', border: 'var(--success)', text: 'var(--success)', icon: '✅' };
      case 'WARNING':
        return { bg: 'rgba(243, 156, 18, 0.1)', border: 'var(--warning)', text: 'var(--warning)', icon: '⚠️' };
      case 'NOT ALLOWED':
      case 'CRITICAL':
      case 'EMERGENCY ATTENTION':
        return { bg: 'rgba(231, 76, 60, 0.1)', border: 'var(--danger)', text: 'var(--danger)', icon: '🚫' };
      default:
        return { bg: 'var(--bg-tertiary)', border: 'var(--border-color)', text: 'var(--text-primary)', icon: 'ℹ️' };
    }
  };

  const colors = getColors();

  return (
    <div className="card" style={{ 
      background: colors.bg, 
      border: `1px dashed ${colors.border}`, 
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{colors.icon}</div>
      <h2 style={{ color: colors.text, fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>{decision}</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
        {decision === 'SAFE' || decision.includes('SAFE') 
          ? 'Vitals are within safe range. Worker can proceed.' 
          : 'Vitals need attention. Action is restricted.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {vitals.map((v, i) => (
          <div key={i} style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{v.label}</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{v.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
