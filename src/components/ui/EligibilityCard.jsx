import React from 'react';

export const EligibilityCard = ({ guidance, onDecision }) => {
  const isSafe = guidance === 'SAFE FOR TOMORROW' || guidance === 'Fit';
  
  return (
    <div className="card" style={{ 
      marginTop: '1.5rem',
      background: 'rgba(0, 0, 0, 0.2)',
      border: '1px solid var(--border-color)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
        Next-Day Work Eligibility Report
      </div>
      
      {/* Guidance Section */}
      <div style={{ 
        display: 'inline-block',
        padding: '0.5rem 1.5rem',
        borderRadius: '20px',
        background: isSafe ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
        color: isSafe ? 'var(--success)' : 'var(--danger)',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        marginBottom: '1.5rem',
        border: `1px solid ${isSafe ? 'var(--success)' : 'var(--danger)'}`
      }}>
        SYSTEM GUIDANCE: {guidance.toUpperCase()}
      </div>
      
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Based on post-shift vitals, the worker {isSafe ? 'appears fit' : 'shows signs of fatigue'}. 
        Admin must manually certify eligibility.
      </p>

      {/* Manual Admin Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button 
          className="btn btn-primary" 
          style={{ background: 'var(--success)', border: 'none', color: '#fff' }}
          onClick={() => onDecision('Fit')}
        >
          MARK FIT FOR TOMORROW
        </button>
        <button 
          className="btn btn-danger" 
          onClick={() => onDecision('Needs Rest')}
        >
          MARK NOT FIT / NEEDS REST
        </button>
      </div>
    </div>
  );
};
