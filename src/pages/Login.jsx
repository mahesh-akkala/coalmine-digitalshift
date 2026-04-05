import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'fingerprint'
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleFingerprintScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    }, 2500);
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '420px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⛏️</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            CoalShift Monitoring
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Supervisor Secure Access</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', padding: '4px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
           <button 
             onClick={() => setLoginMethod('password')}
             style={{ 
               flex: 1, 
               padding: '0.6rem', 
               borderRadius: 'var(--radius-sm)',
               background: loginMethod === 'password' ? 'var(--accent-primary)' : 'transparent',
               color: loginMethod === 'password' ? '#000' : 'var(--text-secondary)',
               fontWeight: '600',
               fontSize: '0.8rem'
             }}
           >
             Password
           </button>
           <button 
             onClick={() => setLoginMethod('fingerprint')}
             style={{ 
               flex: 1, 
               padding: '0.6rem', 
               borderRadius: 'var(--radius-sm)',
               background: loginMethod === 'fingerprint' ? 'var(--accent-primary)' : 'transparent',
               color: loginMethod === 'fingerprint' ? '#000' : 'var(--text-secondary)',
               fontWeight: '600',
               fontSize: '0.8rem'
             }}
           >
             Fingerprint
           </button>
        </div>
        
        {loginMethod === 'password' ? (
          <form onSubmit={handlePasswordLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Admin Username</label>
              <input type="text" placeholder="Enter Username" defaultValue="admin_mining_01" required />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Security Password</label>
              <input type="password" placeholder="••••••••" defaultValue="password123" required />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
              SECURE LOGIN
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '120px', 
              height: '160px', 
              background: '#252525', 
              border: '2px dashed var(--border-color)', 
              borderRadius: '15px', 
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{ fontSize: '4rem', opacity: isVerified ? 1 : (isScanning ? 0.3 : 0.6) }}>☝️</span>
              {isScanning && (
                <div style={{ 
                  position: 'absolute', 
                  top: '0', 
                  left: '0',
                  width: '100%', 
                  height: '3px', 
                  background: 'var(--accent-primary)',
                  boxShadow: '0 0 15px var(--accent-primary)',
                  animation: 'scan-anim 1.5s infinite ease-in-out'
                }}></div>
              )}
              {isVerified && (
                <div style={{ position: 'absolute', bottom: '10px', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  ✓ VERIFIED
                </div>
              )}
            </div>
            
            <button 
              className="btn btn-outline" 
              style={{ width: '100%', padding: '1rem' }}
              onClick={handleFingerprintScan}
              disabled={isScanning || isVerified}
            >
              {isScanning ? 'AUTHENTICATING...' : (isVerified ? 'SUCCESS' : 'SCAN FINGERPRINT')}
            </button>
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            New Supervisor? <a href="/admin-register" onClick={(e) => {e.preventDefault(); navigate('/admin-register');}} style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Register Admin Profile</a>
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes scan-anim {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default Login;
