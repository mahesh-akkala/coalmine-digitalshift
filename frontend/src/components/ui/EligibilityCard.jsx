import React from 'react';

export const EligibilityCard = ({ guidance, onDecision }) => {
  const isSafe = guidance.toLowerCase() === 'safe' || guidance.toLowerCase() === 'fit';
  
  return (
    <div className="card glass animate-fade-in" style={{ 
      marginTop: '2rem',
      background: 'rgba(0, 0, 0, 0.4)',
      border: '1px solid var(--border-color)',
      padding: '2.5rem',
      textAlign: 'center',
      boxShadow: `0 10px 40px -10px ${isSafe ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`
    }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Next-Shift Readiness Evaluation
      </div>
      
      {/* Guidance Section */}
      <div style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 2rem',
        borderRadius: '12px',
        background: isSafe ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 108, 0.1)',
        color: isSafe ? 'var(--success)' : 'var(--danger)',
        fontWeight: '800',
        fontSize: '0.95rem',
        marginBottom: '2rem',
        border: `1px solid ${isSafe ? 'var(--success)' : 'var(--danger)'}`,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        <span style={{ fontSize: '1.2rem' }}>{isSafe ? '🛡️' : '⚠️'}</span>
        SYSTEM RECOMMENDATION: {guidance.toUpperCase()}
      </div>
      
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
        Automated diagnostics indicate the operative {isSafe ? 'maintains optimal recovery parameters' : 'exhibits fatigue markers above safety threshold'}. 
        Command authorization required.
      </p>

      {/* Manual Admin Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <button 
          className="btn btn-primary" 
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '1.2rem' }}
          onClick={() => onDecision('Fit')}
        >
          CERTIFY AS FIT
        </button>
        <button 
          className="btn btn-danger" 
          style={{ padding: '1.2rem' }}
          onClick={() => onDecision('Needs Rest')}
        >
          RESTRICT / DE-LIST
        </button>
      </div>
    </div>
  );
};
